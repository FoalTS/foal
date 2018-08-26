// std
import * as fs from 'fs';
import { join } from 'path';

export { Generator } from './generator';
export { mkdirIfDoesNotExist } from './mkdir-if-does-not-exist';
export { TestEnvironment } from './test-environment';
export { getNames } from './get-names';

export function mkdirIfNotExists(path: string) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`CREATE ${path}`);
  }
  const paths = path.split('/');
  const paths2: string[] = [];
  while (paths.length > 0) {
    paths2.push(paths.shift() as string);
    if (!fs.existsSync(paths2.join('/'))) {
      fs.mkdirSync(paths2.join('/'));
    }
  }
}

export function rmfileIfExists(path: string) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

export function rmdirIfExists(path: string) {
  if (fs.existsSync(path)) {
    fs.rmdirSync(path);
  }
}

export function readFileFromTemplatesSpec(src: string): string {
  return fs.readFileSync(join(__dirname, '../specs', src), 'utf8');
}

export function readFileFromRoot(src: string): string {
  return fs.readFileSync(src, 'utf8');
}
