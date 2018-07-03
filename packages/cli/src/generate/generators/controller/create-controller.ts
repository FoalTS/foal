import { getNames, renderTemplate } from '../../utils';

export type ControllerType = 'Empty'|'REST'|'GraphQL';

export function createController({ name, type }: { name: string, type: ControllerType }) {
  const names = getNames(name);

  switch (type) {
    case 'Empty':
      renderTemplate('controller/controller.empty.ts', `${names.kebabName}.controller.ts`, names);
      break;
    case 'REST':
      renderTemplate('controller/controller.rest.ts', `${names.kebabName}.controller.ts`, names);
      break;
    case 'GraphQL':
      renderTemplate('controller/controller.graphql.ts', `${names.kebabName}.controller.ts`, names);
      break;
  }

}
