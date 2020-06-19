// 3p
import { underline } from 'colors/safe';

// FoalTS
import { ClientError, FileSystem } from '../../file-system';
import { getNames } from '../../utils';

export function createRestApi({ name, register, auth }: { name: string, register: boolean, auth?: boolean }) {
  auth = auth || false;

  const fs = new FileSystem();

  if (fs.projectHasDependency('mongodb')) {
    throw new ClientError('"foal generate|g rest-api <name>" cannot be used in a MongoDB project.');
  }

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
    .renderOnlyIf(!auth, 'rest-api/entity.ts', `${names.kebabName}.entity.ts`, names)
    .renderOnlyIf(auth, 'rest-api/entity.auth.ts', `${names.kebabName}.entity.ts`, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.entity`);

  fs.currentDir = '';

  const isCurrentDir = !controllerRoot;

  fs
    .cd(controllerRoot)

    .renderOnlyIf(!isCurrentDir && !auth, 'rest-api/controller.ts', `${names.kebabName}.controller.ts`, names)
    .renderOnlyIf(!isCurrentDir && auth, 'rest-api/controller.auth.ts', `${names.kebabName}.controller.ts`, names)
    .renderOnlyIf(
      isCurrentDir && !auth, 'rest-api/controller.current-dir.ts', `${names.kebabName}.controller.ts`, names
    )
    .renderOnlyIf(
      isCurrentDir && auth, 'rest-api/controller.current-dir.auth.ts', `${names.kebabName}.controller.ts`, names
    )

    .renderOnlyIf(!isCurrentDir && !auth, 'rest-api/controller.spec.ts', `${names.kebabName}.controller.spec.ts`, names)
    .renderOnlyIf(
      !isCurrentDir && auth, 'rest-api/controller.spec.auth.ts', `${names.kebabName}.controller.spec.ts`, names
    )
    .renderOnlyIf(
      isCurrentDir && !auth, 'rest-api/controller.spec.current-dir.ts', `${names.kebabName}.controller.spec.ts`, names
    )
    .renderOnlyIf(
      isCurrentDir && auth,
      'rest-api/controller.spec.current-dir.auth.ts',
      `${names.kebabName}.controller.spec.ts`,
      names
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
        { logs: false }
      )
      .addOrExtendNamedImportIn(
        'app.controller.ts',
        className,
        './controllers',
        { logs: false }
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
