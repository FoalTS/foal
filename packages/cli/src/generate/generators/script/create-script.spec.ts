// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createScript } from './create-script';

// TODO: Improve the tests. They currently cover partially `createScript`.

describe('createScript', () => {

  afterEach(() => {
    rmfileIfExists('src/scripts/test-foo-bar.ts');
    rmdirIfExists('src/scripts');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');
  });

  describe(`when the directory src/scripts/ exists`, () => {

    const testEnv = new TestEnvironment('script', 'src/scripts');

    beforeEach(() => {
      testEnv.mkRootDirIfDoesNotExist();
    });

    it('should copy the empty script file in the proper directory.', () => {
      createScript({ name: 'test-fooBar' });

      testEnv
        .validateSpec('test-foo-bar.ts');
    });

  });

  describe(`when the directory src/scripts/ does not exist`, () => {

    it('should not throw an error.', () => {
      createScript({ name: 'test-fooBar' });
    });

  });

});
