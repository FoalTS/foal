// std
import { existsSync } from 'fs';

// FoalTS
import { Generator, getNames } from '../../utils';

export function createScript({ name }: { name: string }) {
  const names = getNames(name);

  let root = '';

  if (existsSync('src/scripts')) {
    root = 'src/scripts';
  }

  new Generator('script', root)
    .copyFileFromTemplates('script.ts', `${names.kebabName}.ts`);
}
