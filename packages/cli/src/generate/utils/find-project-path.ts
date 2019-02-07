import { existsSync } from 'fs';
import { join, parse } from 'path';

export function findProjectPath(): string|null {
  let path = process.cwd();
  const root = parse(path).root;

  while (path !== root) {
    if (existsSync(join(path, 'package.json'))) {
      break;
    }
    path = parse(path).dir;
  }

  if (path === root) {
    return null;
  }

  return path;
}
