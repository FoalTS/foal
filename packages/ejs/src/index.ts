/**
 * FoalTS
 * Copyright(c) 2017-2019 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

import { render } from 'ejs';

/**
 * Util function to render a template using EJS. It is used by the `render` function in `@foal/core`.
 *
 * @export
 * @param {string} template - The template.
 * @param {object} locals - The variables required by the template.
 * @returns {string} The rendered template.
 */
export function renderToString(template: string, locals: object): string {
  return render(template, locals);
}
