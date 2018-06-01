import { prompt } from 'inquirer';

import { getNames, Names, writeFile } from '../helpers';

export async function generatePreHook() {
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
  renderPreHookTemplates(name);
}

export function renderPreHookTemplates(name: string, dir?: string) {
  const names = getNames(name);
  const preHookTemplate = require('./templates/pre-hook.ts-t');
  const preHookSpecTemplate = require('./templates/pre-hook.spec.ts-t');
  writeFile(dir, `${names.kebabName}.pre-hook.ts`, preHookTemplate, names);
  writeFile(dir, `${names.kebabName}.pre-hook.spec.ts`, preHookSpecTemplate, names);
}
