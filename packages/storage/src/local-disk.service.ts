// std
import { Readable } from 'stream';

// FoalTS
import { Config, dependency } from '@foal/core';
import { createReadStream, readFile, ReadStream, stat, unlink, WriteStream } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { AbstractDisk, FileDoesNotExist } from './abstract-disk.service';

export class LocalDisk extends AbstractDisk {

  @dependency
  config: Config;

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
    let file: any;
    let size: number;
    try {
      size = (await promisify(stat)(this.getPath(path))).size;
      if (content === 'buffer') {
        file = await promisify(readFile)(this.getPath(path));
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }
    if (content === 'stream') {
      file = createReadStream(this.getPath(path));
    }

    return {
      file,
      size
    };
  }

  async delete(path: string): Promise<void> {
    try {
      await promisify(unlink)(this.getPath(path));
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }
  }

  private getPath(path: string): string {
    const directory = this.config.get<string>('settings.disk.local.directory', '');
    return join(directory, path);
  }

}
