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
          .copyMock('controller/index.ts', 'index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', register: false });

        fs
          .assertEqual('test-foo-bar.controller.ts', 'controller/test-foo-bar.controller.empty.ts')
          .assertEqual('test-foo-bar.controller.spec.ts', 'controller/test-foo-bar.controller.spec.empty.ts')
          .assertEqual('index.ts', 'controller/index.ts');
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
        .copyMock('controller/index.ts', 'index.ts')
        .cd('..');
    });

    it('should add all the imports if none exists.', () => {
      fs
        .copyMock('controller/app.controller.no-import.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.no-import.ts');
    });

    it('should update the "subControllers" import in src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.controller-import.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.controller-import.ts');
    });

    it('should add a "subControllers" import in src/app/app.controller.ts if none already exists.', () => {
      fs
        .copyMock('controller/app.controller.no-controller-import.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.no-controller-import.ts');
    });

    it('should update the "@foal/core" import in src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.core-import.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.core-import.ts');
    });

    it('should update the "subControllers = []" property in src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.empty-property.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.empty-property.ts');
    });

    it('should update the "subControllers = [ \\n \\n ]" property in src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.empty-spaced-property.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.empty-spaced-property.ts');
    });

    it('should update the "subControllers = [ \\n (.*) \\n ]" property in'
        + ' src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.no-empty-property.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.no-empty-property.ts');
    });

  });

});
