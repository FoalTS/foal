// std
import * as crypto from 'crypto';

// FoalTS
import {
  Generator,
  getNames,
  mkdirIfDoesNotExist,
} from '../../utils';

export function createApp({ name, sessionSecret }:
  { name: string, sessionSecret?: string }) {
  const names = getNames(name);
  if (process.env.NODE_ENV !== 'test') {
    console.log(
      `
     _______   ________   ____        ___     _________   _______
    /  ____/  / ____  /  / _  |      /  /    /___  ___/  / _____/
   /  /___   / /   / /  / /_| |     /  /        / /     / /____
  /  ____/  / /   / /  / ___  |    /  /        / /     /____  /
 /  /      / /__ / /  / /   | |   /  /____    / /     _____/ /
/__/      /_______/  /_/    |_|  /_______/   /_/     /______/

`
    );
  }

  const locals = {
    ...names,
    sessionSecret: sessionSecret ? sessionSecret : crypto.randomBytes(16).toString('hex')
  };

  mkdirIfDoesNotExist(names.kebabName);

  new Generator('app', names.kebabName)
    .copyFileFromTemplates('gitignore', '.gitignore')
    .copyFileFromTemplates('ormconfig.json')
    .renderTemplate('package.json', locals)
    .copyFileFromTemplates('tsconfig.app.json')
    .copyFileFromTemplates('tsconfig.json')
    .copyFileFromTemplates('tslint.json')
      // Config
      .mkdirIfDoesNotExist('config')
      .renderTemplate('config/app.development.json', locals)
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
      .copyFileFromTemplates('src/index.ts')
        // App
        .mkdirIfDoesNotExist('src/app')
        .copyFileFromTemplates('src/app/app.module.ts')
          // Controllers
          .mkdirIfDoesNotExist('src/app/controllers')
          .copyFileFromTemplates('src/app/controllers/index.ts')
          .copyFileFromTemplates('src/app/controllers/view.controller.ts')
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
          // Sub-modules
          .mkdirIfDoesNotExist('src/app/sub-modules')
          .copyFileFromTemplates('src/app/sub-modules/index.ts')
        // Scripts
        .mkdirIfDoesNotExist('src/scripts')
        .copyFileFromTemplates('src/scripts/create-group.spec.ts')
        .copyFileFromTemplates('src/scripts/create-group.ts')
        .copyFileFromTemplates('src/scripts/create-perm.spec.ts')
        .copyFileFromTemplates('src/scripts/create-perm.ts')
        .copyFileFromTemplates('src/scripts/create-users.ts');

  if (process.env.NODE_ENV !== 'test') {
    console.log(
      `
Install dependencies:
$ cd ${names.kebabName}
$ npm install

Run the app:
$ npm run develop
`
    );
  }
}
