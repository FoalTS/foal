// std
import { Readable } from 'stream';

// 3p
import { Config, generateToken, streamToBuffer } from '@foal/core';
import { Disk, FileDoesNotExist } from '@foal/storage';
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, S3Client, S3ClientConfig, ServerSideEncryption } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

/**
 * File storage to read, write and delete files in AWS S3.
 *
 * @export
 * @class S3Disk
 * @extends {Disk}
 */
export class S3Disk extends Disk {

  async write(
    dirname: string,
    content: Buffer | Readable,
    options: { name?: string } | { extension?: string } = {}
  ): Promise<{ path: string; }> {
    let name = this.hasName(options) ? options.name : await generateToken();

    if (this.hasExtension(options)) {
      name = `${name}.${options.extension}`;
    }

    const path = `${dirname}/${name}`;

    // We cannot use a "PutObjectCommand" command here
    // because we would need to know the file size when "content" is a stream.
    const parallelUploads = new Upload({
      client: this.s3,
      params: {
        Body: content,
        Bucket: this.bucket,
        Key: path,
        ServerSideEncryption: Config.get('settings.disk.s3.serverSideEncryption', 'string') as ServerSideEncryption | undefined,
      }
    })
    await parallelUploads.done();

    return { path };
  }

  async read<C extends 'buffer' | 'stream'>(
    path: string,
    content: C
  ): Promise<{ file: C extends 'buffer' ? Buffer : C extends 'stream' ? Readable : never; size: number; }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });
      const { Body, ContentLength } = await this.s3.send(command);

      if (ContentLength === undefined) {
        throw new Error('Expected to have a content-length header in HTTP response.');
      }

      if (Body === undefined) {
        throw new Error('Expected to have a body in HTTP response.');
      }

      // "Body" is of type Readable on Node and of type ReadableStream | Blob on the browser.
      // See https://github.com/aws/aws-sdk-js-v3/issues/1877.
      const stream = Body as Readable;

      // Do not kill the process (and crash the server) if the stream emits an error.
      // Note: users can still add other listeners to the stream to "catch" the error.
      // TODO: test this line.
      stream.on('error', () => {});

      return {
        file: (content === 'buffer' ? await streamToBuffer(stream) : stream) as any,
        size: ContentLength
      };
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }
  }

  async readSize(path: string): Promise<number> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: path,
      });
      const { ContentLength }  = await this.s3.send(command);

      if (ContentLength === undefined) {
        throw new Error('Expected to have a content-length header in HTTP response.');
      }

      return ContentLength;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }
  }

  async delete(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: path
    });
    await this.s3.send(command);
  }

  private get bucket(): string {
    return Config.getOrThrow(
      'settings.disk.s3.bucket',
      'string',
      'You must provide a bucket name when using AWS S3 file storage (S3Disk).'
    );
  }

  private _s3: S3Client;

  private get s3(): S3Client {
    if (!this._s3) {
      const s3Config: S3ClientConfig = {
        endpoint: Config.get('settings.aws.endpoint', 'string'),
      };

      const accessKeyId = Config.get('settings.aws.accessKeyId', 'string');
      const secretAccessKey = Config.get('settings.aws.secretAccessKey', 'string');
      if (accessKeyId && secretAccessKey) {
        s3Config.credentials = { accessKeyId, secretAccessKey }
      }

      const region = Config.get('settings.aws.region', 'string');
      if (region) {
        s3Config.region = region;
      }

      this._s3 = new S3Client(s3Config);
    }

    return this._s3;
  }

}
