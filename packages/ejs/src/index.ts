/**
 * FoalTS
 * Copyright(c) 2017-2018 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

import { render } from 'ejs';

export function renderToString(template: string, locals: object): string {
  return render(template, locals);
}
