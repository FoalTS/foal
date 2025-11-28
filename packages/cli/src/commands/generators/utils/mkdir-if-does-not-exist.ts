// std
import { existsSync, mkdirSync } from 'fs';

export function mkdirIfDoesNotExist(path: string) {
  const paths = path.split('/');
  const paths2: string[] = [];
  while (paths.length > 0) {
    paths2.push(paths.shift() as string);
    if (!existsSync(paths2.join('/'))) {
      mkdirSync(paths2.join('/'));
    }
  }
}
