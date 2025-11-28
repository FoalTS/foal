// std
import { basename, dirname } from 'path';

// 3p
import { underline } from 'colors/safe';

// FoalTS
import { ClientError, FileSystem } from '../../../services';
import { getNames } from '../../../generate/utils';

/**
 * Service for creating a new REST API endpoint (entity and controller).
 */
export class CreateRestApiCommandService {
  constructor(
    private fileSystem: FileSystem,
  ) {}

  /**
   * Create a new REST API endpoint (entity and controller).
   *
   * @param {string} name - The name of the REST API endpoint
   * @param {boolean} register - Whether to register the controller in app.controller.ts
   * @param {boolean} auth - Whether to include authentication/authorization
   * @returns {void}
   */
  run({ name, register, auth }: { name: string, register: boolean, auth?: boolean }): void {
    auth = auth || false;

    if (this.fileSystem.projectHasDependency('mongodb')) {
      throw new ClientError('"npx foal generate|g rest-api <name>" cannot be used in a MongoDB project.');
    }

    if (this.fileSystem.exists('src/app/entities') && this.fileSystem.exists('src/app/controllers')) {
      this.fileSystem.cd('src/app');
    } else if (!this.fileSystem.exists('entities') || !this.fileSystem.exists('controllers')) {
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

    this.fileSystem
      .cd('entities')
      .renderOnlyIf(!auth, 'rest-api/entities/entity.ts', entityFileName, locals)
      .renderOnlyIf(auth, 'rest-api/entities/entity.auth.ts', entityFileName, locals)
      .ensureFile('index.ts')
      .addNamedExportIn('index.ts', locals.upperFirstCamelName, `./${locals.kebabName}.entity`)
      .cd('..');

    const controllerClassName = `${locals.upperFirstCamelName}Controller`;

    const controllerFileName = `${locals.kebabName}.controller.ts`;
    const controllerSpecFileName = `${locals.kebabName}.controller.spec.ts`;

    this.fileSystem
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
      this.fileSystem
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
}

