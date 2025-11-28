import { join, relative } from 'path';

import { red } from 'colors/safe';
import { FileSystem } from '../../../services';

export function connectVue(path: string) {
  const fs = new FileSystem();

  if (!fs.exists(path)) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(red(`  The directory ${path} does not exist.`));
    }
    return;
  }

  if (!fs.exists(join(path, 'package.json'))) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(red(`  The directory ${path} is not a Vue project (missing package.json).`));
    }
    return;
  }

  fs
    .cd(path)
    .modify('package.json', content => {
      const pkg = JSON.parse(content);
      pkg.vue = pkg.vue || {};

      // Proxy configuration
      pkg.vue.devServer = pkg.vue.devServer || {};
      pkg.vue.devServer.proxy = pkg.vue.devServer.proxy || {};
      pkg.vue.devServer.proxy['^/api'] = { target: 'http://localhost:3001' };

      // Output build directory
      const outputPath = join(relative(path, process.cwd()), 'public')
        // Make projects generated on Windows build on Unix.
        .replace(/\\/g, '/');
      pkg.vue.outputDir = outputPath;

      return JSON.stringify(pkg, null, 2);
    });
}
