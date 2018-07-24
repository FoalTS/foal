import { existsSync } from 'fs';

import { getNames, renderTemplate } from '../../utils';

export function createEntity({ name }: { name: string }) {
  const names = getNames(name);

  let path = `${names.kebabName}.entity.ts`;

  if (existsSync('src/app/entities')) {
    path = `src/app/entities/${path}`;
  } else if (existsSync('entities')) {
    path = `entities/${path}`;
  }

  renderTemplate('entity/entity.ts', path, names);
}
