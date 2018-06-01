import { getNames, Names, writeFile } from '../helpers';

export type Type = 'empty'|'model'|'email-authenticator'|'authenticator';

function choice(name: string, value: Type) {
  return { name, value };
}

export async function generateService() {
  const { name, type } = await this.prompt([
    {
      message: 'Name',
      name: 'name',
      type: 'input',
    },
    {
      choices: [
        choice('Empty', 'empty'),
        choice('Email and password authenticator', 'email-authenticator'),
        choice('Model service (typeorm)', 'model'),
        choice('Authenticator (to implement)', 'authenticator'),
        // choice('Model (to implement)', 'model'),
      ],
      default: 0,
      message: 'Type',
      name: 'type',
      type: 'list',
    }
  ]) as { name: string, type: Type };
  if (!name) {
    console.error('You must provide a name.');
    return;
  }
  switch (type) {
    case 'authenticator':
      return renderAuthenticatorServiceTemplates(name);
    case 'email-authenticator':
      return renderEmailAuthenticatorServiceTemplates(name);
    case 'empty':
      return renderEmptyServiceTemplates(name);
    case 'model':
      return renderModelServiceTemplates(name);
  }
}

export function renderAuthenticatorServiceTemplates(name: string) {
  const names = getNames(name);
  const template = require('./templates/authenticator.service.ts-t');
  const specTemplate = require('./templates/authenticator.service.spec.ts-t');
  writeFile(`${names.kebabName}.service.ts`, template, names);
  writeFile(`${names.kebabName}.service.spec.ts`, specTemplate, names);
}

export function renderEmailAuthenticatorServiceTemplates(name: string) {
  const names = getNames(name);
  const template = require('./templates/email-authenticator.service.ts-t');
  writeFile(`${names.kebabName}.service.ts`, template, names);
}

export function renderEmptyServiceTemplates(name: string) {
  const names = getNames(name);
  const template = require('./templates/empty.service.ts-t');
  const specTemplate = require('./templates/empty.service.spec.ts-t');
  writeFile(`${names.kebabName}.service.ts`, template, names);
  writeFile(`${names.kebabName}.service.spec.ts`, specTemplate, names);
}

export function renderModelServiceTemplates(name: string) {
  const names = getNames(name);
  const template = require('./templates/model.service.ts-t');
  writeFile(`${names.kebabName}.service.ts`, template, names);
}
