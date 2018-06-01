import { getNames, Names, writeFile } from '../helpers';

export async function generatePostHook() {
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
  const postHookTemplate = require('./templates/post-hook.ts-t');
  const postHookSpecTemplate = require('./templates/post-hook.spec.ts-t');
  writeFile(`${names.kebabName}.post-hook.ts`, postHookTemplate, names);
  writeFile(`${names.kebabName}.post-hook.spec.ts`, postHookSpecTemplate, names);
}
