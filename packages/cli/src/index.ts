#!/usr/bin/env node
/**
 * FoalTS
 * Copyright(c) 2017-2020 Loïc Poullain <loic.poullain@centraliens.net>
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
import { rmdir } from './rmdir';
import { runScript } from './run-script';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

program
  .version(pkg.version, '-v, --version');

program
  .command('createapp <name>')
  .description('Create a new project.')
  .option('-G, --no-git', 'Don\'t initialize a git repository')
  .option('-I, --no-install', 'Don\'t autoinstall packages using yarn or npm (uses first available)')
  .option('-m, --mongodb', 'Generate a new project using Mongoose/MongoDB instead of TypeORM/SQLite', false)
  .option('-y, --yaml', 'Generate a new project using YAML configuration instead of JSON', false)
  .action((name: string, options: { git: boolean, install: boolean, mongodb: boolean, yaml: boolean }) => {
    createApp({
      autoInstall: options.install,
      initRepo: options.git,
      mongodb: options.mongodb,
      name,
      yaml: options.yaml
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
    path = path.replace(/\\/g, '/');
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
        console.error();
        console.error(red(`Unknown framework ${yellow(framework)}. Please provide a valid one:`));
        console.error();
        console.error(red('  angular'));
        console.error(red('  react'));
        console.error(red('  vue'));
        console.error();
    }
  });

type GenerateType = 'controller'|'entity'|'rest-api'|'hook'|'model'|'sub-app'|'script'|'service'|'vscode-config';
const generateTypes: GenerateType[] = [
  'controller', 'entity', 'rest-api', 'hook', 'model', 'sub-app', 'script', 'service', 'vscode-config'
];

program
  .command('generate <type> <name>')
  .description('Generate and/or modify files.')
  .option('-r, --register', 'Register the controller into app.controller.ts (only available if type=controller)', false)
  .alias('g')
  .on('--help', () => {
    console.log();
    console.log('Available types:');
    generateTypes.forEach(t => console.log(`  ${t}`));
  })
  .action(async (type: GenerateType, name: string, options: { register: boolean }) => {
    switch (type) {
      case 'controller':
        createController({ name, type: 'Empty', register: options.register  });
        break;
      case 'entity':
        createEntity({ name });
        break;
      case 'rest-api':
        createRestApi({ name, register: options.register });
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
        createService({ name });
        break;
      case 'vscode-config':
        createVSCodeConfig();
        break;
      default:
        console.error();
        console.error(red(`Unknown type ${yellow(type)}. Please provide a valid one:`));
        console.error();
        generateTypes.forEach(t => console.error(red(`  ${t}`)));
        console.error();
    }
  });

program
  .command('rmdir <name>')
  .description('Remove a directory and all its contents, including any subdirectories and files.')
  .action(async (name: string) => {
    try {
      await rmdir(name);
    } catch (error) {
      if (error.code === 'ENOTDIR') {
        console.error(red(error.message));
        return;
      }
      throw error;
    }
  });

program
  .on('command:*', (commands: string[]) => {
    program.outputHelp();
    console.error();
    console.error(red(`  Unknown command ${yellow(commands[0])}.`));
    console.error();
  });

program.parse(process.argv);
