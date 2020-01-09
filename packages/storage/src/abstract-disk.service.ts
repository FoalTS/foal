// std
import { basename } from 'path';
import { Readable } from 'stream';

// 3p
import { HttpResponse, HttpResponseOK } from '@foal/core';
import { getType } from 'mime';

type Type<C extends 'buffer'|'stream'> =
  C extends 'buffer' ? Buffer :
  C extends 'stream' ? Readable :
  never;

export class FileDoesNotExist extends Error {
  readonly name = 'FileDoesNotExist';
  constructor(readonly filename: string) {
    super(`The file "${filename}" does not exist.`);
  }
}

export abstract class AbstractDisk {
  abstract write(
    dirname: string,
    content: Buffer|Readable,
    options?: { name?: string },
  ): Promise<{ path: string }>;

  abstract read<C extends 'buffer'|'stream'>(path: string, content: C): Promise<{
    file: Type<C>;
    size: number;
  }>;

  abstract delete(path: string): Promise<void>;

  async createHttpResponse(
    path: string,
    options: { forceDownload?: boolean, filename?: string } = {}
  ): Promise<HttpResponse> {
    const { file, size } = await this.read(path, 'stream');
    const response = new HttpResponseOK(file, { stream: true });

    const mimeType = getType(path);
    if (mimeType) {
      response.setHeader('Content-Type', mimeType);
    }

    return response
      .setHeader('Content-Length', size.toString())
      .setHeader(
        'Content-Disposition',
        (options.forceDownload ? 'attachement' : 'inline')
        + `; filename="${options.filename || basename(path)}"`
      );
  }
}
