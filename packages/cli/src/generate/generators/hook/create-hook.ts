// std
import { existsSync } from 'fs';

// FoalTS
import { getNames, renderTemplate } from '../../utils';

export function createHook({ name }: { name: string }) {
  const names = getNames(name);

  let path = `${names.kebabName}.hook.ts`;

  if (existsSync('src/app/hooks')) {
    path = `src/app/hooks/${path}`;
  } else if (existsSync('hooks')) {
    path = `hooks/${path}`;
  }

  renderTemplate('hook/hook.ts', path, names);
}
