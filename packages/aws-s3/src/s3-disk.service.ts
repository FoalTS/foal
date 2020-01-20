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
    if (content === 'buffer') {
      try {
        const { Body, ContentLength } = await this.s3.getObject({
          Bucket: this.getBucket(),
          Key: path,
        }).promise();
        return {
          file: Body as any,
          size: ContentLength as number
        };
      } catch (error) {
        if (error.code === 'NoSuchKey') {
          throw new FileDoesNotExist(path);
        }
        // TODO: test this line.
        throw error;
      }
    }

    return new Promise((resolve, reject) => {
      this.s3
        .getObject({
          Bucket: this.getBucket(),
          Key: path,
        })
        .on('httpHeaders', function(this: any, statusCode, headers, response) {
          if (statusCode === 400) {
            // This if-condition is a hack.
            // If the s3 object has not sent a request yet, it may send two requests here.
            // The first one returns a 400 response that requires the client to send the
            // request to the proper AWS region.
            // This is a tricky bug that only appears if we run one test.
            // We ignore the first request here by exiting the function.
            return;
          }
          if (statusCode === 404) {
            this.abort();
            return reject(new FileDoesNotExist(path));
          }
          resolve({
            file: response.httpResponse.createUnbufferedStream() as any,
            size: parseInt(headers['content-length'], 10),
          });
        }).send();
    });
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
