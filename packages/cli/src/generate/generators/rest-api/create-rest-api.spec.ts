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

    rmfileIfExists('src/app/app.controller.ts');
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

    rmfileIfExists('app.controller.ts');

    rmfileIfExists('test-foo-bar.entity.ts');
    rmfileIfExists('test-foo-bar.controller.ts');
    rmfileIfExists('test-foo-bar.controller.spec.ts');
  });

  function test(root: string) {

    describe(`when the directories ${root}entities/ and ${root}controllers/ exist`, () => {

      const testEntityEnv = new TestEnvironment('rest-api', root + 'entities');
      const testControllerEnv = new TestEnvironment('rest-api', root + 'controllers');

      beforeEach(() => {
        testEntityEnv.mkRootDirIfDoesNotExist();
        testEntityEnv.copyFileFromMocks('index.entities.ts', 'index.ts');
        testControllerEnv.mkRootDirIfDoesNotExist();
        testControllerEnv.copyFileFromMocks('index.controllers.ts', 'index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        createRestApi({ name: 'test-fooBar', register: false });

        testEntityEnv
          .validateSpec('test-foo-bar.entity.ts')
          .validateSpec('index.entities.ts', 'index.ts');

        testControllerEnv
          .validateSpec('test-foo-bar.controller.ts')
          .validateSpec('test-foo-bar.controller.spec.ts')
          .validateSpec('index.controllers.ts', 'index.ts');
      });

    });

    describe(`when the directories ${root}entities/ and ${root}controllers/ exist and "register" is true.`, () => {

      const testEntityEnv = new TestEnvironment('rest-api', root + 'entities');
      const testControllerEnv = new TestEnvironment('rest-api', root + 'controllers');

      beforeEach(() => {
        testEntityEnv.mkRootDirIfDoesNotExist();
        testEntityEnv.copyFileFromMocks('index.entities.ts', 'index.ts');
        testControllerEnv.mkRootDirIfDoesNotExist();
        testControllerEnv.copyFileFromMocks('index.controllers.ts', 'index.ts');
      });

      it('should update the "subControllers" import in src/app/app.controller.ts if it exists.', () => {
        testControllerEnv.copyFileFromMocks('app.controller.controller-import.ts', '../app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        testControllerEnv
          .validateSpec('app.controller.controller-import.ts', '../app.controller.ts');
      });

      it('should add a "subControllers" import in src/app/app.controller.ts if none already exists.', () => {
        testControllerEnv.copyFileFromMocks('app.controller.no-controller-import.ts', '../app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        testControllerEnv
          .validateSpec('app.controller.no-controller-import.ts', '../app.controller.ts');
      });

      it('should update the "@foal/core" import in src/app/app.controller.ts if it exists.', () => {
        testControllerEnv.copyFileFromMocks('app.controller.core-import.ts', '../app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        testControllerEnv
          .validateSpec('app.controller.core-import.ts', '../app.controller.ts');
      });

      it('should update the "subControllers = []" property in src/app/app.controller.ts if it exists.', () => {
        testControllerEnv.copyFileFromMocks('app.controller.empty-property.ts', '../app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        testControllerEnv
          .validateSpec('app.controller.empty-property.ts', '../app.controller.ts');
      });

      it('should update the "subControllers = [ \\n \\n ]" property in src/app/app.controller.ts if it exists.', () => {
        testControllerEnv.copyFileFromMocks('app.controller.empty-spaced-property.ts', '../app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        testControllerEnv
          .validateSpec('app.controller.empty-spaced-property.ts', '../app.controller.ts');
      });

      it('should update the "subControllers = [ \\n (.*) \\n ]" property in'
          + ' src/app/app.controller.ts if it exists.', () => {
        testControllerEnv.copyFileFromMocks('app.controller.no-empty-property.ts', '../app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        testControllerEnv
          .validateSpec('app.controller.no-empty-property.ts', '../app.controller.ts');
      });

    });

  }

  test('src/app/');
  test('');

  describe('when the directory entities/ or the directory controllers/ does not exist.', () => {

    const testEnv = new TestEnvironment('rest-api', '');

    beforeEach(() => {
      testEnv.mkRootDirIfDoesNotExist();
      testEnv.copyFileFromMocks('index.current-dir.ts', 'index.ts');
    });

    it('should render the templates in the current directory.', () => {
      createRestApi({ name: 'test-fooBar', register: false });

      testEnv
        .validateSpec('test-foo-bar.entity.ts')
        .validateSpec('test-foo-bar.controller.current-dir.ts', 'test-foo-bar.controller.ts')
        .validateSpec('test-foo-bar.controller.spec.current-dir.ts', 'test-foo-bar.controller.spec.ts')
        .validateSpec('index.current-dir.ts', 'index.ts');
    });

  });

});
