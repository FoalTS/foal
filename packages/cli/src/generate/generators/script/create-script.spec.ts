// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createScript } from './create-script';

describe('createScript', () => {

  afterEach(() => {
    rmfileIfExists('src/scripts/test-foo-bar.ts');
    rmdirIfExists('src/scripts');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('test-foo-bar.ts');
  });

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      const testEnv = new TestEnvironment('script', root);

      beforeEach(() => {
        testEnv.mkRootDirIfDoesNotExist();
      });

      it('should copy the empty script file in the proper directory.', () => {
        createScript({ name: 'test-fooBar' });

        testEnv
          .validateSpec('test-foo-bar.ts');
      });

    });

  }

  test('src/scripts');
  test('');

});
