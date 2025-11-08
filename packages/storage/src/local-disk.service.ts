// std
import { createReadStream, createWriteStream } from 'fs';
import { readFile, stat, writeFile, unlink, mkdir } from 'node:fs/promises';
import { join } from 'path';
import { pipeline, Readable } from 'stream';
import { promisify } from 'util';
import { existsSync } from 'node:fs';

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

  async mkdirIfNotExists(dirname: string): Promise<void> {
    const dirPath = this.getPath(dirname);
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }
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

    const path = join(dirname, name);

    if (content instanceof Buffer) {
      await writeFile(this.getPath(path), content);
    } else {
      await promisify(pipeline)(content, createWriteStream(this.getPath(path)));
    }

    return { path };
  }

  async read<C extends 'buffer' | 'stream'>(
    path: string,
    content: C
  ): Promise<{ file: C extends 'buffer' ? Buffer : C extends 'stream' ? Readable : never; size: number; }> {
    try {
      const { size } = await stat(this.getPath(path));

      if (content === 'buffer') {
        return {
          file: await readFile(this.getPath(path)) as any,
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
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }

  }

  async readSize(path: string): Promise<number> {
    try {
      const { size } = await stat(this.getPath(path));
      return size;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new FileDoesNotExist(path);
      }
      // TODO: test this line.
      throw error;
    }

  }

  async delete(path: string): Promise<void> {
    try {
      await unlink(this.getPath(path));
    } catch (error: any) {
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
