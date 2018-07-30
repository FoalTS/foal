import { Config, HttpResponseOK } from '../../core';

export function render(template: string, locals?: object): HttpResponseOK {
  const templateEngine = Config.get('settings', 'templateEngine', '@foal/ejs') as string;
  const { renderToString } = require(templateEngine);
  if (!renderToString) {
    throw new Error(`${templateEngine} is not a template engine.`);
  }
  return new HttpResponseOK(renderToString(template, locals));
}
