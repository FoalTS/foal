/**
 * FoalTS
 * Copyright(c) 2017-2025 Loïc Poullain
 * Released under the MIT License.
 */

// 3p
import { red, yellow } from 'colors/safe';
import { program } from 'commander';

// FoalTS
import { ClientError, CryptoService, FileSystemService, Generator, LoggerService, UtilService } from './services';
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
    const fileSystem = new FileSystemService();
    const logger = new LoggerService();
    const generator = new Generator(fileSystem, logger);
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
  .argument('[args...]', 'Script arguments (key=value format)')
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
        const fileSystem = new FileSystemService();
        const logger = new LoggerService();
        const generator = new Generator(fileSystem, logger);
        const connectAngularCommandService = new ConnectAngularCommandService(generator);
        connectAngularCommandService.run(path);
        break;
      case 'react':
        const reactFileSystem = new FileSystemService();
        const reactLogger = new LoggerService();
        const reactGenerator = new Generator(reactFileSystem, reactLogger);
        const connectReactCommandService = new ConnectReactCommandService(reactGenerator);
        connectReactCommandService.run(path);
        break;
      case 'vue':
        const vueFileSystem = new FileSystemService();
        const vueLogger = new LoggerService();
        const vueGenerator = new Generator(vueFileSystem, vueLogger);
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
          const controllerFileSystem = new FileSystemService();
          const controllerLogger = new LoggerService();
          const controllerGenerator = new Generator(controllerFileSystem, controllerLogger);
          const createControllerCommandService = new CreateControllerCommandService(controllerGenerator);
          createControllerCommandService.run({ name, register: options.register });
          break;
        case 'entity':
          const entityFileSystem = new FileSystemService();
          const entityLogger = new LoggerService();
          const entityGenerator = new Generator(entityFileSystem, entityLogger);
          const createEntityCommandService = new CreateEntityCommandService(entityGenerator);
          createEntityCommandService.run({ name });
          break;
        case 'rest-api':
          const restApiFileSystem = new FileSystemService();
          const restApiLogger = new LoggerService();
          const restApiGenerator = new Generator(restApiFileSystem, restApiLogger);
          const createRestApiCommandService = new CreateRestApiCommandService(restApiGenerator);
          createRestApiCommandService.run({ name, register: options.register, auth: options.auth });
          break;
        case 'hook':
          const hookFileSystem = new FileSystemService();
          const hookLogger = new LoggerService();
          const hookGenerator = new Generator(hookFileSystem, hookLogger);
          const createHookCommandService = new CreateHookCommandService(hookGenerator);
          createHookCommandService.run({ name });
          break;
        case 'script':
          const scriptFileSystem = new FileSystemService();
          const scriptLogger = new LoggerService();
          const scriptGenerator = new Generator(scriptFileSystem, scriptLogger);
          const createScriptCommandService = new CreateScriptCommandService(scriptGenerator);
          createScriptCommandService.run({ name });
          break;
        case 'service':
          const serviceFileSystem = new FileSystemService();
          const serviceLogger = new LoggerService();
          const serviceGenerator = new Generator(serviceFileSystem, serviceLogger);
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
    const upgradeFileSystem = new FileSystemService();
    const upgradeLogger = new LoggerService();
    const upgradeGenerator = new Generator(upgradeFileSystem, upgradeLogger);
    const upgradeCommandService = new UpgradeCommandService(upgradeGenerator);
    await upgradeCommandService.run({ version, autoInstall: options.install });
  });

program
  .on('command:*', (commands: string[]) => {
    program.outputHelp();
    displayError(`Unknown command ${yellow(commands[0])}.`);
  });

program.parse(process.argv);
