// std
import { basename, dirname } from 'path';

// 3p
import { underline } from 'colors/safe';

// FoalTS
import { ClientError, FileSystem } from '../../file-system';
import { getNames } from '../../utils';

export function createRestApi({ name, register, auth }: { name: string, register: boolean, auth?: boolean }) {
  auth = auth || false;

  const fs = new FileSystem();

  if (fs.projectHasDependency('mongodb')) {
    throw new ClientError('"npx foal generate|g rest-api <name>" cannot be used in a MongoDB project.');
  }

  if (fs.exists('src/app/entities') && fs.exists('src/app/controllers')) {
    fs.cd('src/app');
  } else if (!fs.exists('entities') || !fs.exists('controllers')) {
    throw new ClientError(
      'Impossible to generate a REST API endpoint. '
      + 'The directories controllers/ and entities/ (or src/app/controllers and src/app/entities) were not found.'
    );
  }

  const locals = {
    ...getNames(basename(name)),
    entitiesPath: `${name.split('/').map(() => '../').join('')}entities`,
    createDataSourcePath: `${name.split('/').map(() => '../').join('')}../db`,
  };
  const subdir = dirname(name);
  const parentControllerPath = `${subdir === '.' ? 'app' : basename(subdir)}.controller.ts`;

  const entityFileName = `${locals.kebabName}.entity.ts`;

  fs
    .cd('entities')
    .renderOnlyIf(!auth, 'rest-api/entities/entity.ts', entityFileName, locals)
    .renderOnlyIf(auth, 'rest-api/entities/entity.auth.ts', entityFileName, locals)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', locals.upperFirstCamelName, `./${locals.kebabName}.entity`)
    .cd('..');

  const controllerClassName = `${locals.upperFirstCamelName}Controller`;

  const controllerFileName = `${locals.kebabName}.controller.ts`;
  const controllerSpecFileName = `${locals.kebabName}.controller.spec.ts`;

  fs
    .cd('controllers')
    .ensureDir(subdir)
    .cd(subdir)
    .renderOnlyIf(!auth, 'rest-api/controllers/controller.ts', controllerFileName, locals)
    .renderOnlyIf(auth, 'rest-api/controllers/controller.auth.ts', controllerFileName, locals)
    .renderOnlyIf(!auth, 'rest-api/controllers/controller.spec.ts', controllerSpecFileName, locals)
    .renderOnlyIf(auth, 'rest-api/controllers/controller.spec.auth.ts', controllerSpecFileName, locals)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', controllerClassName, `./${locals.kebabName}.controller`)
    .cd('..');

  if (register) {
    fs
      .addOrExtendNamedImportIn(
        parentControllerPath,
        'controller',
        '@foal/core',
        { logs: false }
      )
      .addOrExtendNamedImportIn(
        parentControllerPath,
        controllerClassName,
        `./${subdir === '.' ? 'controllers' : basename(subdir)}`,
        { logs: false }
      )
      .addOrExtendClassArrayPropertyIn(
        parentControllerPath,
        'subControllers',
        `controller('/${locals.kebabName}s', ${controllerClassName})`
      );
    }

  if (process.env.P1Z7kEbSUUPMxF8GqPwD8Gx_FOAL_CLI_TEST !== 'true') {
    console.log(
      `\n${underline('Next steps:')} Complete ${locals.upperFirstCamelName} (${locals.kebabName}.entity)`
      + ` and ${locals.camelName}Schema (${locals.kebabName}.controller).`
    );
  }
}
