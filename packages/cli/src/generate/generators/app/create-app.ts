import { copyFileFromTemplates, getNames, mkdirIfNotExists, renderTemplate } from '../../utils';

export function createApp({ name, sessionSecret }: { name: string, sessionSecret?: string }) {
    const names = getNames(name);
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

    const locals = {
      ...names,
      sessionSecret: sessionSecret ? sessionSecret : 'foobar'
    };

    // Root
    mkdirIfNotExists(names.kebabName);

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

    // Src
    mkdirIfNotExists(`${names.kebabName}/src`);

    mkdirIfNotExists(`${names.kebabName}/src/app`);

    mkdirIfNotExists(`${names.kebabName}/src/app/controllers`);
    copyFileFromTemplates('app/src/app/controllers/index.ts', `${names.kebabName}/src/app/controllers/index.ts`);
    copyFileFromTemplates('app/src/app/controllers/test.ts', `${names.kebabName}/src/app/controllers/test.ts`);

    mkdirIfNotExists(`${names.kebabName}/src/app/hooks`);
    copyFileFromTemplates('app/src/app/hooks/index.ts', `${names.kebabName}/src/app/hooks/index.ts`);
    copyFileFromTemplates('app/src/app/hooks/test.ts', `${names.kebabName}/src/app/hooks/test.ts`);

    mkdirIfNotExists(`${names.kebabName}/src/app/entities`);
    copyFileFromTemplates('app/src/app/entities/index.ts', `${names.kebabName}/src/app/entities/index.ts`);
    copyFileFromTemplates('app/src/app/entities/test.ts', `${names.kebabName}/src/app/entities/test.ts`);

    mkdirIfNotExists(`${names.kebabName}/src/app/sub-modules`);
    copyFileFromTemplates('app/src/app/sub-modules/index.ts', `${names.kebabName}/src/app/sub-modules/index.ts`);
    copyFileFromTemplates('app/src/app/sub-modules/test.ts', `${names.kebabName}/src/app/sub-modules/test.ts`);

    mkdirIfNotExists(`${names.kebabName}/src/app/services`);
    copyFileFromTemplates('app/src/app/services/index.ts', `${names.kebabName}/src/app/services/index.ts`);
    copyFileFromTemplates('app/src/app/services/test.ts', `${names.kebabName}/src/app/services/test.ts`);

    mkdirIfNotExists(`${names.kebabName}/src/app/templates`);
    copyFileFromTemplates('app/src/app/templates/index.html', `${names.kebabName}/src/app/templates/index.html`);
    copyFileFromTemplates('app/src/app/templates/index.ts', `${names.kebabName}/src/app/templates/index.ts`);
    copyFileFromTemplates('app/src/app/templates/test.ts', `${names.kebabName}/src/app/templates/test.ts`);

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
