// FoalTS
import { FileSystem } from '../../file-system';
import { getNames } from '../../utils';

export function createHook({ name }: { name: string }) {
  const fs = new FileSystem();

  let root = '';
  if (fs.exists('src/app/hooks')) {
    root = 'src/app/hooks';
  } else if (fs.exists('hooks')) {
    root = 'hooks';
  }

  const names = getNames(name);

  fs
    .cd(root)
    .render('hook/hook.ts', `${names.kebabName}.hook.ts`, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.hook`);
}
