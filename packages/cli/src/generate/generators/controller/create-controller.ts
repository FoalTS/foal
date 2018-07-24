import { existsSync } from 'fs';

import { getNames, renderTemplate } from '../../utils';

export type ControllerType = 'Empty'|'REST'|'GraphQL';

export function createController({ name, type }: { name: string, type: ControllerType }) {
  const names = getNames(name);

  let path = `${names.kebabName}.controller.ts`;

  if (existsSync('src/app/controllers')) {
    path = `src/app/controllers/${path}`;
  } else if (existsSync('controllers')) {
    path = `controllers/${path}`;
  }

  switch (type) {
    case 'Empty':
      renderTemplate('controller/controller.empty.ts', path, names);
      break;
    case 'REST':
      renderTemplate('controller/controller.rest.ts', path, names);
      break;
    case 'GraphQL':
      renderTemplate('controller/controller.graphql.ts', path, names);
      break;
  }

}
