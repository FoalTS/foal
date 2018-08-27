// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment
} from '../../utils';
import { createController } from './create-controller';

describe('createController', () => {

  afterEach(() => {
    rmfileIfExists('src/app/controllers/test-foo-bar.controller.ts');
    rmfileIfExists('src/app/controllers/test-foo-bar.controller.spec.ts');
    rmfileIfExists('src/app/controllers/index.ts');
    rmdirIfExists('src/app/controllers');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('controllers/test-foo-bar.controller.ts');
    rmfileIfExists('controllers/test-foo-bar.controller.spec.ts');
    rmfileIfExists('controllers/index.ts');
    rmdirIfExists('controllers');

    rmfileIfExists('test-foo-bar.controller.ts');
    rmfileIfExists('test-foo-bar.controller.spec.ts');
    rmfileIfExists('index.ts');
  });

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      const testEnv = new TestEnvironment('controller', root);

      beforeEach(() => {
        testEnv.mkRootDirIfDoesNotExist();
        testEnv.copyFileFromMocks('index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', type: 'Empty' });

        testEnv
          .validateSpec('test-foo-bar.controller.empty.ts', 'test-foo-bar.controller.ts')
          .validateSpec('test-foo-bar.controller.spec.empty.ts', 'test-foo-bar.controller.spec.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the REST templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', type: 'REST' });

        testEnv
          .validateSpec('test-foo-bar.controller.rest.ts', 'test-foo-bar.controller.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the GraphQL templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', type: 'GraphQL' });

        testEnv
          .validateSpec('test-foo-bar.controller.graphql.ts', 'test-foo-bar.controller.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the Login templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', type: 'Login' });

        testEnv
          .validateSpec('test-foo-bar.controller.login.ts', 'test-foo-bar.controller.ts')
          .validateSpec('index.ts', 'index.ts');
      });

    });

  }

  test('src/app/controllers');
  test('controllers');
  test('');

});
