// std
import { readFileSync } from 'fs';
import { join } from 'path';

// 3p
import { red, underline } from 'colors/safe';

// FoalTS
import { FileSystem } from '../../file-system';
import { findProjectPath, getNames } from '../../utils';

export function createRestApi({ name, register }: { name: string, register: boolean }) {
  const projectPath = findProjectPath();

  if (projectPath !== null) {
    const pkg = JSON.parse(readFileSync(join(projectPath, 'package.json'), 'utf8'));
    if (pkg.dependencies && pkg.dependencies.mongoose) {
      console.log(red(
        '\n  "foal generate|g rest-api <name>" cannot be used in a Mongoose project.\n'
      ));
      return;
    }
  }

  const fs = new FileSystem();

  let entityRoot = '';
  let controllerRoot = '';
  if (fs.exists('src/app/entities') && fs.exists('src/app/controllers')) {
    entityRoot = 'src/app/entities';
    controllerRoot = 'src/app/controllers';
  } else if (fs.exists('entities') && fs.exists('controllers')) {
    entityRoot = 'entities';
    controllerRoot = 'controllers';
  }

  const names = getNames(name);

  const className = `${names.upperFirstCamelName}Controller`;

  fs
    .cd(entityRoot)
    .render('rest-api/entity.ts', `${names.kebabName}.entity.ts`, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.entity`);

  fs.currentDir = '';

  fs
    .cd(controllerRoot)
    .render(
      controllerRoot ? 'rest-api/controller.ts' : 'rest-api/controller.current-dir.ts',
      `${names.kebabName}.controller.ts`,
      names,
    )
    .render(
      controllerRoot ? 'rest-api/controller.spec.ts' : 'rest-api/controller.spec.current-dir.ts',
      `${names.kebabName}.controller.spec.ts`,
      names,
    )
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', className, `./${names.kebabName}.controller`);

  if (register) {
    fs
      .cd('..')
      .addOrExtendNamedImportIn(
        'app.controller.ts',
        'controller',
        '@foal/core',
      )
      .addOrExtendNamedImportIn(
        'app.controller.ts',
        className,
        './controllers'
      )
      .addOrExtendClassArrayPropertyIn(
        'app.controller.ts',
        'subControllers',
        `controller('/${names.kebabName}s', ${className})`
      );
    }

  if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
    console.log(
      `\n${underline('Next steps:')} Complete ${names.upperFirstCamelName} (${names.kebabName}.entity)`
      + ` and ${names.camelName}Schema (${names.kebabName}.controller).`
    );
  }
}
