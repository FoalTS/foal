// std
import { strictEqual } from 'assert';
import { Readable } from 'stream';

// 3p
import { Config, ConfigNotFoundError, createService } from '@foal/core';
import { FileDoesNotExist } from '@foal/storage';
import * as S3 from 'aws-sdk/clients/s3';

// FoalTS
import { S3Disk } from './s3-disk.service';

// Isolate each job with a different S3 bucket.
const bucketName = `foal-test-${process.env.NODE_VERSION || 8}`;

function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function rmObjectsIfExist(s3: S3) {
  const response = await s3.listObjects({
    Bucket: bucketName
  }).promise();

  const objects: { Key: string }[] = [];
  for (const { Key } of response.Contents || []) {
    if (Key) {
      objects.push({ Key });
    }
  }

  if (objects.length === 0) {
    return;
  }

  await s3.deleteObjects({
    Bucket: bucketName,
    Delete: {
      Objects: objects,
      Quiet: false
    }
  }).promise();
}

describe('S3Disk', () => {

  let disk: S3Disk;
  let s3: S3;

  const accessKeyId = Config.get<string|undefined>('settings.aws.accessKeyId');
  const secretAccessKey = Config.get<string|undefined>('settings.aws.secretAccessKey');

  if (!accessKeyId) {
    console.warn('SETTINGS_AWS_ACCESS_KEY_ID not defined. Skipping S3Disk tests...');
    return;
  }

  before(() => s3 = new S3({
    accessKeyId,
    apiVersion: '2006-03-01',
    secretAccessKey,
  }));

  beforeEach(() => {
    process.env.SETTINGS_DISK_S3_BUCKET = bucketName;

    disk = createService(S3Disk);
  });

  afterEach(async () => {
    delete process.env.SETTINGS_DISK_S3_BUCKET;
    delete process.env.SETTINGS_AWS_ENDPOINT;
    await rmObjectsIfExist(s3);
  });

  it('should accept a S3 custom endpoint in the config.', async () => {
    // This test assumes that the "delete" method tries at least to connect to AWS.
    process.env.SETTINGS_AWS_ENDPOINT = 'foobar';
    try {
      await disk.delete('foo/test.txt');
      throw new Error('An error should have been thrown.');
    } catch (error) {
      strictEqual(
        error.code,
        'UnknownEndpoint'
      );
    }
  });

  describe('has a "write" method that', () => {

    it('should throw an Error if no bucket is specified in the config.', async () => {
      delete process.env.SETTINGS_DISK_S3_BUCKET;
      try {
        await disk.write('foo', Buffer.from('hello', 'utf8'));
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown.');
        }
        strictEqual(error.key, 'settings.disk.s3.bucket');
        strictEqual(error.msg, 'You must provide a bucket name when using AWS S3 file storage (S3Disk).');
      }
    });

    it('should write the file at the given path (buffer) (name given).', async () => {
      await disk.write('foo', Buffer.from('hello', 'utf8'), { name: 'test.txt' });

      const response = await s3.getObject({ Bucket: bucketName, Key: 'foo/test.txt' }).promise();
      if (!(response.Body instanceof Buffer)) {
        throw new Error('response.Body should be a buffer');
      }
      strictEqual(
        response.Body.toString('utf8'),
        'hello'
      );
    });

    it('should write the file at the given path (stream) (name given).', async () => {
      const stream = new Readable();
      stream.push(Buffer.from('hello', 'utf8'));
      stream.push(null);
      await disk.write('foo', stream, { name: 'test.txt' });

      const response = await s3.getObject({ Bucket: bucketName, Key: 'foo/test.txt' }).promise();
      if (!(response.Body instanceof Buffer)) {
        throw new Error('response.Body should be a buffer');
      }
      strictEqual(
        response.Body.toString('utf8'),
        'hello'
      );
    });

    it('should return the path of the file (name given).', async () => {
      const { path } = await disk.write('foo', Buffer.from('hello', 'utf8'), { name: 'test.txt' });
      strictEqual(path, 'foo/test.txt');
    });

    it('should return the path of the file (name generated with no extension).', async () => {
      const { path } = await disk.write('foo', Buffer.from('hello', 'utf8'));
      strictEqual(path.startsWith('foo/'), true);
    });

    it('should return the path of the file (name generated with the extension "txt").', async () => {
      const { path } = await disk.write('foo', Buffer.from('hello', 'utf8'), {
        extension: 'txt'
      });
      strictEqual(path.startsWith('foo/'), true);
      strictEqual(path.endsWith('.txt'), true);
    });

  });

  describe('has a "read" method that', () => {

    it('should throw an Error if no bucket is specified in the config.', async () => {
      delete process.env.SETTINGS_DISK_S3_BUCKET;
      try {
        await disk.read('foo', 'buffer');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown.');
        }
        strictEqual(error.key, 'settings.disk.s3.bucket');
        strictEqual(error.msg, 'You must provide a bucket name when using AWS S3 file storage (S3Disk).');
      }
    });

    it('should read the file at the given path (buffer).', async () => {
      await s3.putObject({
        Body: 'hello',
        Bucket: bucketName,
        Key: 'foo/test.txt',
      }).promise();

      const { file } = await disk.read('foo/test.txt', 'buffer');
      strictEqual(file.toString('utf8'), 'hello');
    });

    it('should read the file at the given path (stream).', async () => {
      await s3.putObject({
        Body: 'hello',
        Bucket: bucketName,
        Key: 'foo/test.txt',
      }).promise();

      const { file } = await disk.read('foo/test.txt', 'stream');
      const buffer = await streamToBuffer(file);
      strictEqual(buffer.toString('utf8'), 'hello');
    });

    it('should throw a FileDoesNotExist if there is no file at the given path (buffer).', async () => {
      try {
        await disk.read('foo/test.txt', 'buffer');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof FileDoesNotExist)) {
          throw new Error('The method should have thrown a FileDoesNotExist error.');
        }
        strictEqual(error.filename, 'foo/test.txt');
      }
    });

    it('should throw a FileDoesNotExist if there is no file at the given path (stream).', async () => {
      try {
        await disk.read('foo/test.txt', 'stream');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof FileDoesNotExist)) {
          throw new Error('The method should have thrown a FileDoesNotExist error.');
        }
        strictEqual(error.filename, 'foo/test.txt');
      }
    });

    it('should return the file size (buffer).', async () => {
      await s3.putObject({
        Body: Buffer.from('hello', 'utf8'),
        Bucket: bucketName,
        Key: 'foo/test.txt',
      }).promise();

      const { size } = await disk.read('foo/test.txt', 'buffer');
      strictEqual(size, 5);
    });

    it('should return the file size (stream).', async () => {
      await s3.putObject({
        Body: Buffer.from('hello', 'utf8'),
        Bucket: bucketName,
        Key: 'foo/test.txt',
      }).promise();

      const { size } = await disk.read('foo/test.txt', 'stream');
      strictEqual(size, 5);
    });

  });

  describe('has a "delete" method that', () => {

    it('should throw an Error if no bucket is specified in the config.', async () => {
      delete process.env.SETTINGS_DISK_S3_BUCKET;
      try {
        await disk.delete('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown.');
        }
        strictEqual(error.key, 'settings.disk.s3.bucket');
        strictEqual(error.msg, 'You must provide a bucket name when using AWS S3 file storage (S3Disk).');
      }
    });

    it('should delete the file at the given path.', async () => {
      await s3.putObject({
        Body: 'hello',
        Bucket: bucketName,
        Key: 'foo/test.txt',
      }).promise();

      await disk.delete('foo/test.txt');

      try {
        const response = await s3.getObject({
          Bucket: bucketName,
          Key: 'foo/test.txt',
        }).promise();
        console.log(response);
        throw new Error('An error should have been thrown');
      } catch (error) {
        if (error.code !== 'NoSuchKey') {
          throw error;
        }
      }
    });

  });

});
