import { join } from 'path';

import { red } from 'colors/safe';
import { FileSystem } from '../../file-system';

export function connectReact(path: string) {
  const fs = new FileSystem();

  if (!fs.exists(path)) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} does not exist.`));
    }
    return;
  }

  if (!fs.exists(join(path, 'package.json'))) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} is not a React project (missing package.json).`));
    }
    return;
  }

  fs
    .cd(path)
    .modify('package.json', content => {
      const pkg = JSON.parse(content);
      pkg.proxy = 'http://localhost:3001';
      return JSON.stringify(pkg, null, 2);
    });
}
