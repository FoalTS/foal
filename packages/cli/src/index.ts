import * as program from 'commander';

import { build } from './build';
import {
  generateApp,
  generateModule,
  generatePostHook,
  generatePreHook,
  generateService,
} from './generators';

program
  .version(require('../package.json').version, '-v, --version');

program
  .command('build', 'Builds the app and places it into lib/.')
  .option('-w, --watch', 'Watchify')
  .option('-m, --mode <mode>', 'Mode (dev or prod)', /^(prod|dev)$/i, 'prod')
  .action(options => {
    const watch = options.watch || false;
    const mode = options.mode;
    build(watch, mode);
  });

program
  .command('createapp', 'Creates a new directory with a new FoalTS app.')
  .action(() => generateApp());

program
  .command('generate <type>', 'Generates files (accepted types: module, post-hook, pre-hook, service).')
  .alias('g')
  .action((type: string) => {
    switch (type) {
      case 'module':
        generateModule();
        break;
      case 'post-hook':
        generatePostHook();
        break;
      case 'pre-hook':
        generatePreHook();
        break;
      case 'service':
        generateService();
        break;
      default:
        console.error('Please provide a valid type: module, post-hook, pre-hook or service.');
    }
  });

program.parse(process.argv);
