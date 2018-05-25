import * as program from 'commander';

import { build } from './build';

module.exports = args => {
  program
    .version(require('../package.json').version, '-v, --version');

  program
    .command('build')
    .option('-w, --watch', 'Watchify')
    .option('-m, --mode <mode>', 'Mode (dev or prod)', /^(prod|dev)$/i, 'prod')
    .action(options => {
      const watch = options.watch || false;
      const mode = options.mode;
      build(watch, mode);
    });

  program.parse(args);
};
