import { join, relative } from 'path';

import { red } from 'colors/safe';
import { existsSync } from 'fs';
import { Generator } from '../../utils';

export function connectVue(path: string) {
  const root = join(process.cwd(), path);

  if (!existsSync(root)) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} does not exist.`));
    }
    return;
  }

  if (!existsSync(join(root, 'package.json'))) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} is not a Vue project (missing package.json).`));
    }
    return;
  }

  new Generator('vue', root)
    .updateFile('package.json', content => {
      const pkg = JSON.parse(content);
      pkg.vue = pkg.vue || {};

      // Proxy configuration
      pkg.vue.devServer = pkg.vue.devServer || {};
      pkg.vue.devServer.proxy = pkg.vue.devServer.proxy || {};
      pkg.vue.devServer.proxy['^/api'] = { target: 'http://localhost:3000' };

      // Output build directory
      const outputPath = join(relative(root, process.cwd()), 'public');
      pkg.vue.outputDir = outputPath;

      return JSON.stringify(pkg, null, 2);
    });
}
