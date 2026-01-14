// FoalTS
import { basename, dirname } from 'path';
import { Generator } from '../../../services';
import { getNames } from '../utils';

/**
 * Service for creating a new entity file.
 */
export class CreateEntityCommandService {
  constructor(
    private generator: Generator,
  ) {}

  /**
   * Create a new entity file.
   *
   * @param {string} name - The name of the entity
   * @returns {void}
   */
  run({ name }: { name: string }): void {
    let root = '';
    if (this.generator.exists('src/app/entities')) {
      root = 'src/app/entities';
    } else if (this.generator.exists('entities')) {
      root = 'entities';
    }

    const names = getNames(basename(name));
    const subdir = dirname(name);

    const isMongoDBProject = this.generator.projectHasDependency('mongodb');

    this.generator
      .cd(root)
      .ensureDir(subdir)
      .cd(subdir)
      .renderOnlyIf(!isMongoDBProject, 'entity/entity.ts', `${names.kebabName}.entity.ts`, names)
      .renderOnlyIf(isMongoDBProject, 'entity/entity.mongodb.ts', `${names.kebabName}.entity.ts`, names)
      .ensureFile('index.ts')
      .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.entity`);
  }
}

