// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export type ControllerType = 'Empty'|'REST'|'GraphQL'|'Login';

export function createController({ name, type }: { name: string, type: ControllerType }) {
  const names = getNames(name);

  const fileName = `${names.kebabName}.controller.ts`;
  const specFileName = `${names.kebabName}.controller.spec.ts`;

  let root = '';

  if (existsSync('src/app/controllers')) {
    root = 'src/app/controllers';
  } else if (existsSync('controllers')) {
    root = 'controllers';
  }

  const generator = new Generator('controller', root)
    .renderTemplate(`controller.${type.toLowerCase()}.ts`, names, fileName)
    .updateFile('index.ts', content => {
      content += `export { ${names.upperFirstCamelName}Controller } from './${names.kebabName}.controller';\n`;
      return content;
    });

  if (type === 'Empty') {
    generator
      .renderTemplate('controller.spec.empty.ts', names, specFileName);
  }
}
