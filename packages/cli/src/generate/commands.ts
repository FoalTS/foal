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
  createService,
  ServiceType
} from './generators';

program
  .command('createapp <name>')
  .description('Creates a new directory with a new FoalTS app.')
  .action((name: string) => {
    createApp({ name });
  });

program
  .command('generate <type> <name>')
  .description('Generates files (type: controller|entity|hook|module|service).')
  .alias('g')
  .action(async (type: string, name: string) => {
    switch (type) {
      case 'controller':
        const controllerChoices: ControllerType[] = [ 'Empty', 'REST'/*, 'GraphQL'*/, 'Login' ];
        const controllerAnswers = await prompt([
          { choices: controllerChoices, name: 'type', type: 'list', message: 'Type' }
        ]);
        createController({ name, type: controllerAnswers.type });
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
      case 'service':
        const serviceChoices: ServiceType[] = [
          'Empty',
          new Separator(),
          'Serializer',
          'EntitySerializer',
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
        createService({ name, type: serviceAnswers.type });
        break;
      default:
        console.error('Please provide a valid type: controller|entity|hook|module|service.');
    }
  });
