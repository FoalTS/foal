// std
import { basename, dirname } from 'path';

// FoalTS
import { Generator } from '../../../services';
import { getNames } from '../utils';

/**
 * Service for creating a new controller file.
 */
export class CreateControllerCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Create a new controller file.
   *
   * @param {string} name - The name of the controller
   * @param {boolean} register - Whether to register the controller in app.controller.ts
   * @returns {void}
   */
  run({ name, register }: { name: string, register: boolean }): void {
    let root = '';
    if (this.generator.exists('src/app/controllers')) {
      root = 'src/app/controllers';
    } else if (this.generator.exists('controllers')) {
      root = 'controllers';
    }

    const names = getNames(basename(name));
    const subdir = dirname(name);
    const parentControllerPath = `${subdir === '.' ? 'app' : basename(subdir)}.controller.ts`;

    const fileName = `${names.kebabName}.controller.ts`;
    const specFileName = `${names.kebabName}.controller.spec.ts`;

    const className = `${names.upperFirstCamelName}Controller`;

    this.generator
      .cd(root)
      .ensureDir(subdir)
      .cd(subdir)
      .render('controller/controller.empty.ts', fileName, names)
      .render('controller/controller.spec.empty.ts', specFileName, names)
      .ensureFile('index.ts')
      .addNamedExportIn('index.ts', className, `./${names.kebabName}.controller`);

    if (register) {
      this.generator
        .cd('..')
        .addOrExtendNamedImportIn(
          parentControllerPath,
          'controller',
          '@foal/core',
          { logs: false }
        )
        .addOrExtendNamedImportIn(
          parentControllerPath,
          className,
          `./${subdir === '.' ? 'controllers' : basename(subdir)}`,
          { logs: false }
        )
        .addOrExtendClassArrayPropertyIn(
          parentControllerPath,
          'subControllers',
          `controller('/${names.kebabName}', ${className})`
        );
    }
  }
}

