/**
 * FoalTS
 * Copyright(c) 2017-2025 Loïc Poullain
 * Released under the MIT License.
 */

// 3p
import { red, yellow } from 'colors/safe';
import { program } from 'commander';

// FoalTS
import { ClientError, CryptoService, Generator, LoggerService, UtilService } from './services';
import { ConnectAngularCommandService, ConnectReactCommandService, ConnectVueCommandService, CreateAppCommandService, CreateSecretCommandService, CreateControllerCommandService, CreateEntityCommandService, CreateHookCommandService, CreateRestApiCommandService, CreateScriptCommandService, CreateServiceCommandService, RmdirCommandService, RunScriptCommandService, UpgradeCommandService } from './commands';

function displayError(...lines: string[]): void {
  console.error();
  lines.forEach(line => console.error(red(line)));
  console.error();
  process.exitCode = 1;
}

// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

program
  .version(pkg.version, '-v, --version');

program
  .command('createapp')
  .argument('<name>', 'Name of the application')
  .description('Create a new project.')
  .option('-G, --no-git', 'Don\'t initialize a git repository')
  .option('-I, --no-install', 'Don\'t autoinstall packages using yarn or npm (uses first available)')
  .option('-m, --mongodb', 'Generate a new project using MongoDB instead of SQLite', false)
  .option('-y, --yaml', 'Generate a new project using YAML configuration instead of JSON', false)
  .action(async (name: string, options: { git: boolean, install: boolean, mongodb: boolean, yaml: boolean }) => {
    const generator = new Generator();
    const createAppCommandService = new CreateAppCommandService(generator);
    await createAppCommandService.run({
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
  .action(async () => {
    const cryptoService = new CryptoService();
    const loggerService = new LoggerService();
    const createSecretCommandService = new CreateSecretCommandService(cryptoService, loggerService);
    await createSecretCommandService.run();
  });

program
  .command('run')
  .argument('<name>', 'Name of the script to run')
  .description('Run a shell script.')
  .action(async (name: string) => {
    const utilService = new UtilService();
    const runScriptCommandService = new RunScriptCommandService(utilService);
    await runScriptCommandService.run(name, process.argv);
  });

program
  .command('connect')
  .argument('<framework>', 'Frontend framework to connect to')
  .argument('<path>', 'Path to the frontend project')
  .description('Configure your frontend to interact with your application.')
  .addHelpText('after', `
Available frameworks:
  - angular
  - react
  - vue
  `)
  .action(async (framework: string, path: string) => {
    switch (framework) {
      case 'angular':
        const generator = new Generator();
        const connectAngularCommandService = new ConnectAngularCommandService(generator);
        connectAngularCommandService.run(path);
        break;
      case 'react':
        const reactGenerator = new Generator();
        const connectReactCommandService = new ConnectReactCommandService(reactGenerator);
        connectReactCommandService.run(path);
        break;
      case 'vue':
        const vueGenerator = new Generator();
        const connectVueCommandService = new ConnectVueCommandService(vueGenerator);
        connectVueCommandService.run(path);
        break;
      default:
        displayError(
          `Unknown framework ${yellow(framework)}. Please provide a valid one:`,
          '',
          '  - angular',
          '  - react',
          '  - vue',
        );
    }
  });

type GenerateType = 'controller'|'entity'|'rest-api'|'hook'|'script'|'service';
const generateTypes: GenerateType[] = [
  'controller', 'entity', 'rest-api', 'hook', 'script', 'service'
];

program
  .command('generate')
  .argument('<type>', 'Type of the file to generate')
  .argument('<name>', 'Name of the file to generate')
  .description('Generate and/or modify files.')
  .option(
    '-r, --register',
    'Register the controller into app.controller.ts (only available if type=controller|rest-api)',
    false
  )
  .option(
    '-a, --auth',
    'Add an owner to the entities of the generated REST API (only available if type=rest-api)',
    false
  )
  .alias('g')
  .addHelpText('after', `
Available types:
${generateTypes.map(t => `  - ${t}`).join('\n')}
  `)
  .action(async (type: GenerateType, name: string, options: { register: boolean, auth: boolean }) => {
    try {
      switch (type) {
        case 'controller':
          const controllerGenerator = new Generator();
          const createControllerCommandService = new CreateControllerCommandService(controllerGenerator);
          createControllerCommandService.run({ name, register: options.register });
          break;
        case 'entity':
          const entityGenerator = new Generator();
          const createEntityCommandService = new CreateEntityCommandService(entityGenerator);
          createEntityCommandService.run({ name });
          break;
        case 'rest-api':
          const restApiGenerator = new Generator();
          const createRestApiCommandService = new CreateRestApiCommandService(restApiGenerator);
          createRestApiCommandService.run({ name, register: options.register, auth: options.auth });
          break;
        case 'hook':
          const hookGenerator = new Generator();
          const createHookCommandService = new CreateHookCommandService(hookGenerator);
          createHookCommandService.run({ name });
          break;
        case 'script':
          const scriptGenerator = new Generator();
          const createScriptCommandService = new CreateScriptCommandService(scriptGenerator);
          createScriptCommandService.run({ name });
          break;
        case 'service':
          const serviceGenerator = new Generator();
          const createServiceCommandService = new CreateServiceCommandService(serviceGenerator);
          createServiceCommandService.run({ name });
          break;
        default:
          displayError(
            `Unknown type ${yellow(type)}. Please provide a valid one:`,
            '',
            ...generateTypes.map(t => `  - ${t}`)
          );
      }
    } catch (error: any) {
      if (error instanceof ClientError) {
        displayError(error.message);
        return;
      }
      throw error;
    }

  });

program
  .command('rmdir')
  .argument('<name>', 'Name of the directory to remove')
  .description('Remove a directory and all its contents, including any subdirectories and files.')
  .action(async (name: string) => {
    try {
      const rmdirCommandService = new RmdirCommandService();
      await rmdirCommandService.run(name);
    } catch (error: any) {
      if (error.code === 'ENOTDIR') {
        displayError(error.message);
        return;
      }
      throw error;
    }
  });

program
  .command('upgrade')
  .argument('[version]', 'Name of the specific version to upgrade to')
  .description('Upgrade the project to the latest version of FoalTS. If a version is provided, upgrade to that version.')
  .option('-I, --no-install', 'Don\'t autoinstall packages using yarn or npm (uses first available)')
  .action(async (version: string|undefined, options: { install: boolean }) => {
    const upgradeGenerator = new Generator();
    const upgradeCommandService = new UpgradeCommandService(upgradeGenerator);
    await upgradeCommandService.run({ version, autoInstall: options.install });
  });

program
  .on('command:*', (commands: string[]) => {
    program.outputHelp();
    displayError(`Unknown command ${yellow(commands[0])}.`);
  });

program.parse(process.argv);
