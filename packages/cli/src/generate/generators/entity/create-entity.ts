// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export function createEntity({ name }: { name: string }) {
  const names = getNames(name);

  let root = '';

  if (existsSync('src/app/entities')) {
    root = 'src/app/entities';
  } else if (existsSync('entities')) {
    root = 'entities';
  }

  new Generator('entity', root)
    .renderTemplate('entity.ts', names, `${names.kebabName}.entity.ts`)
    .updateFile('index.ts', content => {
      content += `export { ${names.upperFirstCamelName} } from './${names.kebabName}.entity';\n`;
      return content;
    }, { allowFailure: true });
}
