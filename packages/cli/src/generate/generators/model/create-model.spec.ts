// FoalTS
import {
  rmDirAndFilesIfExist,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createModel } from './create-model';

describe('createModel', () => {

  afterEach(() => {
    rmDirAndFilesIfExist('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    rmDirAndFilesIfExist('models');
    rmfileIfExists('a-test-foo-bar.model.ts');
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

      it('should not throw an error if index.ts does not exist.', () => {
        testEnv.rmfileIfExists('index.ts');
        createModel({ name: 'test-fooBar' });
      });

      it('should should order the export in index.ts.', () => {
        createModel({ name: 'a-test-fooBar' });

        testEnv
          .validateSpec('index.sorted.ts', 'index.ts');
      });

    });

  }

  test('src/app/models');
  test('models');
  test('');

});
