// FoalTS
import {
  rmDirAndFilesIfExist,
  rmfileIfExists,
  TestEnvironment
} from '../../utils';
import { createService } from './create-service';

describe('createService', () => {

  afterEach(() => {
    rmDirAndFilesIfExist('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    rmDirAndFilesIfExist('services');
    rmfileIfExists('test-foo-bar.service.ts');
    rmfileIfExists('test-foo-bar-collection.service.ts');
    rmfileIfExists('test-foo-bar-resolver.service.ts');
    rmfileIfExists('index.ts');
  });

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      const testEnv = new TestEnvironment('service', root);

      beforeEach(() => {
        testEnv.mkRootDirIfDoesNotExist();
        testEnv.copyFileFromMocks('index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        createService({ name: 'test-fooBar' });

        testEnv
          .validateSpec('test-foo-bar.service.empty.ts', 'test-foo-bar.service.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should not throw an error if index.ts does not exist.', () => {
        testEnv.rmfileIfExists('index.ts');
        createService({ name: 'test-fooBar' });
      });

    });

  }

  test('src/app/services');
  test('services');
  test('');

});
