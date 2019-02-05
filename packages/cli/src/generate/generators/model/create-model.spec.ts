// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createModel } from './create-model';

describe('createModel', () => {

  afterEach(() => {
    rmfileIfExists('src/app/models/test-foo-bar.model.ts');
    rmfileIfExists('src/app/models/index.ts');
    rmdirIfExists('src/app/models');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('models/test-foo-bar.model.ts');
    rmfileIfExists('models/index.ts');
    rmdirIfExists('models');

    rmfileIfExists('test-foo-bar.model.ts');
    rmfileIfExists('index.ts');
  });

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      const testEnv = new TestEnvironment('model', root);

      beforeEach(() => {
        testEnv.mkRootDirIfDoesNotExist();
        testEnv.copyFileFromMocks('index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        createModel({ name: 'test-fooBar' });

        testEnv
          .validateSpec('test-foo-bar.model.ts')
          .validateSpec('index.ts', 'index.ts');
      });

    });

  }

  test('src/app/models');
  test('models');
  test('');

});
