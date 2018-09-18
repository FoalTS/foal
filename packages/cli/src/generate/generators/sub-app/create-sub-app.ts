
// 3p
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export function createSubApp({ name }: { name: string }) {
  const names = getNames(name);

  let root = '';

  if (existsSync('src/app/sub-apps')) {
    root = 'src/app/sub-apps';
  } else if (existsSync('sub-apps')) {
    root = 'sub-apps';
  }

  new Generator('sub-app', root)
    .mkdirIfDoesNotExist(names.kebabName)
    .updateFile('index.ts', content => {
      content += `export { ${names.upperFirstCamelName}Controller } from './${names.kebabName}';\n`;
      return content;
    });

  new Generator('sub-app', root ? root + '/' + names.kebabName : names.kebabName)
    .renderTemplate('index.ts', names)
    .renderTemplate('controller.ts', names, `${names.kebabName}.controller.ts`)
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
      // Sub-apps
      .mkdirIfDoesNotExist('sub-apps')
      .copyFileFromTemplates('sub-apps/index.ts')
      // Services
      .mkdirIfDoesNotExist('services')
      .copyFileFromTemplates('services/index.ts');
}
