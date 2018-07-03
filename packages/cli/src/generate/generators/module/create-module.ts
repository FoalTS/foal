import { getNames, mkdirIfNotExists, renderTemplate } from '../../utils';

export function createModule({ name }: { name: string }) {
  const names = getNames(name);

  mkdirIfNotExists(names.kebabName);

  renderTemplate('module/index.ts', `${names.kebabName}/index.ts`, names);
  renderTemplate('module/module.ts', `${names.kebabName}/${names.kebabName}.module.ts`, names);
}
