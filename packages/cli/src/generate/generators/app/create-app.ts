// std
import * as crypto from 'crypto';

// FoalTS
import {
  copyFileFromTemplates,
  getNames,
  mkdirIfNotExists,
  renderTemplate
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

  // Root
  mkdirIfNotExists(names.kebabName);
  copyFileFromTemplates('app/gitignore', `${names.kebabName}/.gitignore`);
  copyFileFromTemplates('app/ormconfig.json', `${names.kebabName}/ormconfig.json`);
  renderTemplate('app/package.json', `${names.kebabName}/package.json`, locals);
  copyFileFromTemplates('app/tsconfig.json', `${names.kebabName}/tsconfig.json`);
  copyFileFromTemplates('app/tslint.json', `${names.kebabName}/tslint.json`);

  // Config
  mkdirIfNotExists(`${names.kebabName}/config`);
  renderTemplate('app/config/app.development.json', `${names.kebabName}/config/app.development.json`, locals);
  renderTemplate('app/config/app.production.json', `${names.kebabName}/config/app.production.json`, locals);
  renderTemplate('app/config/app.test.json', `${names.kebabName}/config/app.test.json`, locals);
  renderTemplate(
    'app/config/settings.json',
    `${names.kebabName}/config/settings.json`,
    locals
  );
  renderTemplate(
    'app/config/settings.development.json',
    `${names.kebabName}/config/settings.development.json`,
    locals
  );
  renderTemplate(
    'app/config/settings.production.json',
    `${names.kebabName}/config/settings.production.json`,
    locals
  );

  // Public
  mkdirIfNotExists(`${names.kebabName}/public`);
  copyFileFromTemplates('app/public/logo.png', `${names.kebabName}/public/logo.png`);

  // Scripts
  mkdirIfNotExists(`${names.kebabName}/scripts`);
  copyFileFromTemplates('app/scripts/create-users.ts', `${names.kebabName}/scripts/create-users.ts`);

  // Src
  mkdirIfNotExists(`${names.kebabName}/src`);
  copyFileFromTemplates('app/src/index.ts', `${names.kebabName}/src/index.ts`);
  copyFileFromTemplates('app/src/test.ts', `${names.kebabName}/src/test.ts`);

  mkdirIfNotExists(`${names.kebabName}/src/app`);
  copyFileFromTemplates('app/src/app/app.module.ts', `${names.kebabName}/src/app/app.module.ts`);
  copyFileFromTemplates('app/src/app/test.ts', `${names.kebabName}/src/app/test.ts`);

  mkdirIfNotExists(`${names.kebabName}/src/app/controllers`);
  copyFileFromTemplates('app/src/app/controllers/index.ts', `${names.kebabName}/src/app/controllers/index.ts`);
  copyFileFromTemplates('app/src/app/controllers/test.ts', `${names.kebabName}/src/app/controllers/test.ts`);
  copyFileFromTemplates(
    'app/src/app/controllers/view.controller.ts',
    `${names.kebabName}/src/app/controllers/view.controller.ts`
  );
  mkdirIfNotExists(`${names.kebabName}/src/app/controllers/templates`);
  copyFileFromTemplates(
    'app/src/app/controllers/templates/index.html',
    `${names.kebabName}/src/app/controllers/templates/index.html`
  );
  copyFileFromTemplates(
    'app/src/app/controllers/templates/index.ts',
    `${names.kebabName}/src/app/controllers/templates/index.ts`
  );
  copyFileFromTemplates(
    'app/src/app/controllers/templates/test.ts',
    `${names.kebabName}/src/app/controllers/templates/test.ts`
  );

  mkdirIfNotExists(`${names.kebabName}/src/app/hooks`);
  copyFileFromTemplates('app/src/app/hooks/index.ts', `${names.kebabName}/src/app/hooks/index.ts`);
  copyFileFromTemplates('app/src/app/hooks/test.ts', `${names.kebabName}/src/app/hooks/test.ts`);

  mkdirIfNotExists(`${names.kebabName}/src/app/entities`);
  copyFileFromTemplates('app/src/app/entities/index.ts', `${names.kebabName}/src/app/entities/index.ts`);
  copyFileFromTemplates('app/src/app/entities/test.ts', `${names.kebabName}/src/app/entities/test.ts`);
  copyFileFromTemplates(
    'app/src/app/entities/user.entity.ts',
    `${names.kebabName}/src/app/entities/user.entity.ts`
  );

  mkdirIfNotExists(`${names.kebabName}/src/app/sub-modules`);
  copyFileFromTemplates('app/src/app/sub-modules/index.ts', `${names.kebabName}/src/app/sub-modules/index.ts`);
  copyFileFromTemplates('app/src/app/sub-modules/test.ts', `${names.kebabName}/src/app/sub-modules/test.ts`);

  mkdirIfNotExists(`${names.kebabName}/src/app/services`);
  copyFileFromTemplates('app/src/app/services/index.ts', `${names.kebabName}/src/app/services/index.ts`);
  copyFileFromTemplates('app/src/app/services/test.ts', `${names.kebabName}/src/app/services/test.ts`);

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
