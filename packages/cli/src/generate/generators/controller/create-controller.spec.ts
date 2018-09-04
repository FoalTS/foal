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
    rmfileIfExists('src/app/app.module.ts');
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

    it('should update the "controllers" import in src/app/app.module.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.module.controller-import.ts', '../app.module.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.module.controller-import.ts', '../app.module.ts');
    });

    it('should add a "controllers" import in src/app/app.module.ts if none already exists.', () => {
      testEnv.copyFileFromMocks('app.module.no-controller-import.ts', '../app.module.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.module.no-controller-import.ts', '../app.module.ts');
    });

    it('should update the "@foal/core" import in src/app/app.module.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.module.core-import.ts', '../app.module.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.module.core-import.ts', '../app.module.ts');
    });

    it('should update the "controllers = []" property in src/app/app.module.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.module.empty-property.ts', '../app.module.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.module.empty-property.ts', '../app.module.ts');
    });

    it('should update the "controllers = [ \\n \\n ]" property in src/app/app.module.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.module.empty-spaced-property.ts', '../app.module.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.module.empty-spaced-property.ts', '../app.module.ts');
    });

    it('should update the "controllers = [ \\n (.*) \\n ]" property in src/app/app.module.ts if it exists.', () => {
      testEnv.copyFileFromMocks('app.module.no-empty-property.ts', '../app.module.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      testEnv
        .validateSpec('app.module.no-empty-property.ts', '../app.module.ts');
    });

    it('should update the "controllers" property with a special URL if the controller is a REST controller.', () => {
      testEnv.copyFileFromMocks('app.module.rest.ts', '../app.module.ts');

      createController({ name: 'test-fooBar', type: 'REST', register: true });

      testEnv
        .validateSpec('app.module.rest.ts', '../app.module.ts');
    });

  });

});
