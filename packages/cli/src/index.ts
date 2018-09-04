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
  createModule,
  createScript,
  createService,
  ServiceType
} from './generate';

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

program
  .version(pkg.version, '-v, --version');

program
  .command('createapp <name>')
  .description('Creates a new directory with a new FoalTS app.')
  .action((name: string) => {
    createApp({ name });
  });

program
  .command('generate <type> <name>')
  .description('Generates files (type: controller|entity|hook|module|service).')
  .option('-r, --register', 'Register the controller into app.module.ts (only available if type=controller)')
  .alias('g')
  .action(async (type: string, name: string, options) => {
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
      case 'module':
        createModule({ name });
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
      default:
        console.error('Please provide a valid type: controller|entity|hook|module|service.');
    }
  });

program.parse(process.argv);
