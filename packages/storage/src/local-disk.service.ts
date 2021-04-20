// std
import { createReadStream, createWriteStream, readFile, stat, unlink, writeFile } from 'fs';
import { join } from 'path';
import { pipeline, Readable } from 'stream';
import { promisify } from 'util';

// 3p
import { Config, generateToken } from '@foal/core';

// FoalTS
import { Disk, FileDoesNotExist } from './disk.service';

/**
 * File storage to write, read and delete files in the local file system.
 *
 * @export
 * @class LocalDisk
 * @extends {Disk}
 */
export class LocalDisk extends Disk {

  async write(
    dirname: string,
    content: Buffer | Readable,
    options: { name?: string } | { extension?: string } = {}
  ): Promise<{ path: string; }> {
    let name = this.hasName(options) ? options.name : await generateToken();

    if (this.hasExtension(options)) {
      name = `${name}.${options.extension}`;
    }

    const path = join(dirname, name);

    if (content instanceof Buffer) {
      await promisify(writeFile)(this.getPath(path), content);
    } else {
      await new Promise((resolve, reject) => {
        pipeline(content, createWriteStream(this.getPath(path)), err => {
          // Note: error streams are unlikely to occur (most "createWriteStream" errors are simply thrown).
          // TODO: test the error case.
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    }

    return { path };
  }

  async read<C extends 'buffer' | 'stream'>(
    path: string,
    content: C
  ): Promise<{ file: C extends 'buffer' ? Buffer : C extends 'stream' ? Readable : never; size: number; }> {
    try {
      const { size } = await promisify(stat)(this.getPath(path));

      if (content === 'buffer') {
        return {
          file: await promisify(readFile)(this.getPath(path)) as any,
          size
        };
      }

      return {
        file: createReadStream(this.getPath(path))
          // Do not kill the process (and crash the server) if the stream emits an error.
          // Note: users can still add other listeners to the stream to "catch" the error.
          // Note: error streams are unlikely to occur (most "createWriteStream" errors are simply thrown).
          // TODO: test this line.
          .on('error', () => {}) as any,
        size
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }

  }

  async readSize(path: string): Promise<number> {
    try {
      const { size } = await promisify(stat)(this.getPath(path));
      return size;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }

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
    const directory = Config.getOrThrow(
      'settings.disk.local.directory',
      'string',
      'You must provide a directory name when using local file storage (LocalDisk).'
    );
    return join(directory, path);
  }

}

export { LocalDisk as ConcreteDisk };
