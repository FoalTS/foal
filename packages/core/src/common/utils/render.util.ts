// std
import { readFile } from 'fs';
import { join } from 'path';

// FoalTS
import { promisify } from 'util';
import { Config, HttpResponseOK } from '../../core';

/**
 * Util function to render a template. Minimalist built-in template engine for FoalTS.
 *
 * renderToString('Hello {{ name }}!', { name: 'Mary' }) returns 'Hello Mary!'
 *
 * @export
 * @param {string} template - The template.
 * @param {object} locals - The variables required by the template.
 * @returns {string} The rendered template.
 */
export function renderToString(template: string, locals: object): string {
  // tslint:disable-next-line:forin
  for (const key in locals) {
    template = template.replace(new RegExp(`{{ ${key} }}`, 'g'), locals[key]);
  }
  return template;
}

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
  const template = await promisify(readFile)(join(dirname, templatePath), 'utf8');

  const templateEngine = Config.get<string|undefined>('settings.templateEngine');
  if (templateEngine) {
    const { renderToString } = require(templateEngine);
    if (!renderToString) {
      throw new Error(`${templateEngine} is not a template engine compatible with FoalTS.`);
    }
    return new HttpResponseOK(renderToString(template, locals));
  }

  return new HttpResponseOK(renderToString(template, locals));
}
