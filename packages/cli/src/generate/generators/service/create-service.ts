// FoalTS
import { basename, dirname } from 'path';
import { FileSystem } from '../../../services';
import { getNames } from '../../utils';

export function createService({ name }: { name: string }) {
  const fs = new FileSystem();

  let root = '';
  if (fs.exists('src/app/services')) {
    root = 'src/app/services';
  } else if (fs.exists('services')) {
    root = 'services';
  }

  const names = getNames(basename(name));
  const subdir = dirname(name);

  fs
    .cd(root)
    .ensureDir(subdir)
    .cd(subdir)
    .render('service/service.empty.ts', `${names.kebabName}.service.ts`, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.service`);

}
