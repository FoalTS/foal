import { join } from 'path';

import { red } from 'colors/safe';
import { existsSync } from 'fs';
import { Generator } from '../../utils';

export function connectReact(path: string) {
  if (!existsSync(path)) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} does not exist.`));
    }
    return;
  }

  if (!existsSync(join(path, 'package.json'))) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} is not a React project (missing package.json).`));
    }
    return;
  }

  new Generator('react', path)
    .updateFile('package.json', content => {
      const pkg = JSON.parse(content);
      pkg.proxy = 'http://localhost:3001';
      return JSON.stringify(pkg, null, 2);
    });
}
