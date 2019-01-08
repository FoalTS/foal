// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export function createRestApi({ name }: { name: string }) {
  const names = getNames(name);

  let entityRoot = '';
  let controllerRoot = '';

  if (existsSync('src/app/entities') && existsSync('src/app/controllers')) {
    entityRoot = 'src/app/entities';
    controllerRoot = 'src/app/controllers';
  } else if (existsSync('entities') && existsSync('controllers')) {
    entityRoot = 'entities';
    controllerRoot = 'controllers';
  }

  new Generator('rest-api', entityRoot)
    .renderTemplate('entity.ts', names, `${names.kebabName}.entity.ts`)
    .updateFile('index.ts', content => {
      content += `export { ${names.upperFirstCamelName} } from './${names.kebabName}.entity';\n`;
      return content;
    });

  new Generator('rest-api', controllerRoot)
    .renderTemplate(
      controllerRoot ? 'controller.ts' : 'controller.current-dir.ts',
      names,
      `${names.kebabName}.controller.ts`
    )
    .renderTemplate(
      controllerRoot ? 'controller.spec.ts' : 'controller.spec.current-dir.ts',
      names,
      `${names.kebabName}.controller.spec.ts`
    )
    .updateFile('index.ts', content => {
      content += `export { ${names.upperFirstCamelName}Controller } from './${names.kebabName}.controller';\n`;
      return content;
    });
}
