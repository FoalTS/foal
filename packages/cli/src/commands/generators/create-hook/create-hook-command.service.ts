// FoalTS
import { basename, dirname } from 'path';
import { Generator } from '../../../services';
import { getNames } from '../utils';

/**
 * Service for creating a new hook file.
 */
export class CreateHookCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Create a new hook file.
   *
   * @param {string} name - The name of the hook
   * @returns {void}
   */
  run({ name }: { name: string }): void {
    let root = '';
    if (this.generator.exists('src/app/hooks')) {
      root = 'src/app/hooks';
    } else if (this.generator.exists('hooks')) {
      root = 'hooks';
    }

    const names = getNames(basename(name));
    const subdir = dirname(name);

    this.generator
      .cd(root)
      .ensureDir(subdir)
      .cd(subdir)
      .render('hook/hook.ts', `${names.kebabName}.hook.ts`, names)
      .ensureFile('index.ts')
      .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.hook`);
  }
}

