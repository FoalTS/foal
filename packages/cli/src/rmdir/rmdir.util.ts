// std
import { rm, readdir } from 'node:fs/promises';

/**
 * Remove a directory and all its contents, including any subdirectories and files.
 *
 * @export
 * @param {string} path - The path of the directory
 * @returns {Promise<void>}
 */
export async function rmdir(path: string): Promise<void> {
  try {
    await readdir(path);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  await rm(path, { recursive: true });
}
