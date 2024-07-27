import { join, relative } from 'path';

import { red } from 'colors/safe';
import { FileSystem } from '../../file-system';

export function connectReact(path: string) {
  const fs = new FileSystem();

  if (!fs.exists(path)) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(red(`  The directory ${path} does not exist.`));
    }
    return;
  }

  if (!fs.exists(join(path, 'package.json'))) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(red(`  The directory ${path} is not a React project (missing package.json).`));
    }
    return;
  }

  const outputPath = join(relative(path, process.cwd()), 'public')
    // Make projects generated on Windows build on Unix.
    .replace(/\\/g, '/');

  fs
    .cd(path)
    .modify('package.json', content => {
      const pkg = JSON.parse(content);
      pkg.proxy = 'http://localhost:3001';
      return JSON.stringify(pkg, null, 2);
    })
    .copy('react/env.development', '.env.development')
    .render('react/env', '.env', { path: outputPath });
}
