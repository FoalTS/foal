// std
import { readdir, rmdir as fsRmdir, stat, unlink } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

/**
 * Remove a directory and all its contents, including any subdirectories and files.
 *
 * @export
 * @param {string} path - The path of the directory
 * @returns {Promise<void>}
 */
export async function rmdir(path: string): Promise<void> {
  const contents = await promisify(readdir)(path);

  await Promise.all(contents.map(content => {
    const subPath = join(path, content);
    return promisify(stat)(subPath)
      .then(stats => {
        if (stats.isDirectory()) {
          return rmdir(subPath);
        }
        return promisify(unlink)(subPath);
      });
  }));

  await promisify(fsRmdir)(path);
}
