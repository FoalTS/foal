// FoalTS
import { FileSystem } from '../../../services';
import { getNames } from '../../utils';

export function createScript({ name }: { name: string }) {
  const names = getNames(name);

  const fs = new FileSystem();

  fs
    // TODO: test this line
    .cdProjectRootDir()
    .cd('src/scripts')
    .copy('script/script.ts', `${names.kebabName}.ts`);
}
