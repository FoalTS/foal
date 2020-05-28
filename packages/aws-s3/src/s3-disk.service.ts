// std
import { Readable } from 'stream';

// 3p
import { Config, generateToken } from '@foal/core';
import { AbstractDisk, FileDoesNotExist } from '@foal/storage';
import * as S3 from 'aws-sdk/clients/s3';

/**
 * File storage to read, write and delete files in AWS S3.
 *
 * @export
 * @class S3Disk
 * @extends {AbstractDisk}
 */
export class S3Disk extends AbstractDisk {

  private s3: S3;

  async write(
    dirname: string,
    content: Buffer | NodeJS.ReadableStream,
    options: { name?: string } | { extension?: string } = {}
  ): Promise<{ path: string; }> {
    let name = this.hasName(options) ? options.name : await generateToken();

    if (this.hasExtension(options)) {
      name = `${name}.${options.extension}`;
    }

    const path = `${dirname}/${name}`;

    await this.getS3().upload({
      Body: content,
      Bucket: this.getBucket(),
      Key: path,
    }).promise();

    return { path };
  }

  async read<C extends 'buffer' | 'stream'>(
    path: string,
    content: C
  ): Promise<{ file: C extends 'buffer' ? Buffer : C extends 'stream' ? Readable : never; size: number; }> {
    try {
      if (content === 'buffer') {
        const { Body, ContentLength } = await this.getS3().getObject({
          Bucket: this.getBucket(),
          Key: path,
        }).promise();

        return {
          file: Body as any,
          size: ContentLength as number
        };
      }

      const { ContentLength }  = await this.getS3().headObject({
        Bucket: this.getBucket(),
        Key: path,
      }).promise();

      const stream = this.getS3().getObject({
        Bucket: this.getBucket(),
        Key: path,
      }).createReadStream()
        // Do not kill the process (and crash the server) if the stream emits an error.
        // Note: users can still add other listeners to the stream to "catch" the error.
        // Note: error streams are unlikely to occur ("headObject" may have thrown these errors previously).
        // TODO: test this line.
        .on('error', () => {});

      return {
        file: stream as any,
        size: ContentLength as number
      };
    } catch (error) {
      if (error.code === 'NoSuchKey' || error.code === 'NotFound') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }
  }

  async delete(path: string): Promise<void> {
    await this.getS3().deleteObject({
      Bucket: this.getBucket(),
      Key: path
    }).promise();
  }

  private getBucket(): string {
    return Config.getOrThrow(
      'settings.disk.s3.bucket',
      'string',
      'You must provide a bucket name when using AWS S3 file storage (S3Disk).'
    );
  }

  private getS3(): S3 {
    if (!this.s3) {
      this.s3 = new S3({
        accessKeyId: Config.get('settings.aws.accessKeyId', 'string'),
        apiVersion: '2006-03-01',
        endpoint: Config.get('settings.aws.endpoint', 'string'),
        secretAccessKey: Config.get('settings.aws.secretAccessKey', 'string'),
      });
    }
    return this.s3;
  }

}
