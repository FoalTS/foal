import { join, relative } from 'path';

import { red } from 'colors/safe';
import { Generator } from '../../../services';

/**
 * Service for connecting a Vue frontend to a FoalTS application.
 */
export class ConnectVueCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Configure a Vue project to interact with a FoalTS application.
   *
   * @param {string} path - The path to the Vue project directory
   * @returns {void}
   */
  run(path: string): void {
    if (!this.generator.exists(path)) {
      if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
        console.log(red(`  The directory ${path} does not exist.`));
      }
      return;
    }

    if (!this.generator.exists(join(path, 'package.json'))) {
      if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
        console.log(red(`  The directory ${path} is not a Vue project (missing package.json).`));
      }
      return;
    }

    this.generator
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
}

