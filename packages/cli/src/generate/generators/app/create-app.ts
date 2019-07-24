// std
import { execSync, spawn, SpawnOptions } from 'child_process';

// 3p
import { cyan, red } from 'colors/safe';

// FoalTS
import {
  Generator,
  getNames,
  initGitRepo,
  mkdirIfDoesNotExist,
} from '../../utils';

function isYarnInstalled() {
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(msg);
  }
}

function validateProjectName(name: string) {
  // As per npm naming conventions (https://www.npmjs.com/package/validate-npm-package-name)
  const specialChars = ['!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '/',
    '\\',
    '+',
    '{',
    '}',
    '[',
    ']',
    ':',
    ';',
    '<',
    '>',
    ',',
    '.',
    '?'
 ];
  return !specialChars.find(char => name.includes(char));
}

export async function createApp({ name, autoInstall, initRepo, mongodb = false, yaml = false }:
  { name: string, autoInstall?: boolean, initRepo?: boolean, mongodb?: boolean,
    yaml?: boolean }) {
  const names = getNames(name);

  if (process.env.NODE_ENV !== 'test') {
    console.log(cyan(
`====================================================================

     _______   ________   ____        ___     _________   _______
    /  ____/  / ____  /  / _  |      /  /    /___  ___/  / _____/
   /  /___   / /   / /  / /_| |     /  /        / /     / /____
  /  ____/  / /   / /  / ___  |    /  /        / /     /____  /
 /  /      / /__ / /  / /   | |   /  /____    / /     _____/ /
/__/      /_______/  /_/    |_|  /_______/   /_/     /______/


====================================================================
`
    ));
  }

  const locals = names;

     // Validating whether if the project-name follows npm naming conventions
  if (!validateProjectName(name)) {
    console.log(
      red(`\n ${red(`${name} doesn't follow the npm naming conventions. Kindly give a vaild project-name`)}`)
    );
    return;
  }
  mkdirIfDoesNotExist(names.kebabName);

  log('  📂 Creating files...');
  const generator = new Generator('app', names.kebabName, { noLogs: true });

  generator
    .copyFileFromTemplates('gitignore', '.gitignore')
    .copyFileFromTemplatesOnlyIf(!mongodb, 'ormconfig.js')
    .renderTemplateOnlyIf(!mongodb && !yaml, 'package.json', locals)
    .renderTemplateOnlyIf(!mongodb && yaml, 'package.yaml.json', locals, 'package.json')
    .renderTemplateOnlyIf(mongodb && !yaml, 'package.mongodb.json', locals, 'package.json')
    .renderTemplateOnlyIf(mongodb && yaml, 'package.mongodb.yaml.json', locals, 'package.json')
    .copyFileFromTemplates('tsconfig.app.json')
    .copyFileFromTemplates('tsconfig.e2e.json')
    .copyFileFromTemplates('tsconfig.json')
    .copyFileFromTemplatesOnlyIf(!mongodb, 'tsconfig.migrations.json')
    .copyFileFromTemplates('tsconfig.scripts.json')
    .copyFileFromTemplates('tsconfig.test.json')
    .copyFileFromTemplates('tslint.json')
      // Config
      .mkdirIfDoesNotExist('config')
      .renderTemplateOnlyIf(!mongodb && !yaml, 'config/default.json', locals)
      .renderTemplateOnlyIf(!mongodb && yaml, 'config/default.yml', locals)
      .renderTemplateOnlyIf(mongodb && !yaml, 'config/default.mongodb.json', locals, 'config/default.json')
      .renderTemplateOnlyIf(mongodb && yaml, 'config/default.mongodb.yml', locals, 'config/default.yml')
      .renderTemplateOnlyIf(!yaml, 'config/development.json', locals)
      .renderTemplateOnlyIf(yaml, 'config/development.yml', locals)
      .renderTemplateOnlyIf(!mongodb && !yaml, 'config/e2e.json', locals)
      .renderTemplateOnlyIf(!mongodb && yaml, 'config/e2e.yml', locals)
      .renderTemplateOnlyIf(mongodb && !yaml, 'config/e2e.mongodb.json', locals, 'config/e2e.json')
      .renderTemplateOnlyIf(mongodb && yaml, 'config/e2e.mongodb.yml', locals, 'config/e2e.yml')
      .renderTemplateOnlyIf(!yaml, 'config/production.json', locals)
      .renderTemplateOnlyIf(yaml, 'config/production.yml', locals)
      .renderTemplateOnlyIf(!mongodb && !yaml, 'config/test.json', locals)
      .renderTemplateOnlyIf(!mongodb && yaml, 'config/test.yml', locals)
      .renderTemplateOnlyIf(mongodb && !yaml, 'config/test.mongodb.json', locals, 'config/test.json')
      .renderTemplateOnlyIf(mongodb && yaml, 'config/test.mongodb.yml', locals, 'config/test.yml')
      // Public
      .mkdirIfDoesNotExist('public')
      .copyFileFromTemplates('public/index.html')
      .copyFileFromTemplates('public/logo.png')
      // Src
      .mkdirIfDoesNotExist('src')
      .copyFileFromTemplates('src/e2e.ts')
      .copyFileFromTemplatesOnlyIf(mongodb, 'src/index.mongodb.ts', 'src/index.ts')
      .copyFileFromTemplatesOnlyIf(!mongodb, 'src/index.ts')
      .copyFileFromTemplates('src/test.ts')
        // App
        .mkdirIfDoesNotExist('src/app')
        .copyFileFromTemplates('src/app/app.controller.ts')
          // Controllers
          .mkdirIfDoesNotExist('src/app/controllers')
          .copyFileFromTemplates('src/app/controllers/index.ts')
          .copyFileFromTemplates('src/app/controllers/api.controller.ts')
          .copyFileFromTemplates('src/app/controllers/api.controller.spec.ts')
          // Entities
          .mkdirIfDoesNotExistOnlyIf(!mongodb, 'src/app/entities')
          .copyFileFromTemplatesOnlyIf(!mongodb, 'src/app/entities/index.ts')
          .copyFileFromTemplatesOnlyIf(!mongodb, 'src/app/entities/user.entity.ts')
          // Hooks
          .mkdirIfDoesNotExist('src/app/hooks')
          .copyFileFromTemplates('src/app/hooks/index.ts')
          // Models
          .mkdirIfDoesNotExistOnlyIf(mongodb, 'src/app/models')
          .copyFileFromTemplatesOnlyIf(mongodb, 'src/app/models/index.ts')
          .copyFileFromTemplatesOnlyIf(mongodb, 'src/app/models/user.model.ts')
          // Services
          .mkdirIfDoesNotExist('src/app/services')
          .copyFileFromTemplates('src/app/services/index.ts')
        // E2E
        .mkdirIfDoesNotExist('src/e2e')
        .copyFileFromTemplatesOnlyIf(!mongodb, 'src/e2e/index.ts')
        .copyFileFromTemplatesOnlyIf(mongodb, 'src/e2e/index.mongodb.ts', 'src/e2e/index.ts')
        // Scripts
        .mkdirIfDoesNotExist('src/scripts')
        .copyFileFromTemplatesOnlyIf(!mongodb, 'src/scripts/create-user.ts')
        .copyFileFromTemplatesOnlyIf(mongodb, 'src/scripts/create-user.mongodb.ts', 'src/scripts/create-user.ts');

  log('');
  log('  📦 Installing the dependencies...');
  if (autoInstall) {
    const packageManager = isYarnInstalled() ? 'yarn' : 'npm';
    const args = [ 'install' ];
    const options: SpawnOptions = {
      cwd: names.kebabName,
      shell: true,
      stdio: 'inherit'
    };

    await new Promise(resolve => {
      spawn(packageManager, args, options)
        .on('close', (code: number) => {
          if (code !== 0) {
            log(red('A problem occurred when installing the dependencies. See above.'));
          }
          resolve();
        });
    });
  }

  log('  📔 Initializing git repository...');
  if (initRepo) {
    await initGitRepo(names.kebabName);
  }

  log(`
  👉 Run the following commands to get started:

    $ ${cyan(`cd ${names.kebabName}`)}
    $ ${cyan('npm run develop')}
`
  );
}
