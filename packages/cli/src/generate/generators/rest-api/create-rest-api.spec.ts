// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createRestApi } from './create-rest-api';

describe('createRestApi', () => {

  afterEach(() => {
    rmfileIfExists('src/app/entities/test-foo-bar.entity.ts');
    rmfileIfExists('src/app/entities/index.ts');
    rmdirIfExists('src/app/entities');

    rmfileIfExists('src/app/controllers/test-foo-bar.controller.ts');
    rmfileIfExists('src/app/controllers/test-foo-bar.controller.spec.ts');
    rmfileIfExists('src/app/controllers/index.ts');
    rmdirIfExists('src/app/controllers');

    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('entities/test-foo-bar.entity.ts');
    rmfileIfExists('entities/index.ts');
    rmdirIfExists('entities');

    rmfileIfExists('controllers/test-foo-bar.controller.ts');
    rmfileIfExists('controllers/test-foo-bar.controller.spec.ts');
    rmfileIfExists('controllers/index.ts');
    rmdirIfExists('controllers');
  });

  function test(root: string) {

    describe(`when the directories ${root}entities/ and ${root}controllers exist`, () => {

      const testEntityEnv = new TestEnvironment('rest-api', root + 'entities');
      const testControllerEnv = new TestEnvironment('rest-api', root + 'controllers');

      beforeEach(() => {
        testEntityEnv.mkRootDirIfDoesNotExist();
        testEntityEnv.copyFileFromMocks('index.entities.ts', 'index.ts');
        testControllerEnv.mkRootDirIfDoesNotExist();
        testControllerEnv.copyFileFromMocks('index.controllers.ts', 'index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        createRestApi({ name: 'test-fooBar' });

        testEntityEnv
          .validateSpec('test-foo-bar.entity.ts')
          .validateSpec('index.entities.ts', 'index.ts');

        testControllerEnv
          .validateSpec('test-foo-bar.controller.ts')
          .validateSpec('test-foo-bar.controller.spec.ts')
          .validateSpec('index.controllers.ts', 'index.ts');
      });

    });

  }

  // test('src/app/');
  test('');

});
