// std
import { execSync, spawn, SpawnOptions } from 'child_process';
import * as crypto from 'crypto';
import { join } from 'path';

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

export async function createApp({ name, sessionSecret, autoInstall, initRepo, mongodb = false }:
  { name: string, sessionSecret?: string, autoInstall?: boolean, initRepo?: boolean, mongodb?: boolean }) {
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

  const locals = {
    ...names,
    sessionSecret: sessionSecret ? sessionSecret : crypto.randomBytes(16).toString('hex')
  };

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
    .copyFileFromTemplates('ormconfig.json')
    .renderTemplate('package.json', locals)
    .copyFileFromTemplates('tsconfig.app.json')
    .copyFileFromTemplates('tsconfig.e2e.json')
    .copyFileFromTemplates('tsconfig.json')
    .copyFileFromTemplates('tsconfig.migrations.json')
    .copyFileFromTemplates('tsconfig.scripts.json')
    .copyFileFromTemplates('tsconfig.test.json')
    .copyFileFromTemplates('tslint.json')
      // Config
      .mkdirIfDoesNotExist('config')
      .renderTemplate('config/settings.json', locals)
      .renderTemplate('config/settings.development.json', locals)
      .renderTemplate('config/settings.production.json', locals)
      // Public
      .mkdirIfDoesNotExist('public')
      .copyFileFromTemplates('public/index.html')
      .copyFileFromTemplates('public/logo.png')
      // Src
      .mkdirIfDoesNotExist('src')
      .copyFileFromTemplates('src/e2e.ts')
      .copyFileFromTemplates('src/index.ts')
      .copyFileFromTemplates('src/test.ts')
        // App
        .mkdirIfDoesNotExist('src/app')
        .copyFileFromTemplates('src/app/app.controller.ts')
          // Controllers
          .mkdirIfDoesNotExist('src/app/controllers')
          .copyFileFromTemplates('src/app/controllers/index.ts')
          .copyFileFromTemplates('src/app/controllers/api.controller.ts')
          .copyFileFromTemplates('src/app/controllers/api.controller.spec.ts')
          // Hooks
          .mkdirIfDoesNotExist('src/app/hooks')
          .copyFileFromTemplates('src/app/hooks/index.ts')
          // Services
          .mkdirIfDoesNotExist('src/app/services')
          .copyFileFromTemplates('src/app/services/index.ts')
          // Sub-apps
          .mkdirIfDoesNotExist('src/app/sub-apps')
          .copyFileFromTemplates('src/app/sub-apps/index.ts')
        // E2E
        .mkdirIfDoesNotExist('src/e2e')
        .copyFileFromTemplates('src/e2e/index.ts')
        // Scripts
        .mkdirIfDoesNotExist('src/scripts')
        .copyFileFromTemplates('src/scripts/create-group.ts')
        .copyFileFromTemplates('src/scripts/create-perm.ts')
        .copyFileFromTemplates('src/scripts/create-user.ts');

  if (mongodb) {
    // Src / App / Models
    generator
      .mkdirIfDoesNotExist('src/app/models')
      .copyFileFromTemplates('src/app/models/index.ts')
      .copyFileFromTemplates('src/app/models/user.model.ts');
  } else {
    // Src / App / Entities
    generator
      .mkdirIfDoesNotExist('src/app/entities')
      .copyFileFromTemplates('src/app/entities/index.ts')
      .copyFileFromTemplates('src/app/entities/user.entity.ts');
  }

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
    await initGitRepo(join(process.cwd(), names.kebabName));
  }

  log(`
  👉 Run the following commands to get started:

    $ ${cyan(`cd ${names.kebabName}`)}
    $ ${cyan('npm run develop')}
`
  );
}
