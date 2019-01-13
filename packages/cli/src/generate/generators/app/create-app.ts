// std
import { execSync, spawn, SpawnOptions } from 'child_process';
import * as crypto from 'crypto';

// 3p
import { blue, red, underline } from 'colors/safe';

// FoalTS
import {
  Generator,
  getNames,
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

function validateProjectName(name: string) {
  let flag = 0;
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

  specialChars.map(char => {
    if (name.includes(char)) {
      flag = 1;
      return false;
    }
  });

  if (flag === 0) {
    return true;
  }
}

export async function createApp({ name, sessionSecret, autoInstall }:
  { name: string, sessionSecret?: string, autoInstall?: boolean }) {
  const names = getNames(name);
  if (process.env.NODE_ENV !== 'test') {
    console.log(blue(
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
    process.exit(1);
  }

  mkdirIfDoesNotExist(names.kebabName);

  new Generator('app', names.kebabName)
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
      .renderTemplate('config/app.development.json', locals)
      .renderTemplate('config/app.e2e.json', locals)
      .renderTemplate('config/app.production.json', locals)
      .renderTemplate('config/app.test.json', locals)
      .renderTemplate('config/settings.json', locals)
      .renderTemplate('config/settings.development.json', locals)
      .renderTemplate('config/settings.production.json', locals)
      // Public
      .mkdirIfDoesNotExist('public')
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
          .copyFileFromTemplates('src/app/controllers/view.controller.ts')
          .copyFileFromTemplates('src/app/controllers/view.controller.spec.ts')
            // Templates
            .mkdirIfDoesNotExist('src/app/controllers/templates')
            .copyFileFromTemplates('src/app/controllers/templates/index.html')
          // Entities
          .mkdirIfDoesNotExist('src/app/entities')
          .copyFileFromTemplates('src/app/entities/index.ts')
          .copyFileFromTemplates('src/app/entities/user.entity.ts')
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
            console.log(red('A problem occurred when installing the dependencies. See above.'));
          }
          resolve();
        });
    });
  }

  if (process.env.NODE_ENV !== 'test') {
    console.log(
      `
${underline('Run the app:')}
$ cd ${names.kebabName}
$ npm run develop
`
    );
  }
}
