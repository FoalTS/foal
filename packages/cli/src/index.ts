#!/usr/bin/env node
/**
 * FoalTS
 * Copyright(c) 2017-2018 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

// 3p
import { red, yellow } from 'colors/safe';
import * as program from 'commander';

// FoalTS
import {
  createApp,
  createController,
  createEntity,
  createHook,
  createRestApi,
  createScript,
  createService,
  createSubApp,
  createVSCodeConfig,
} from './generate';
import { runScript } from './run-script';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');
const args = process.argv.slice(3);

program
  .version(pkg.version, '-v, --version');

program
  .command('createapp <name>')
  .description('Creates a new directory with a new FoalTS app.')
  .action((name: string) => {
    if (args.length > 1) {
      console.log(red('\n Kindly provide only one argument as the project name'));
      return;
    }
    createApp({ name, autoInstall: true });
  });

program
  .command('run <name>')
  .alias('run-script')
  .description('Runs the given script.')
  .action((name: string) => {
    runScript({ name }, process.argv);
  });

program
  .command('generate <type> [name]')
  .description('Generates files (type: controller|entity|hook|sub-app|service|vscode-config).')
  .option('-r, --register', 'Register the controller into app.controller.ts (only available if type=controller)')
  .alias('g')
  .action(async (type: string, name: string, options) => {
    name = name || 'no-name';
    switch (type) {
      case 'controller':
        createController({ name, type: 'Empty', register: options.register || false  });
        break;
      case 'entity':
        createEntity({ name });
        break;
      case 'rest-api':
        createRestApi({ name, register: options.register || false });
        break;
      case 'hook':
        createHook({ name });
        break;
      case 'sub-app':
        createSubApp({ name });
        break;
      case 'script':
        createScript({ name });
        break;
      case 'service':
        createService({ name, type: 'Empty' });
        break;
      case 'vscode-config':
        createVSCodeConfig();
        break;
      default:
        console.error('Please provide a valid type: controller|entity|hook|sub-app|service|vscode-config.');
    }
  });

// Validation for random commands
program
  .arguments('<command>')
  .action(cmd => {
    program.outputHelp();
    console.log(`  ` + red(`\n  Unknown command ${yellow(cmd)}.`));
    console.log();
  });

program.parse(process.argv);

// Shows help if no arguments are provided
if (!program.args.length) {
  program.outputHelp();
}
