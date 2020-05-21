// std
import { existsSync } from 'fs';
import { join, relative } from 'path';

// 3p
// FoalTS
import { FileSystem } from '../../file-system';
import { getNames } from '../../utils';

export function createScript({ name }: { name: string }) {
  const names = getNames(name);

  const fs = new FileSystem();
  const isMongoose = fs.projectHasDependency('mongoose');

  fs
    // TODO: test this line
    .cdProjectRootDir()
    .cd('src/scripts')
    .copyOnlyIf(!isMongoose, 'script/script.ts', `${names.kebabName}.ts`)
    .copyOnlyIf(isMongoose, 'script/script.mongoose.ts', `${names.kebabName}.ts`)
}
