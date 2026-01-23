// std
import { rm, readdir } from 'node:fs/promises';

/**
 * Service for removing directories and all their contents.
 */
export class RmdirCommandService {
  /**
   * Remove a directory and all its contents, including any subdirectories and files.
   *
   * @param {string} path - The path of the directory
   * @returns {Promise<void>}
   */
  async run(path: string): Promise<void> {
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
}

