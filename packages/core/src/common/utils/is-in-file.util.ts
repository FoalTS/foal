// std
import { readFile } from 'fs';
import { promisify } from 'util';

export function isInFile(path: string): (content: string) => Promise<boolean> {
  return async (content: string) => {
    const fileContent = await promisify(readFile)(path, 'utf8');
    return fileContent.includes(content);
  };
}
