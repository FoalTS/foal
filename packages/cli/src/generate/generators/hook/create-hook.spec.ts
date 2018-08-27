// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createHook } from './create-hook';

describe('createHook', () => {

  afterEach(() => {
    rmfileIfExists('src/app/hooks/test-foo-bar.hook.ts');
    rmfileIfExists('src/app/hooks/index.ts');
    rmdirIfExists('src/app/hooks');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('hooks/test-foo-bar.hook.ts');
    rmfileIfExists('hooks/index.ts');
    rmdirIfExists('hooks');

    rmfileIfExists('test-foo-bar.hook.ts');
    rmfileIfExists('index.ts');
  });

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      const testEnv = new TestEnvironment('hook', root);

      beforeEach(() => {
        testEnv.mkRootDirIfDoesNotExist();
        testEnv.copyFileFromMocks('index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        createHook({ name: 'test-fooBar' });

        testEnv
          .validateSpec('test-foo-bar.hook.ts')
          .validateSpec('index.ts', 'index.ts');
      });

    });

  }

  test('src/app/hooks');
  test('hooks');
  test('');

});
