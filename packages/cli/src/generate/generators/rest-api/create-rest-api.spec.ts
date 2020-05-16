// FoalTS
import { FileSystem } from '../../file-system';
import { createRestApi } from './create-rest-api';

describe('createRestApi', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  function test(root: string) {

    describe(`when the directories ${root}entities/ and ${root}controllers/ exist`, () => {

      beforeEach(() => {
        fs
          .ensureDir(root)
          .cd(root)
          .ensureDir('entities')
          .cd('entities')
          .copyMock('rest-api/index.entities.ts', 'index.ts')
          .cd('..')
          .ensureDir('controllers')
          .cd('controllers')
          .copyMock('rest-api/index.controllers.ts', 'index.ts')
          .cd('..');
      });

      it('should render the templates in the proper directory.', () => {
        createRestApi({ name: 'test-fooBar', register: false });

        fs
          .cd('entities')
          .assertEqual('test-foo-bar.entity.ts', 'rest-api/test-foo-bar.entity.ts')
          .assertEqual('index.ts', 'rest-api/index.entities.ts')
          .cd('..')
          .cd('controllers')
          .assertEqual('test-foo-bar.controller.ts', 'rest-api/test-foo-bar.controller.ts')
          .assertEqual('test-foo-bar.controller.spec.ts', 'rest-api/test-foo-bar.controller.spec.ts')
          .assertEqual('index.ts', 'rest-api/index.controllers.ts');
      });

    });

    describe(`when the directories ${root}entities/ and ${root}controllers/ exist and "register" is true.`, () => {

      beforeEach(() => {
        fs
          .ensureDir(root)
          .cd(root)
          .ensureDir('entities')
          .cd('entities')
          .copyMock('rest-api/index.entities.ts', 'index.ts')
          .cd('..')
          .ensureDir('controllers')
          .cd('controllers')
          .copyMock('rest-api/index.controllers.ts', 'index.ts')
          .cd('..');
      });

      it('should update the "subControllers" import in src/app/app.controller.ts if it exists.', () => {
        fs
          .copyMock('rest-api/app.controller.controller-import.ts', 'app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        fs
          .assertEqual('app.controller.ts', 'rest-api/app.controller.controller-import.ts');
      });

      it('should add a "subControllers" import in src/app/app.controller.ts if none already exists.', () => {
        fs
          .copyMock('rest-api/app.controller.no-controller-import.ts', 'app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        fs
          .assertEqual('app.controller.ts', 'rest-api/app.controller.no-controller-import.ts');
      });

      it('should update the "@foal/core" import in src/app/app.controller.ts if it exists.', () => {
        fs
          .copyMock('rest-api/app.controller.core-import.ts', 'app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        fs
          .assertEqual('app.controller.ts', 'rest-api/app.controller.core-import.ts');
      });

      it('should update the "subControllers = []" property in src/app/app.controller.ts if it exists.', () => {
        fs
          .copyMock('rest-api/app.controller.empty-property.ts', 'app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        fs
          .assertEqual('app.controller.ts', 'rest-api/app.controller.empty-property.ts');
      });

      it('should update the "subControllers = [ \\n \\n ]" property in src/app/app.controller.ts if it exists.', () => {
        fs
          .copyMock('rest-api/app.controller.empty-spaced-property.ts', 'app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        fs
          .assertEqual('app.controller.ts', 'rest-api/app.controller.empty-spaced-property.ts');
      });

      it('should update the "subControllers = [ \\n (.*) \\n ]" property in'
          + ' src/app/app.controller.ts if it exists.', () => {
        fs
          .copyMock('rest-api/app.controller.no-empty-property.ts', 'app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        fs
          .assertEqual('app.controller.ts', 'rest-api/app.controller.no-empty-property.ts');
      });

    });

  }

  test('src/app/');
  test('');

  describe('when the directory entities/ or the directory controllers/ does not exist.', () => {

    beforeEach(() => {
      fs
        .copyMock('rest-api/index.current-dir.ts', 'index.ts');
    });

    it('should render the templates in the current directory.', () => {
      createRestApi({ name: 'test-fooBar', register: false });

      fs
        .assertEqual('test-foo-bar.entity.ts', 'rest-api/test-foo-bar.entity.ts')
        .assertEqual('test-foo-bar.controller.ts', 'rest-api/test-foo-bar.controller.current-dir.ts')
        .assertEqual('test-foo-bar.controller.spec.ts', 'rest-api/test-foo-bar.controller.spec.current-dir.ts')
        .assertEqual('index.ts', 'rest-api/index.current-dir.ts');
    });

  });

});
