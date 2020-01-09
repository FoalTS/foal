// std
import { strictEqual } from 'assert';
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { Readable } from 'stream';

// 3p
import { createService } from '@foal/core';

// FoalTS
import { FileDoesNotExist } from './abstract-disk.service';
import { LocalDisk } from './local-disk.service';

function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

describe('LocalDisk', () => {

  let disk: LocalDisk;

  beforeEach(() => {
    process.env.SETTINGS_DISK_LOCAL_DIRECTORY = 'uploaded';
    if (!existsSync('uploaded')) {
      mkdirSync('uploaded');
    }

    disk = createService(LocalDisk);
  });

  afterEach(() => {
    delete process.env.SETTINGS_DISK_LOCAL_DIRECTORY;
    if (existsSync('uploaded/test.txt')) {
      unlinkSync('uploaded/test.txt');
    }
    if (existsSync('uploaded')) {
      rmdirSync('uploaded');
    }
  });

  describe('has a "read" method that', () => {

    it('should throw an Error if no directory is specified in the config.');

    it('should read the file at the given path (buffer).', async () => {
      writeFileSync('uploaded/test.txt', 'hello', 'utf8');
      strictEqual(existsSync('uploaded/test.txt'), true);

      const { file } = await disk.read('test.txt', 'buffer');
      strictEqual(file.toString('utf8'), 'hello');
    });

    it('should read the file at the given path (stream).', async () => {
      writeFileSync('uploaded/test.txt', 'hello', 'utf8');
      strictEqual(existsSync('uploaded/test.txt'), true);

      const { file } = await disk.read('test.txt', 'stream');
      const buffer = await streamToBuffer(file);
      strictEqual(buffer.toString('utf8'), 'hello');
    });

    it('should throw a FileDoesNotExist if there is no file at the given path (buffer).', async () => {
      try {
        await disk.read('test.txt', 'buffer');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof FileDoesNotExist)) {
          throw new Error('The method should have thrown a FileDoesNotExist error.');
        }
        strictEqual(error.filename, 'test.txt');
      }
    });

    xit('should throw a FileDoesNotExist if there is no file at the given path (stream).', async () => {
      try {
        await disk.read('test.txt', 'stream');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof FileDoesNotExist)) {
          throw new Error('The method should have thrown a FileDoesNotExist error.');
        }
        strictEqual(error.filename, 'test.txt');
      }
    });

    it('should return the file size.', async () => {
      writeFileSync('uploaded/test.txt', 'hello', 'utf8');
      strictEqual(existsSync('uploaded/test.txt'), true);

      const { size } = await disk.read('test.txt', 'buffer');
      strictEqual(size, 5);
    });

  });

  describe('has a "delete" method that', () => {

    it('should throw an Error if no directory is specified in the config.');

    it('should delete the file at the given path.', async () => {
      writeFileSync('uploaded/test.txt', 'hello', 'utf8');
      strictEqual(existsSync('uploaded/test.txt'), true);

      await disk.delete('test.txt');
      strictEqual(existsSync('uploaded/test.txt'), false);
    });

    it('should throw a FileDoesNotExist if there is no file at the given path.', async () => {
      try {
        await disk.delete('test.txt');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof FileDoesNotExist)) {
          throw new Error('The method should have thrown a FileDoesNotExist error.');
        }
        strictEqual(error.filename, 'test.txt');
      }
    });

  });

});
