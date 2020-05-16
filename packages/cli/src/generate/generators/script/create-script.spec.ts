// FoalTS
import { FileSystem } from '../../file-system';
import {
  rmDirAndFilesIfExist,
} from '../../utils';
import { createScript } from './create-script';

// TODO: Improve the tests. They currently cover partially `createScript`.

describe('createScript', () => {

  const fs = new FileSystem();
  // TODO: remove this line.
  (fs as any).testDir = '';

  afterEach(() => {
    rmDirAndFilesIfExist('src/scripts');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
  });

  describe(`when the directory src/scripts/ exists`, () => {

    beforeEach(() => {
      fs
        .ensureDir('src/scripts')
        .cd('src/scripts');
    });

    it('should copy the empty script file in the proper directory.', () => {
      createScript({ name: 'test-fooBar' });

      fs
        .assertEqual('test-foo-bar.ts', 'script/test-foo-bar.ts');
    });

  });

  describe(`when the directory src/scripts/ does not exist`, () => {

    it('should not throw an error.', () => {
      createScript({ name: 'test-fooBar' });
    });

  });

});
