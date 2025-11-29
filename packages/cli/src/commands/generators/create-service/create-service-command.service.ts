// FoalTS
import { basename, dirname } from 'path';
import { Generator } from '../../../services';
import { getNames } from '../utils';

/**
 * Service for creating a new service file.
 */
export class CreateServiceCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Create a new service file.
   *
   * @param {string} name - The name of the service
   * @returns {void}
   */
  run({ name }: { name: string }): void {
    let root = '';
    if (this.generator.exists('src/app/services')) {
      root = 'src/app/services';
    } else if (this.generator.exists('services')) {
      root = 'services';
    }

    const names = getNames(basename(name));
    const subdir = dirname(name);

    this.generator
      .cd(root)
      .ensureDir(subdir)
      .cd(subdir)
      .render('service/service.empty.ts', `${names.kebabName}.service.ts`, names)
      .ensureFile('index.ts')
      .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.service`);
  }
}

