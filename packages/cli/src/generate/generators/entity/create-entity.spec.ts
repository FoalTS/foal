// FoalTS
import {
  rmDirAndFilesIfExist,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createEntity } from './create-entity';

describe('createEntity', () => {

  afterEach(() => {
    rmDirAndFilesIfExist('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    rmDirAndFilesIfExist('entities');
    rmfileIfExists('test-foo-bar.entity.ts');
    rmfileIfExists('index.ts');
  });

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      const testEnv = new TestEnvironment('entity', root);

      beforeEach(() => {
        testEnv.mkRootDirIfDoesNotExist();
        testEnv.copyFileFromMocks('index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        createEntity({ name: 'test-fooBar' });

        testEnv
          .validateSpec('test-foo-bar.entity.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should not throw an error if index.ts does not exist.', () => {
        testEnv.rmfileIfExists('index.ts');
        createEntity({ name: 'test-fooBar' });
      });

    });

  }

  test('src/app/entities');
  test('entities');
  test('');

});
