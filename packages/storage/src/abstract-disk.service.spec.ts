// std
import { strictEqual } from 'assert';
import { Readable } from 'stream';

// 3p
import { HttpResponseOK } from '@foal/core';

// FoalTS
import { AbstractDisk } from './abstract-disk.service';

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

    delete(path: string): Promise<void> {
      throw new Error('Method not implemented.');
    }

  }

  let disk: Disk;

  beforeEach(() => disk = new Disk());

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
        let response = await disk.createHttpResponse(path);
        strictEqual(response.getHeader('Content-Type'), 'image/png');

        response = await disk.createHttpResponse('test-file');
        strictEqual(response.getHeader('Content-Type'), undefined);
      });

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
        strictEqual(response.getHeader('Content-Disposition'), 'attachement; filename="test-file.png"');

        response = await disk.createHttpResponse(path, {
          filename: 'download.png',
          forceDownload: true,
        });
        strictEqual(response.getHeader('Content-Disposition'), 'attachement; filename="download.png"');
      });

    });

  });

});
