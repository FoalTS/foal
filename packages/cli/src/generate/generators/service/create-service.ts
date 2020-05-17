// FoalTS
import { FileSystem } from '../../file-system';
import { getNames } from '../../utils';

export function createService({ name }: { name: string }) {
  const fs = new FileSystem();

  let root = '';
  if (fs.exists('src/app/services')) {
    root = 'src/app/services';
  } else if (fs.exists('services')) {
    root = 'services';
  }

  const names = getNames(name);

  fs
    .cd(root)
    .render('service/service.empty.ts', `${names.kebabName}.service.ts`, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.service`);

}
