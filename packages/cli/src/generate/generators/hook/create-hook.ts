import { getNames, renderTemplate } from '../../utils';

export function createHook({ name }: { name: string }) {
  const names = getNames(name);

  renderTemplate('hook/hook.ts', `${names.kebabName}.hook.ts`, names);
}
