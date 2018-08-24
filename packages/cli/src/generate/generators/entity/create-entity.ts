// std
import { existsSync, readFileSync, writeFileSync } from 'fs';

// FoalTS
import { getNames, renderTemplate } from '../../utils';

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

  let indexContent = readFileSync(indexPath, 'utf8');
  indexContent += `export { ${names.upperFirstCamelName} } from './${names.kebabName}.entity';\n`;
  writeFileSync(indexPath, indexContent, 'utf8');
}
