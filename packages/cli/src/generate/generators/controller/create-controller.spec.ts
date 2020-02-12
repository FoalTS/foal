// FoalTS
import {
  rmDirAndFilesIfExist,
  rmfileIfExists,
  TestEnvironment
} from '../../utils';
import { createController } from './create-controller';

describe('createController', () => {

  afterEach(() => {
    rmDirAndFilesIfExist('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    rmDirAndFilesIfExist('controllers');
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
        createController({ name: 'test-fooBar', type: 'Empty', register: false });

        testEnv
          .validateSpec('test-foo-bar.controller.empty.ts', 'test-foo-bar.controller.ts')
          .validateSpec('test-foo-bar.controller.spec.empty.ts', 'test-foo-bar.controller.spec.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the REST templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', type: 'REST', register: false });

        testEnv
          .validateSpec('test-foo-bar.controller.rest.ts', 'test-foo-bar.controller.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the GraphQL templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', type: 'GraphQL', register: false });

        testEnv
          .validateSpec('test-foo-bar.controller.graphql.ts', 'test-foo-bar.controller.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the Login templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', type: 'Login', register: false });

        testEnv
          .validateSpec('test-foo-bar.controller.login.ts', 'test-foo-bar.controller.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should not throw an error if index.ts does not exist.', () => {
        testEnv.rmfileIfExists('index.ts');
        createController({ name: 'test-fooBar', type: 'Empty', register: false });
      });

    });

  }

  test('src/app/controllers');
  test('controllers');
  test('');

  describe('when the directory src/app/controllers exists and if register is true', () => {

    const testEnv = new TestEnvironment('controller', 'src/app/controllers');

    beforeEach(() => {
      testEnv.mkRootDirIfDoesNotExist();
      testEnv.copyFileFromMocks('index.ts');
    });

    // TODO: refactor these tests and their mock and spec files.

    it('should add all the imports if none exists.', () => {
      testEnv.copyFileFromMocks('app.controller.no-import.ts', '../app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.controller.no-import.ts', '../app.controller.ts');
    });

    it('should update the "subControllers" import in src/app/app.controller.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.controller.controller-import.ts', '../app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.controller.controller-import.ts', '../app.controller.ts');
    });

    it('should add a "subControllers" import in src/app/app.controller.ts if none already exists.', () => {
      testEnv.copyFileFromMocks('app.controller.no-controller-import.ts', '../app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.controller.no-controller-import.ts', '../app.controller.ts');
    });

    it('should update the "@foal/core" import in src/app/app.controller.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.controller.core-import.ts', '../app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.controller.core-import.ts', '../app.controller.ts');
    });

    it('should update the "subControllers = []" property in src/app/app.controller.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.controller.empty-property.ts', '../app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.controller.empty-property.ts', '../app.controller.ts');
    });

    it('should update the "subControllers = [ \\n \\n ]" property in src/app/app.controller.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.controller.empty-spaced-property.ts', '../app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.controller.empty-spaced-property.ts', '../app.controller.ts');
    });

    it('should update the "subControllers = [ \\n (.*) \\n ]" property in'
        + ' src/app/app.controller.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.controller.no-empty-property.ts', '../app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.controller.no-empty-property.ts', '../app.controller.ts');
    });

    it('should update the "subControllers" property with a special URL if the controller is a REST controller.', () => {
      testEnv.copyFileFromMocks('app.controller.rest.ts', '../app.controller.ts');

      createController({ name: 'test-fooBar', type: 'REST', register: true });

      testEnv
        .validateSpec('app.controller.rest.ts', '../app.controller.ts');
    });

  });

});
