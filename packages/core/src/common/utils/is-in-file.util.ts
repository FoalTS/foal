// std
import { readFile } from 'node:fs/promises';

/**
 * Generate a function checking if a string is included in a text file.
 *
 * @export
 * @param {string} path - The file path.
 * @returns {(content: string) => Promise<boolean>} The generated function.
 */
export function isInFile(path: string): (content: string) => Promise<boolean> {
  return async (content: string) => {
    const fileContent = await readFile(path, 'utf8');
    return fileContent.includes(content);
  };
}
