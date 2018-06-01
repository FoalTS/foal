import { writeFileSync } from 'fs';
import { join } from 'path';

import { render } from 'ejs';
import { camelCase, kebabCase, upperFirst } from 'lodash';

export interface Names {
  camelName: string;
  kebabName: string;
  upperCamelName: string;
}

export function getNames(name: string): Names {
  return {
    camelName: camelCase(name),
    kebabName: kebabCase(name),
    upperCamelName: upperFirst(camelCase(name)),
  };
}

export function writeFile(path: string, template: string, locals: object) {
  writeFileSync(
    join(process.cwd(), path),
    render(template, locals)
  );
}
