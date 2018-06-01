import { prompt } from 'inquirer';

import { getNames, Names, writeFile } from '../helpers';

export async function generatePostHook() {
  const { name } = await prompt([
    {
      message: 'Name',
      name: 'name',
      type: 'input',
    }
  ]);
  if (!name) {
    console.error('You must provide a name.');
    return;
  }
  renderPostHookTemplates(name);
}

export function renderPostHookTemplates(name: string, dir?: string) {
  const names = getNames(name);
  const postHookTemplate = require('./templates/post-hook.ts-t');
  const postHookSpecTemplate = require('./templates/post-hook.spec.ts-t');
  writeFile(dir, `${names.kebabName}.post-hook.ts`, postHookTemplate, names);
  writeFile(dir, `${names.kebabName}.post-hook.spec.ts`, postHookSpecTemplate, names);
}
