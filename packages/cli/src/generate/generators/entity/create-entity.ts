// std
import { existsSync } from 'fs';

// FoalTS
import { getNames, renderTemplate, updateFile } from '../../utils';

export function createEntity({ name }: { name: string }) {
  const names = getNames(name);

  let path = `${names.kebabName}.entity.ts`;
  let indexPath = 'index.ts';

  if (existsSync('src/app/entities')) {
    path = `src/app/entities/${path}`;
    indexPath = `src/app/entities/${indexPath}`;
  } else if (existsSync('entities')) {
    path = `entities/${path}`;
    indexPath = `entities/${indexPath}`;
  }

  renderTemplate('entity/entity.ts', path, names);

  updateFile(indexPath, content => {
    content += `export { ${names.upperFirstCamelName} } from './${names.kebabName}.entity';\n`;
    return content;
  });
}
