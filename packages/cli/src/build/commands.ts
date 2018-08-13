// 3p
import * as program from 'commander';

// FoalTS
import { build } from './build';

program
  .command('build')
  .description('Builds the app and places it into lib/.')
  .option('-w, --watch', 'Watchify')
  .option('-m, --mode <mode>', 'Mode (dev, test or prod)', /^(prod|dev|test)$/, 'prod')
  .action(options => {
    const watch = options.watch || false;
    const mode = options.mode;
    console.log(mode);
    build(watch, mode);
  });
