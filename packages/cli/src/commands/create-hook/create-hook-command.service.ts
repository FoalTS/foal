// FoalTS
import { basename, dirname } from 'path';
import { FileSystem } from '../../services';
import { getNames } from '../../generate/utils';

/**
 * Service for creating a new hook file.
 */
export class CreateHookCommandService {
  constructor(
    private fileSystem: FileSystem,
  ) {}

  /**
   * Create a new hook file.
   *
   * @param {string} name - The name of the hook
   * @returns {void}
   */
  run({ name }: { name: string }): void {
    let root = '';
    if (this.fileSystem.exists('src/app/hooks')) {
      root = 'src/app/hooks';
    } else if (this.fileSystem.exists('hooks')) {
      root = 'hooks';
    }

    const names = getNames(basename(name));
    const subdir = dirname(name);

    this.fileSystem
      .cd(root)
      .ensureDir(subdir)
      .cd(subdir)
      .render('hook/hook.ts', `${names.kebabName}.hook.ts`, names)
      .ensureFile('index.ts')
      .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.hook`);
  }
}

