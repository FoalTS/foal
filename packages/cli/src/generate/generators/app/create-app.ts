// std
import * as crypto from 'crypto';

// FoalTS
import {
  copyFileFromNodeModules,
  copyFileFromTemplates,
  getNames,
  mkdirIfNotExists,
  renderTemplate
} from '../../utils';

export function createApp({ name, sessionSecret, log = true }:
  { name: string, sessionSecret?: string, log?: boolean }) {
  const names = getNames(name);
  if (log) {
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
  mkdirIfNotExists(names.kebabName, log);
  copyFileFromTemplates('app/gitignore', `${names.kebabName}/.gitignore`, log);
  copyFileFromTemplates('app/ormconfig.json', `${names.kebabName}/ormconfig.json`, log);
  renderTemplate('app/package.json', `${names.kebabName}/package.json`, locals, log);
  copyFileFromTemplates('app/tsconfig.json', `${names.kebabName}/tsconfig.json`, log);
  copyFileFromTemplates('app/tslint.json', `${names.kebabName}/tslint.json`, log);

  // Config
  mkdirIfNotExists(`${names.kebabName}/config`, log);
  renderTemplate('app/config/app.development.json', `${names.kebabName}/config/app.development.json`, locals, log);
  renderTemplate('app/config/app.production.json', `${names.kebabName}/config/app.production.json`, locals, log);
  renderTemplate('app/config/app.test.json', `${names.kebabName}/config/app.test.json`, locals, log);
  renderTemplate(
    'app/config/settings.json',
    `${names.kebabName}/config/settings.json`,
    locals, log
  );
  renderTemplate(
    'app/config/settings.development.json',
    `${names.kebabName}/config/settings.development.json`,
    locals, log
  );
  renderTemplate(
    'app/config/settings.production.json',
    `${names.kebabName}/config/settings.production.json`,
    locals, log
  );

  // Public
  mkdirIfNotExists(`${names.kebabName}/public`, log);
  copyFileFromTemplates('app/public/logo.png', `${names.kebabName}/public/logo.png`, log);
  copyFileFromNodeModules('bootstrap/dist/css/bootstrap.min.css', `${names.kebabName}/public/bootstrap.min.css`, log);

  // Src
  mkdirIfNotExists(`${names.kebabName}/src`, log);
  copyFileFromTemplates('app/src/index.ts', `${names.kebabName}/src/index.ts`, log);
  copyFileFromTemplates('app/src/test.ts', `${names.kebabName}/src/test.ts`, log);

  mkdirIfNotExists(`${names.kebabName}/src/app`, log);
  copyFileFromTemplates('app/src/app/app.module.ts', `${names.kebabName}/src/app/app.module.ts`, log);
  copyFileFromTemplates('app/src/app/test.ts', `${names.kebabName}/src/app/test.ts`, log);

  mkdirIfNotExists(`${names.kebabName}/src/app/controllers`, log);
  copyFileFromTemplates('app/src/app/controllers/index.ts', `${names.kebabName}/src/app/controllers/index.ts`, log);
  copyFileFromTemplates('app/src/app/controllers/test.ts', `${names.kebabName}/src/app/controllers/test.ts`, log);
  copyFileFromTemplates(
    'app/src/app/controllers/view.controller.ts',
    `${names.kebabName}/src/app/controllers/view.controller.ts`,
    log
  );
  mkdirIfNotExists(`${names.kebabName}/src/app/controllers/templates`, log);
  copyFileFromTemplates(
    'app/src/app/controllers/templates/index.html',
    `${names.kebabName}/src/app/controllers/templates/index.html`,
    log
  );
  copyFileFromTemplates(
    'app/src/app/controllers/templates/index.ts',
    `${names.kebabName}/src/app/controllers/templates/index.ts`,
    log
  );
  copyFileFromTemplates(
    'app/src/app/controllers/templates/test.ts',
    `${names.kebabName}/src/app/controllers/templates/test.ts`,
    log
  );

  mkdirIfNotExists(`${names.kebabName}/src/app/hooks`, log);
  copyFileFromTemplates('app/src/app/hooks/index.ts', `${names.kebabName}/src/app/hooks/index.ts`, log);
  copyFileFromTemplates('app/src/app/hooks/test.ts', `${names.kebabName}/src/app/hooks/test.ts`, log);

  mkdirIfNotExists(`${names.kebabName}/src/app/entities`, log);
  copyFileFromTemplates('app/src/app/entities/index.ts', `${names.kebabName}/src/app/entities/index.ts`, log);
  copyFileFromTemplates('app/src/app/entities/test.ts', `${names.kebabName}/src/app/entities/test.ts`, log);
  copyFileFromTemplates(
    'app/src/app/entities/user.entity.ts',
    `${names.kebabName}/src/app/entities/user.entity.ts`,
    log
  );

  mkdirIfNotExists(`${names.kebabName}/src/app/sub-modules`, log);
  copyFileFromTemplates('app/src/app/sub-modules/index.ts', `${names.kebabName}/src/app/sub-modules/index.ts`, log);
  copyFileFromTemplates('app/src/app/sub-modules/test.ts', `${names.kebabName}/src/app/sub-modules/test.ts`, log);

  mkdirIfNotExists(`${names.kebabName}/src/app/services`, log);
  copyFileFromTemplates('app/src/app/services/index.ts', `${names.kebabName}/src/app/services/index.ts`, log);
  copyFileFromTemplates('app/src/app/services/test.ts', `${names.kebabName}/src/app/services/test.ts`, log);

  if (log) {
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
