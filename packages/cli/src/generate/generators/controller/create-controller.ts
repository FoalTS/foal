// std
import { existsSync } from 'fs';

// FoalTS
import { getNames, renderTemplate } from '../../utils';

export type ControllerType = 'Empty'|'REST'|'GraphQL'|'Login';

export function createController({ name, type }: { name: string, type: ControllerType }) {
  const names = getNames(name);

  let path = `${names.kebabName}.controller.ts`;
  let testPath  = `${names.kebabName}.controller.spec.ts`;

  if (existsSync('src/app/controllers')) {
    path = `src/app/controllers/${path}`;
    testPath = `src/app/controllers/${testPath}`;
  } else if (existsSync('controllers')) {
    path = `controllers/${path}`;
    testPath = `controllers/${testPath}`;
  }

  switch (type) {
    case 'Empty':
      renderTemplate('controller/controller.empty.ts', path, names);
      renderTemplate('controller/controller.spec.empty.ts', testPath, names);
      break;
    case 'REST':
      renderTemplate('controller/controller.rest.ts', path, names);
      break;
    case 'GraphQL':
      renderTemplate('controller/controller.graphql.ts', path, names);
      break;
    case 'Login':
      renderTemplate('controller/controller.login.ts', path, names);
      break;
  }

}
