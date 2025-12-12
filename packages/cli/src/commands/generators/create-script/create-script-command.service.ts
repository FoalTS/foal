// FoalTS
import { Generator } from '../../../services';
import { getNames } from '../utils';

/**
 * Service for creating a new script file.
 */
export class CreateScriptCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Create a new script file.
   *
   * @param {string} name - The name of the script
   * @returns {void}
   */
  run({ name }: { name: string }): void {
    const names = getNames(name);

    this.generator
      // TODO: test this line
      .cdProjectRootDir()
      .cd('src/scripts')
      .copyTemplate('script/script.ts', `${names.kebabName}.ts`);
  }
}

