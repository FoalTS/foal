// std
import { existsSync, readFileSync, writeFileSync } from 'fs';

// FoalTS
import { getNames, renderTemplate } from '../../utils';

export function createHook({ name }: { name: string }) {
  const names = getNames(name);

  let path = `${names.kebabName}.hook.ts`;
  let indexPath = 'index.ts';

  if (existsSync('src/app/hooks')) {
    path = `src/app/hooks/${path}`;
    indexPath = `src/app/hooks/${indexPath}`;
  } else if (existsSync('hooks')) {
    path = `hooks/${path}`;
    indexPath = `hooks/${indexPath}`;
  }

  renderTemplate('hook/hook.ts', path, names);

  let indexContent = readFileSync(indexPath, 'utf8');
  indexContent += `export { ${names.upperFirstCamelName} } from './${names.kebabName}.hook';\n`;
  writeFileSync(indexPath, indexContent, 'utf8');
}
