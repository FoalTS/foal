// std
import { readFile } from 'fs';
import { join } from 'path';

// FoalTS
import { promisify } from 'util';
import { Config, HttpResponseOK } from '../../core';

/**
 * Render a template in a new HttpResponseOK object.
 *
 * @export
 * @param {string} templatePath - The path of the template.
 * @param {object} locals - The variables used to render the template.
 * @param {string} dirname - The directory name where the templated is located.
 * The passed value is usually `__dirname`. The function then joins `dirname` and
 * `templatePath` together.
 * @returns {HttpResponseOK}
 */
export async function render(templatePath: string, locals: object, dirname: string): Promise<HttpResponseOK> {
  const templateEngine = Config.get<string>('settings.templateEngine', '@foal/ejs');
  const { renderToString } = require(templateEngine);
  if (!renderToString) {
    throw new Error(`${templateEngine} is not a template engine.`);
  }
  const template = await promisify(readFile)(join(dirname, templatePath), 'utf8');
  return new HttpResponseOK(renderToString(template, locals));
}
