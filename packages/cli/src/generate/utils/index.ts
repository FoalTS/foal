// std
import * as fs from 'fs';
import { join } from 'path';

export { Generator } from './generator';
export { mkdirIfDoesNotExist } from './mkdir-if-does-not-exist';
export { TestEnvironment } from './test-environment';

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
  return fs.readFileSync(join(__dirname, '../templates-spec', src), 'utf8');
}

export function readFileFromRoot(src: string): string {
  return fs.readFileSync(src, 'utf8');
}

export function getNames(name: string): { camelName: string, kebabName: string, upperFirstCamelName: string } {
  const camelName = name.replace(/-([a-z])/gi, g => g[1].toUpperCase());
  const kebabName = name.replace(/([a-z][A-Z])/g, g => `${g[0]}-${g[1].toLowerCase()}`);
  const upperFirstCamelName = camelName.charAt(0).toUpperCase() + camelName.slice(1);

  return { camelName, kebabName, upperFirstCamelName };
}
