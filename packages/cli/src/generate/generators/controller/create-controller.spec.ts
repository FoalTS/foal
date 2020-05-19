// FoalTS
import { FileSystem } from '../../file-system';
import { createController } from './create-controller';

describe('createController', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      beforeEach(() => {
        fs
          .ensureDir(root)
          .cd(root)
          .copyFixture('controller/index.ts', 'index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', register: false });

        fs
          .assertEqual('test-foo-bar.controller.ts', 'controller/test-foo-bar.controller.empty.ts')
          .assertEqual('test-foo-bar.controller.spec.ts', 'controller/test-foo-bar.controller.spec.empty.ts')
          .assertEqual('index.ts', 'controller/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        createController({ name: 'barfoo/hello/test-fooBar', register: false });

        fs
          .assertExists('barfoo/hello/test-foo-bar.controller.ts');
      });

      it('should create index.ts if it does not exist.', () => {
        fs.rmfile('index.ts');

        createController({ name: 'test-fooBar', register: false });

        fs.assertExists('index.ts');
      });

    });

  }

  test('src/app/controllers');
  test('controllers');
  test('');

  describe('when the directory src/app/controllers exists and if register is true', () => {

    beforeEach(() => {
      fs
        .ensureDir('src/app/controllers')
        .cd('src/app/controllers')
        .copyFixture('controller/index.ts', 'index.ts')
        .cd('..');
    });

    it('should register the controller in app.controller.ts.', () => {
      fs
        .copyFixture('controller/app.controller.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.ts');
    });

    it('should register the controller in a parent controller (subdir).', () => {
      fs
        .ensureDir('controllers/hello')
        .copyFixture('controller/api.controller.ts', 'controllers/hello/api.controller.ts');

      createController({ name: 'hello/api/test-fooBar', register: true });

      fs
        .assertEqual('controllers/hello/api.controller.ts', 'controller/api.controller.ts');
    });

  });

});
