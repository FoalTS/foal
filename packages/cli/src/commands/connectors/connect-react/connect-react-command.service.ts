import { join, relative } from 'path';

import { red } from 'colors/safe';
import { Generator } from '../../../services';

/**
 * Service for connecting a React frontend to a FoalTS application.
 */
export class ConnectReactCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Configure a React project to interact with a FoalTS application.
   *
   * @param {string} path - The path to the React project directory
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
        console.log(red(`  The directory ${path} is not a React project (missing package.json).`));
      }
      return;
    }

    const outputPath = join(relative(path, process.cwd()), 'public')
      // Make projects generated on Windows build on Unix.
      .replace(/\\/g, '/');

    this.generator
      .cd(path)
      .modify('package.json', content => {
        const pkg = JSON.parse(content);
        pkg.proxy = 'http://localhost:3001';
        return JSON.stringify(pkg, null, 2);
      })
      .copyTemplate('react/env.development', '.env.development')
      .render('react/env', '.env', { path: outputPath });
  }
}

