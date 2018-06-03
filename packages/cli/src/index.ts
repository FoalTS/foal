#!/usr/bin/env node
/**
 * FoalTS
 * Copyright(c) 2017-2018 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

import * as program from 'commander';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

import { build } from './build';

program
  .version(pkg.version, '-v, --version');

program
  .command('build', 'Builds the app and places it into lib/.')
  .option('-w, --watch', 'Watchify')
  .option('-m, --mode <mode>', 'Mode (dev, test or prod)', /^(prod|dev|test)$/i, 'prod')
  .action(options => {
    const watch = options.watch || false;
    const mode = options.mode;
    build(watch, mode);
  });

// program
//   .command('createapp', 'Creates a new directory with a new FoalTS app.')
//   .action(() => env.run('foal app', (err, data) => console.log(err, data)));

// program
//   .command('generate <type>', 'Generates files (accepted types: module, post-hook, pre-hook, service).')
//   .alias('g')
//   .action((type: string) => {
//     switch (type) {
//       case 'module':
//         env.run('foal module', (err, data) => console.log(err, data));
//         break;
//       case 'post-hook':
//         env.run('foal post-hook', (err, data) => console.log(err, data));
//         break;
//       case 'pre-hook':
//         env.run('foal pre-hook', (err, data) => console.log(err, data));
//         break;
//       case 'service':
//         env.run('foal service', (err, data) => console.log(err, data));
//         break;
//       default:
//         console.error('Please provide a valid type: module, post-hook, pre-hook or service.');
//     }
//   });

program.parse(process.argv);
