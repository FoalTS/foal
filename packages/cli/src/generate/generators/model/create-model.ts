// 3p
import { yellow } from 'colors/safe';

// FoalTS
import { ClientError, FileSystem } from '../../file-system';
import {  getNames } from '../../utils';

export function createModel({ name }: { name: string }) {
  const fs = new FileSystem();

  if (!fs.projectHasDependency('mongoose')) {
    throw new ClientError(
      `"foal generate|g ${yellow('model')} <name>" can only be used in a Mongoose project.\n`
      + `  Please use "foal generate|g ${yellow('entity')} <name>" instead.`
    );
  }

  let root = '';
  if (fs.exists('src/app/models')) {
    root = 'src/app/models';
  } else if (fs.exists('models')) {
    root = 'models';
  }

  const names = getNames(name);

  fs
    .cd(root)
    .render('model/model.ts', `${names.kebabName}.model.ts`, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.model`);
}
