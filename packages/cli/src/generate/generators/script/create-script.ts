// std
import { existsSync } from 'fs';
import { join, relative } from 'path';

// 3p
import { red } from 'colors/safe';

// FoalTS
import { findProjectPath, Generator, getNames } from '../../utils';

export function createScript({ name }: { name: string }) {
  const names = getNames(name);

  const root = findProjectPath();

  if (!root) {
    console.log(red('\n  This directory is not a Foal project (missing package.json).\n'));
    return;
  }

  const scriptPath = join(root, './src/scripts/');
  if (!existsSync(scriptPath)) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(red(`\n  This directory is not a Foal project (${scriptPath} does not exist).\n`));
    }
    return;
  }

  // Use `relative` to have pretty CREATE logs.
  new Generator('script', relative(process.cwd(), scriptPath))
    .copyFileFromTemplates('script.ts', `${names.kebabName}.ts`);
}
