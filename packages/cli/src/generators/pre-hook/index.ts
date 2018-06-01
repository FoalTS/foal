import { getNames, Names, writeFile } from '../helpers';

export async function generatePreHook() {
  const { name } = await this.prompt([
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
  renderTemplates(name);
}

export function renderTemplates(name: string) {
  const names = getNames(name);
  const preHookTemplate = require('./templates/pre-hook.ts-t');
  const preHookSpecTemplate = require('./templates/pre-hook.spec.ts-t');
  writeFile(`${names.kebabName}.pre-hook.ts`, preHookTemplate, names);
  writeFile(`${names.kebabName}.pre-hook.spec.ts`, preHookSpecTemplate, names);
}
