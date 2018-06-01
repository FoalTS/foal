import { getNames, Names, writeFile } from '../helpers';

export async function generateModule() {
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
  const indexTemplate = require('./templates/index.ts-t');
  const moduleTemplate = require('./templates/module.ts-t');
  writeFile(`${names.kebabName}/index.ts`, indexTemplate, names);
  writeFile(`${names.kebabName}/${names.kebabName}.modyke.ts`, moduleTemplate, names);
}
