// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export function createHook({ name }: { name: string }) {
  const names = getNames(name);

  let root = '';

  if (existsSync('src/app/hooks')) {
    root = 'src/app/hooks';
  } else if (existsSync('hooks')) {
    root = 'hooks';
  }

  new Generator('hook', root)
    .renderTemplate('hook.ts', names, `${names.kebabName}.hook.ts`)
    .updateFile('index.ts', content => {
      content += `export { ${names.upperFirstCamelName} } from './${names.kebabName}.hook';\n`;
      return content;
    }, { allowFailure: true });
}
