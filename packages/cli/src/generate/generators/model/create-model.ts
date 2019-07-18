// std
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// 3p
import { red, yellow } from 'colors/safe';

// FoalTS
import { findProjectPath, Generator, getNames } from '../../utils';

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

  const names = getNames(name);

  let root = '';

  if (existsSync('src/app/models')) {
    root = 'src/app/models';
  } else if (existsSync('models')) {
    root = 'models';
  }

  new Generator('model', root)
    .renderTemplate('model.ts', names, `${names.kebabName}.model.ts`)
    .updateFile('index.ts', content => {
      const exportNames = [ `I${names.upperFirstCamelName}`, names.upperFirstCamelName ].sort();
      content += `export { ${exportNames.join(', ')} } from './${names.kebabName}.model';\n`;
      return content;
    }, { allowFailure: true });
}
