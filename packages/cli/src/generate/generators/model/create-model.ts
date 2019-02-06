// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export function createModel({ name }: { name: string }) {
  const names = getNames(name);

  let root = '';

  if (existsSync('src/app/models')) {
    root = 'src/app/models';
  } else if (existsSync('models')) {
    root = 'models';
  }

  new Generator('model', root)
    .renderTemplate('model.ts', names, `${names.kebabName}.model.ts`)
    .updateFile('index.ts', content => {
      const exportNames = [ `I${names.upperFirstCamelName}`, names.upperFirstCamelName ].sort();
      content += `export { ${exportNames.join(', ')} } from './${names.kebabName}.model';\n`;
      return content;
    });
}
