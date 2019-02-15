// std
import { readFileSync } from 'fs';
import { join } from 'path';

// FoalTS
import { Config, HttpResponseOK } from '../../core';

export function render(templatePath: string, locals: object, dirname: string): HttpResponseOK {
  const templateEngine = Config.get<string>('settings.templateEngine', '@foal/ejs');
  const { renderToString } = require(templateEngine);
  if (!renderToString) {
    throw new Error(`${templateEngine} is not a template engine.`);
  }
  const template = readFileSync(join(dirname, templatePath), 'utf8');
  return new HttpResponseOK(renderToString(template, locals));
}
