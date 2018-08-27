
// 3p
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export function createModule({ name }: { name: string }) {
  const names = getNames(name);

  let root = '';

  if (existsSync('src/app/sub-modules')) {
    root = 'src/app/sub-modules';
  } else if (existsSync('sub-modules')) {
    root = 'sub-modules';
  }

  new Generator('module', root)
    .mkdirIfDoesNotExist(names.kebabName)
    .updateFile('index.ts', content => {
      content += `export { ${names.upperFirstCamelName}Module } from './${names.kebabName}';\n`;
      return content;
    });

  new Generator('module', root ? root + '/' + names.kebabName : names.kebabName)
    .renderTemplate('index.ts', names)
    .renderTemplate('module.ts', names, `${names.kebabName}.module.ts`)
      // Controllers
      .mkdirIfDoesNotExist('controllers')
      .copyFileFromTemplates('controllers/index.ts')
      .mkdirIfDoesNotExist('controllers/templates')
      // Hooks
      .mkdirIfDoesNotExist('hooks')
      .copyFileFromTemplates('hooks/index.ts')
      // Entities
      .mkdirIfDoesNotExist('entities')
      .copyFileFromTemplates('entities/index.ts')
      // Sub-modules
      .mkdirIfDoesNotExist('sub-modules')
      .copyFileFromTemplates('sub-modules/index.ts')
      // Services
      .mkdirIfDoesNotExist('services')
      .copyFileFromTemplates('services/index.ts');
}
