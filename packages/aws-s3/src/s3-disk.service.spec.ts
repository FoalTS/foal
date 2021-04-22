// std
import { strictEqual } from 'assert';
import { Readable } from 'stream';

// 3p
import { Config, ConfigNotFoundError, createService, streamToBuffer } from '@foal/core';
import { FileDoesNotExist } from '@foal/storage';
import { S3 } from '@aws-sdk/client-s3';

// FoalTS
import { S3Disk } from './s3-disk.service';

// Isolate each job with a different S3 bucket.
const bucketName = `foal-test-${process.env.NODE_VERSION || 10}`;

async function rmObjectsIfExist(s3: S3) {
  const response = await s3.listObjects({
    Bucket: bucketName
  });

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
  });
}

describe('S3Disk', () => {

  let disk: S3Disk;
  let s3: S3;

  const accessKeyId = Config.get('settings.aws.accessKeyId', 'string');

  if (!accessKeyId) {
    console.warn('SETTINGS_AWS_ACCESS_KEY_ID not defined. Skipping S3Disk tests...');
    return;
  }

  const secretAccessKey = Config.getOrThrow('settings.aws.secretAccessKey', 'string');
  const region = Config.getOrThrow('settings.aws.region', 'string');

  before(() => s3 = new S3({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    }
  }));

  beforeEach(() => {
    Config.set('settings.disk.s3.bucket', bucketName);

    disk = createService(S3Disk);
  });

  afterEach(async () => {
    Config.remove('settings.disk.s3.bucket');
    Config.remove('settings.aws.endpoint');
    await rmObjectsIfExist(s3);
  });


  it('should accept a S3 custom endpoint in the config.', async () => {
    // This test assumes that the "delete" method tries at least to connect to AWS.
    Config.set('settings.aws.endpoint', 'nyc3.digitaloceanspaces.com');

    try {
      await disk.delete('foo/test.txt');
      throw new Error('An error should have been thrown.');
    } catch (error) {
      if (error.code !== 'NetworkingError' && error.code !== 'UnknownEndpoint') {
        throw new Error(`Invalid error code: ${error.code}`);
      }
    }
  });

  describe('has a "write" method that', () => {

    it('should throw an Error if no bucket is specified in the config.', async () => {
      Config.remove('settings.disk.s3.bucket');

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

      const response = await s3.getObject({ Bucket: bucketName, Key: 'foo/test.txt' });
      const buffer = await streamToBuffer(response.Body as Readable);

      strictEqual(
        buffer.toString('utf8'),
        'hello'
      );
    });

    it('should write the file at the given path (stream) (name given).', async () => {
      const stream = new Readable();
      stream.push(Buffer.from('hello', 'utf8'));
      stream.push(null);
      await disk.write('foo', stream, { name: 'test.txt' });

      const response = await s3.getObject({ Bucket: bucketName, Key: 'foo/test.txt' });
      const buffer = await streamToBuffer(response.Body as Readable);

      strictEqual(
        buffer.toString('utf8'),
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
      Config.remove('settings.disk.s3.bucket');

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
      });

      const { file } = await disk.read('foo/test.txt', 'buffer');
      strictEqual(file.toString('utf8'), 'hello');
    });

    it('should read the file at the given path (stream).', async () => {
      await s3.putObject({
        Body: 'hello',
        Bucket: bucketName,
        Key: 'foo/test.txt',
      });

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
      });

      const { size } = await disk.read('foo/test.txt', 'buffer');
      strictEqual(size, 5);
    });

    it('should return the file size (stream).', async () => {
      await s3.putObject({
        Body: Buffer.from('hello', 'utf8'),
        Bucket: bucketName,
        Key: 'foo/test.txt',
      });

      const { size } = await disk.read('foo/test.txt', 'stream');
      strictEqual(size, 5);
    });

  });

  describe('has a "readSize" method that', () => {

    it('should throw an Error if no bucket is specified in the config.', async () => {
      Config.remove('settings.disk.s3.bucket');

      try {
        await disk.readSize('foo');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof ConfigNotFoundError)) {
          throw new Error('A ConfigNotFoundError should have been thrown.');
        }
        strictEqual(error.key, 'settings.disk.s3.bucket');
        strictEqual(error.msg, 'You must provide a bucket name when using AWS S3 file storage (S3Disk).');
      }
    });

    it('should throw a FileDoesNotExist if there is no file at the given path.', async () => {
      try {
        await disk.readSize('foo/test.txt');
        throw new Error('An error should have been thrown.');
      } catch (error) {
        if (!(error instanceof FileDoesNotExist)) {
          throw new Error('The method should have thrown a FileDoesNotExist error.');
        }
        strictEqual(error.filename, 'foo/test.txt');
      }
    });

    it('should return the file size.', async () => {
      await s3.putObject({
        Body: Buffer.from('hello', 'utf8'),
        Bucket: bucketName,
        Key: 'foo/test.txt',
      });

      const size = await disk.readSize('foo/test.txt');
      strictEqual(size, 5);
    });

  });

  describe('has a "delete" method that', () => {

    it('should throw an Error if no bucket is specified in the config.', async () => {
      Config.remove('settings.disk.s3.bucket');

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
      });

      await disk.delete('foo/test.txt');

      try {
        await s3.getObject({
          Bucket: bucketName,
          Key: 'foo/test.txt',
        });
      } catch (error: any) {
        if (error.name !== 'NoSuchKey') {
          throw error;
        }
      }
    });

  });

});
