#!/usr/bin/env node
/**
 * FoalTS
 * Copyright(c) 2017-2018 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

// 3p
import * as program from 'commander';
import { prompt, Separator } from 'inquirer';

// FoalTS
import {
  ControllerType,
  createApp,
  createController,
  createEntity,
  createHook,
  createScript,
  createService,
  createSubApp,
  createVSCodeConfig,
  ServiceType
} from './generate';
import { runScript } from './run-script';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

program
  .version(pkg.version, '-v, --version');

program
  .command('createapp <name>')
  .description('Creates a new directory with a new FoalTS app.')
  .action((name: string) => {
    createApp({ name, autoInstall: true });
  });

program
  .command('run-script <name>')
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
        const controllerChoices: ControllerType[] = [ 'Empty', 'REST'/*, 'GraphQL'*/, 'Login' ];
        const controllerAnswers = await prompt([
          { choices: controllerChoices, name: 'type', type: 'list', message: 'Type' }
        ]);
        createController({ name, type: controllerAnswers.type, register: options.register || false  });
        break;
      case 'entity':
        createEntity({ name });
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
        const serviceChoices: ServiceType[] = [
          'Empty',
          new Separator(),
          'ResourceCollection',
          'EntityResourceCollection',
          // new Separator(),
          // 'GraphQLResolver',
          new Separator(),
          'Authenticator',
          'EmailAuthenticator',
          new Separator(),
        ];
        const serviceAnswers = await prompt([
          { choices: serviceChoices, name: 'type', type: 'list', message: 'Type', pageSize: 10 }
        ]);
        createService({ name, type: serviceAnswers.type});
        break;
      case 'vscode-config':
        createVSCodeConfig();
        break;
      default:
        console.error('Please provide a valid type: controller|entity|hook|sub-app|service|vscode-config.');
    }
  });

program.parse(process.argv);
