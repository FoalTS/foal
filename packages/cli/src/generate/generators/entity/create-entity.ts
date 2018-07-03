import { getNames, renderTemplate } from '../../utils';

export function createEntity({ name }: { name: string }) {
  const names = getNames(name);

  renderTemplate('entity/entity.ts', `${names.kebabName}.entity.ts`, names);
}
