// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export function createService({ name }: { name: string }) {
  const names = getNames(name);

  let root = '';

  if (existsSync('src/app/services')) {
    root = 'src/app/services';
  } else if (existsSync('services')) {
    root = 'services';
  }

  new Generator('service', root)
    .renderTemplate('service.empty.ts', names, `${names.kebabName}.service.ts`)
    .updateFile('index.ts', content => {
      content += `export { ${names.upperFirstCamelName} } from './${names.kebabName}.service';\n`;
      return content;
    });

}
