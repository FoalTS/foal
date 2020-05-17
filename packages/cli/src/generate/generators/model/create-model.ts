// std
import { readFileSync } from 'fs';
import { join } from 'path';

// 3p
import { red, yellow } from 'colors/safe';

// FoalTS
import { FileSystem } from '../../file-system';
import { findProjectPath, getNames } from '../../utils';

export function createModel({ name, checkMongoose }: { name: string, checkMongoose?: boolean }) {
  const projectPath = findProjectPath();

  if (checkMongoose && projectPath !== null) {
    const pkg = JSON.parse(readFileSync(join(projectPath, 'package.json'), 'utf8'));
    if (!pkg.dependencies || !pkg.dependencies.mongoose) {
      console.log(red(
        `\n  "foal generate|g ${yellow('model')} <name>" can only be used in a Mongoose project. `
        + `\n    Please use "foal generate|g ${yellow('entity')} <name>" instead.\n`
      ));
      return;
    }
  }

  const fs = new FileSystem();

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
