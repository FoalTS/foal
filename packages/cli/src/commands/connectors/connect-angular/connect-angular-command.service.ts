import { join, relative } from 'path';

import { red } from 'colors/safe';
import { Generator } from '../../../services';

/**
 * Service for connecting an Angular frontend to a FoalTS application.
 */
export class ConnectAngularCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Configure an Angular project to interact with a FoalTS application.
   *
   * @param {string} path - The path to the Angular project directory
   * @returns {void}
   */
  run(path: string): void {
    if (!this.generator.exists(path)) {
      if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
        console.log(red(`  The directory ${path} does not exist.`));
      }
      return;
    }

    if (!this.generator.exists(join(path, 'angular.json'))) {
      if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
        console.log(red(`  The directory ${path} is not an Angular project (missing angular.json).`));
      }
      return;
    }

    if (!this.generator.exists(join(path, 'package.json'))) {
      if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
        console.log(red(`  The directory ${path} is not an Angular project (missing package.json).`));
      }
      return;
    }

    this.generator
      .cd(path)
      .copyTemplate('angular/proxy.conf.json', 'src/proxy.conf.json')
      .modify('package.json', content => {
        const pkg = JSON.parse(content);

        pkg.scripts.build = 'ng build --prod';

        return JSON.stringify(pkg, null, 2);
      })
      .modify('angular.json', content => {
        const config = JSON.parse(content);

        const projectName = Object.keys(config.projects)[0];

        // Proxy configuration
        config.projects[projectName].architect ||= {};
        config.projects[projectName].architect.serve ||= {};
        config.projects[projectName].architect.serve.options ||= {};
        config.projects[projectName].architect.serve.options.proxyConfig = 'src/proxy.conf.json';

        // Output build directory
        const outputPath = join(relative(path, process.cwd()), 'public')
          // Make projects generated on Windows build on Unix.
          .replace(/\\/g, '/');
        config.projects[projectName].architect.build ||= {};
        config.projects[projectName].architect.build.options ||= {};
        config.projects[projectName].architect.build.options.outputPath = outputPath;

        return JSON.stringify(config, null, 2);
      });
  }
}

