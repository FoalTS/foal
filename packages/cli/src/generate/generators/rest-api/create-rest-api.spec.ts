// FoalTS
import { FileSystem } from '../../file-system';
import { createRestApi } from './create-rest-api';

// TODO: add tests like "should create index.ts if it does not exist."

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
          .copyFixture('rest-api/index.entities.ts', 'index.ts')
          .cd('..')
          .ensureDir('controllers')
          .cd('controllers')
          .copyFixture('rest-api/index.controllers.ts', 'index.ts')
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

      it('should create the index.ts if they do not exist.', () => {
        fs.rmfile('entities/index.ts');
        fs.rmfile('controllers/index.ts');

        createRestApi({ name: 'test-fooBar', register: false });

        fs.assertExists('entities/index.ts');
        fs.assertExists('controllers/index.ts');
      });

    });

    describe(`when the directories ${root}entities/ and ${root}controllers/ exist and "register" is true.`, () => {

      beforeEach(() => {
        fs
          .ensureDir(root)
          .cd(root)
          .ensureDir('entities')
          .cd('entities')
          .copyFixture('rest-api/index.entities.ts', 'index.ts')
          .cd('..')
          .ensureDir('controllers')
          .cd('controllers')
          .copyFixture('rest-api/index.controllers.ts', 'index.ts')
          .cd('..');
      });

      it('should register the controller in app.controller.ts.', () => {
        fs
          .copyFixture('rest-api/app.controller.ts', 'app.controller.ts');

        createRestApi({ name: 'test-fooBar', register: true });

        fs
          .assertEqual('app.controller.ts', 'rest-api/app.controller.ts');
      });

    });

  }

  test('src/app/');
  test('');

  describe('when the directory entities/ or the directory controllers/ does not exist.', () => {

    beforeEach(() => {
      fs
        .copyFixture('rest-api/index.current-dir.ts', 'index.ts');
    });

    it('should render the templates in the current directory.', () => {
      createRestApi({ name: 'test-fooBar', register: false });

      fs
        .assertEqual('test-foo-bar.entity.ts', 'rest-api/test-foo-bar.entity.ts')
        .assertEqual('test-foo-bar.controller.ts', 'rest-api/test-foo-bar.controller.current-dir.ts')
        .assertEqual('test-foo-bar.controller.spec.ts', 'rest-api/test-foo-bar.controller.spec.current-dir.ts')
        .assertEqual('index.ts', 'rest-api/index.current-dir.ts');
    });

    it('should create index.ts if it does not exist.', () => {
      fs.rmfile('index.ts');

      createRestApi({ name: 'test-fooBar', register: false });

      fs.assertExists('index.ts');
    });

  });

});
