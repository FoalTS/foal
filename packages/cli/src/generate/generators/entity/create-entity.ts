// FoalTS
import { basename, dirname } from 'path';
import { FileSystem } from '../../../services';
import { getNames } from '../../utils';

export function createEntity({ name }: { name: string }) {
  const fs = new FileSystem();

  let root = '';
  if (fs.exists('src/app/entities')) {
    root = 'src/app/entities';
  } else if (fs.exists('entities')) {
    root = 'entities';
  }

  const names = getNames(basename(name));
  const subdir = dirname(name);

  const isMongoDBProject = fs.projectHasDependency('mongodb');

  fs
    .cd(root)
    .ensureDir(subdir)
    .cd(subdir)
    .renderOnlyIf(!isMongoDBProject, 'entity/entity.ts', `${names.kebabName}.entity.ts`, names)
    .renderOnlyIf(isMongoDBProject, 'entity/entity.mongodb.ts', `${names.kebabName}.entity.ts`, names)
    .ensureFile('index.ts')
    .addNamedExportIn('index.ts', names.upperFirstCamelName, `./${names.kebabName}.entity`);
}
