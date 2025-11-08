// std
import { doesNotReject, strictEqual } from 'assert';
import { Readable } from 'stream';

// 3p
import { HttpResponseOK } from '@foal/core';

// FoalTS
import { join } from 'path';
import { Disk as AbstractDisk, FileDoesNotExist, isFileDoesNotExist } from './disk.service';

describe('FileDoesNotExist', () => {

  it('should set a property "filename".', () => {
    const error = new FileDoesNotExist('foo/test.txt');
    strictEqual(error.filename, 'foo/test.txt');
  });

  it('should instanciate with the proper message.', () => {
    const error = new FileDoesNotExist('foo/test.txt');
    strictEqual(error.message, 'The file "foo/test.txt" does not exist.');
  });

});

describe('isFileDoesNotExist', () => {

  it('should return true if the given object is an instance of FileDoesNotExist.', () => {
    const err = new FileDoesNotExist('');
    strictEqual(isFileDoesNotExist(err), true);
  });

  it('should return true if the given object has a "name" property equal to "FileDoesNotExist".', () => {
    const err = { name: 'FileDoesNotExist' };
    strictEqual(isFileDoesNotExist(err), true);
  });

  it('should return false if the given object is not an instance of HttpResponse and if it '
      + 'has no property isHttpResponse.', () => {
    const err = {};
    strictEqual(isFileDoesNotExist(err), false);
    strictEqual(isFileDoesNotExist(undefined), false);
    strictEqual(isFileDoesNotExist(null), false);
  });

});

describe('AbstractDisk', () => {

  const stream = new Readable();
  const streamSize = 35;

  class Disk extends AbstractDisk {

    write(
      dirname: string,
      content: Buffer | Readable,
      options?: { name?: string | undefined; } | undefined
    ): Promise<{ path: string; }> {
      throw new Error('Method not implemented.');
    }

    async read<C extends 'buffer' | 'stream'>(
      path: string,
      content: C
    ): Promise<{ file: C extends 'buffer' ? Buffer : C extends 'stream' ? Readable : never; size: number; }> {
      if (content !== 'stream') {
        throw new Error('should not throw');
      }
      return {
        file: stream as any,
        size: streamSize
      };
    }

    async readSize(path: string): Promise<number> {
      return -1;
    }

    delete(path: string): Promise<void> {
      throw new Error('Method not implemented.');
    }

  }

  let disk: Disk;

  beforeEach(() => disk = new Disk());

  it('should support concrete services.', () => {
    strictEqual(AbstractDisk.concreteClassConfigPath, 'settings.disk.driver');
    strictEqual(AbstractDisk.concreteClassName, 'ConcreteDisk');
  });

  it('should define LocalDisk as default concrete service.', () => {
    strictEqual(AbstractDisk.defaultConcreteClassPath, join(__dirname, './local-disk.service'));
  });

  describe('have a "mkdirIfNotExists" method that', () => {

    it('should do nothing by default.', async () => {
      await doesNotReject(() => disk.mkdirIfNotExists('foo/bar'));
    });

  });

  describe('has a "createHttpResponse" method that', () => {

    const path = 'foo/test-file.png';

    describe('should return an http response that', () => {

      it('should be an HttpResponseOK.', async () => {
        const response = await disk.createHttpResponse(path);
        strictEqual(
          response instanceof HttpResponseOK, true,
          'The response should be an instance of response instanceof HttpResponseOK'
        );
      });

      it('should have a property stream set to true.', async () => {
        const response = await disk.createHttpResponse(path);
        strictEqual(response.stream, true);
      });

      it('should have a body property which value is the readable stream returned by the "read" method.', async () => {
        const response = await disk.createHttpResponse(path);
        strictEqual(response.body, stream);
      });

      it('should have a correct Content-Type header based on the file extension.', async () => {
        const response = await disk.createHttpResponse(path);
        strictEqual(response.getHeader('Content-Type'), 'image/png');
      });

      it('should have a Content-Type header equal to "application/octet-stream" when the file extension cannot be computed.', async () => {
        const response = await disk.createHttpResponse('test-file');
        strictEqual(response.getHeader('Content-Type'), 'application/octet-stream');
      })

      it('should have a correct Content-Length header based on the file size.', async () => {
        const httpResponse = await disk.createHttpResponse(path);
        strictEqual(httpResponse.getHeader('Content-Length'), streamSize.toString());
      });

      it('should have a correct Content-Disposition header based on the filename '
      + 'and forceDownload options.', async () => {
        let response = await disk.createHttpResponse(path);
        strictEqual(response.getHeader('Content-Disposition'), 'inline; filename="test-file.png"');

        response = await disk.createHttpResponse(path, {
          filename: 'download.png'
        });
        strictEqual(response.getHeader('Content-Disposition'), 'inline; filename="download.png"');

        response = await disk.createHttpResponse(path, {
          forceDownload: true
        });
        strictEqual(response.getHeader('Content-Disposition'), 'attachment; filename="test-file.png"');

        response = await disk.createHttpResponse(path, {
          filename: 'download.png',
          forceDownload: true,
        });
        strictEqual(response.getHeader('Content-Disposition'), 'attachment; filename="download.png"');
      });

      it('should have a correct Cache-Control header based on the "cache" option.', async () => {
        let response = await disk.createHttpResponse(path);
        strictEqual(response.getHeader('Cache-Control'), undefined);

        response = await disk.createHttpResponse(path, {
          cache: 'no-cache'
        });
        strictEqual(response.getHeader('Cache-Control'), 'no-cache');
      });

    });

  });

});
