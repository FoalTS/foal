// std
import { Readable } from 'stream';

// 3p
import { Config, generateToken } from '@foal/core';
import { AbstractDisk, FileDoesNotExist } from '@foal/storage';
import * as S3 from 'aws-sdk/clients/s3';

export class S3Disk extends AbstractDisk {

  private readonly s3: S3;

  constructor() {
    super();
    this.s3 = new S3({
      accessKeyId: Config.get<string|undefined>('settings.aws.accessKeyId'),
      apiVersion: '2006-03-01',
      secretAccessKey: Config.get<string|undefined>('settings.aws.secretAccessKey'),
    });
  }

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

    await this.s3.upload({
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
        const { Body, ContentLength } = await this.s3.getObject({
          Bucket: this.getBucket(),
          Key: path,
        }).promise();

        return {
          file: Body as any,
          size: ContentLength as number
        };
      }

      const { ContentLength }  = await this.s3.headObject({
        Bucket: this.getBucket(),
        Key: path,
      }).promise();

      const stream = this.s3.getObject({
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
    await this.s3.deleteObject({
      Bucket: this.getBucket(),
      Key: path
    }).promise();
  }

  private getBucket(): string {
    const bucket = Config.get<string>('settings.disk.s3.bucket', '');
    if (!bucket) {
      throw new Error(
        '[CONFIG] You must provide a bucket name with the configuration key settings.disk.s3.bucket.'
      );
    }
    return bucket;
  }

}
