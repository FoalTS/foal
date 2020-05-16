// std
import { existsSync } from 'fs';
import { join, relative } from 'path';

// 3p
import { red } from 'colors/safe';

// FoalTS
import { FileSystem } from '../../file-system';
import { findProjectPath, getNames } from '../../utils';

export function createScript({ name }: { name: string }) {
  const names = getNames(name);

  const root = findProjectPath();

  if (!root) {
    console.log(red('\n  This directory is not a Foal project (missing package.json).\n'));
    return;
  }

  const scriptPath = join(root, './src/scripts/');
  if (!existsSync(scriptPath)) {
    if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
      console.log(red(`\n  This directory is not a Foal project (${scriptPath} does not exist).\n`));
    }
    return;
  }

  const fs = new FileSystem();
  // TODO: remove this line.
  (fs as any).testDir = '';

  fs
    // Use `relative` to have pretty CREATE logs.
    .cd(relative(process.cwd(), scriptPath))
    .copy('script/script.ts', `${names.kebabName}.ts`);
}
