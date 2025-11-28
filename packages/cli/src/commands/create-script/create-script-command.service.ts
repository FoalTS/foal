// FoalTS
import { FileSystem } from '../../services';
import { getNames } from '../../generate/utils';

/**
 * Service for creating a new script file.
 */
export class CreateScriptCommandService {
  constructor(
    private fileSystem: FileSystem,
  ) {}

  /**
   * Create a new script file.
   *
   * @param {string} name - The name of the script
   * @returns {void}
   */
  run({ name }: { name: string }): void {
    const names = getNames(name);

    this.fileSystem
      // TODO: test this line
      .cdProjectRootDir()
      .cd('src/scripts')
      .copy('script/script.ts', `${names.kebabName}.ts`);
  }
}

