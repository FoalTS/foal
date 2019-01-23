import { join, relative } from 'path';

import { red } from 'colors/safe';
import { existsSync } from 'fs';
import { Generator } from '../../utils';

export function connectAngular(path: string) {
  const root = join(process.cwd(), path);

  if (!existsSync(root)) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} does not exist.`));
    }
    return;
  }

  if (!existsSync(join(root, 'angular.json'))) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`  The directory ${path} is not an Angular project (missing angular.json).`));
    }
    return;
  }

  new Generator('angular', root)
    .copyFileFromTemplates('proxy.conf.json', 'src/proxy.conf.json')
    .updateFile('angular.json', content => {
      const config = JSON.parse(content);

      // Proxy configuration
      config.projects[config.defaultProject].architect.serve.options.proxyConfig = 'src/proxy.conf.json';

      // Output build directory
      const outputPath = join(relative(root, process.cwd()), 'public');
      config.projects[config.defaultProject].architect.build.options.outputPath = outputPath;

      return JSON.stringify(config, null, 2);
    });
}
