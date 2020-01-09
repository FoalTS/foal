// std
import { createReadStream, createWriteStream, readFile, stat, unlink, writeFile } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import { promisify } from 'util';

// 3p
import { Config, dependency, generateToken } from '@foal/core';

// FoalTS
import { AbstractDisk, FileDoesNotExist } from './abstract-disk.service';

export class LocalDisk extends AbstractDisk {

  @dependency
  config: Config;

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
      await new Promise(resolve => {
        content
          .pipe(createWriteStream(this.getPath(path)))
          .on('close', resolve);
      });
    }

    return { path };
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
