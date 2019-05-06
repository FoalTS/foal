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
import { createSecret } from './create-secret';
import {
  connectAngular,
  connectReact,
  connectVue,
  createApp,
  createController,
  createEntity,
  createHook,
  createModel,
  createRestApi,
  createScript,
  createService,
  createSubApp,
  createVSCodeConfig,
} from './generate';
import { runScript } from './run-script';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

program
  .version(pkg.version, '-v, --version');

program
  .command('createapp <name>')
  .description('Create a new project.')
  .option('-m, --mongodb', 'Generate a new project using Mongoose/MongoDB instead of TypeORM/SQLite')
  .option('-y, --yaml', 'Generate a new project using YAML configuration instead of JSON')
  .action((name: string, options) => {
    const args = process.argv.slice(3);
    const appName = args.filter(item => !item.includes('-'));
    if (appName.length > 1) {
      console.log(red('\n Kindly provide only one argument as the project name'));
      return;
    }
    createApp({
      autoInstall: true,
      initRepo: true,
      mongodb: options.mongodb || false,
      name,
      yaml: options.yaml || false
    });
  });

program
  .command('createsecret')
  .description('Create a 256-bit random secret encoded in base64.')
  .action(() => createSecret().then(secret => console.log(secret)));

program
  .command('run <name>')
  .alias('run-script')
  .description('Run a shell script.')
  .action((name: string) => {
    runScript({ name }, process.argv);
  });

program
  .command('connect <framework> <path>')
  .description('Configure your frontend to interact with your application.')
  .on('--help', () => {
    console.log('');
    console.log('Available frameworks:');
    console.log('  angular');
    console.log('  react');
    console.log('  vue');
  })
  .action(async (framework: string, path: string) => {
    switch (framework) {
      case 'angular':
        connectAngular(path);
        break;
      case 'react':
        connectReact(path);
        break;
      case 'vue':
        connectVue(path);
        break;
      default:
        console.error('Please provide a valid framework: angular.');
    }
  });

program
  .command('generate <type> [name]')
  .description('Generate and/or modify files.')
  .option('-r, --register', 'Register the controller into app.controller.ts (only available if type=controller)')
  .alias('g')
  .on('--help', () => {
    console.log('');
    console.log('Available types:');
    [ 'controller', 'entity', 'hook', 'model', 'sub-app', 'service', 'vscode-config' ]
      .forEach(t => console.log(`  ${t}`));
  })
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
      case 'model':
        createModel({ name, checkMongoose: true });
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
        console.error();
        console.error(red(`Unknown type ${yellow(type)}. Please provide a valid one:\n`));
        console.error(red('  controller'));
        console.error(red('  entity'));
        console.error(red('  hook'));
        console.error(red('  model'));
        console.error(red('  sub-app'));
        console.error(red('  service'));
        console.error(red('  vscode-config'));
        console.error();
    }
  });

// Validation for random commands
program
  .arguments('<command>')
  .action(cmd => {
    program.outputHelp();
    console.log(red(`\n  Unknown command ${yellow(cmd)}.`));
    console.log();
  });

program.parse(process.argv);

// Shows help if no arguments are provided
if (!program.args.length) {
  program.outputHelp();
}
