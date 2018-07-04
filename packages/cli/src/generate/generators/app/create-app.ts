import { getNames, mkdirIfNotExists, renderTemplate } from '../../utils';

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
