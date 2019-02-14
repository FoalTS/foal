import { join, relative } from 'path';

import { red } from 'colors/safe';
import { existsSync } from 'fs';
import { Generator } from '../../utils';

export function connectAngular(path: string) {
  if (!existsSync(path)) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} does not exist.`));
    }
    return;
  }

  if (!existsSync(join(path, 'angular.json'))) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} is not an Angular project (missing angular.json).`));
    }
    return;
  }

  if (!existsSync(join(path, 'package.json'))) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} is not an Angular project (missing package.json).`));
    }
    return;
  }

  new Generator('angular', path)
    .copyFileFromTemplates('proxy.conf.json', 'src/proxy.conf.json')
    .updateFile('package.json', content => {
      const pkg = JSON.parse(content);

      pkg.scripts.build = 'ng build --prod';

      return JSON.stringify(pkg, null, 2);
    })
    .updateFile('angular.json', content => {
      const config = JSON.parse(content);

      // Proxy configuration
      config.projects[config.defaultProject].architect.serve.options.proxyConfig = 'src/proxy.conf.json';

      // Output build directory
      const outputPath = join(relative(path, process.cwd()), 'public');
      config.projects[config.defaultProject].architect.build.options.outputPath = outputPath;

      return JSON.stringify(config, null, 2);
    });
}
