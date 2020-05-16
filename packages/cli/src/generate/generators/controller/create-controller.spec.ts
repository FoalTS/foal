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
        createController({ name: 'test-fooBar', type: 'Empty', register: false });

        fs
          .assertEqual('test-foo-bar.controller.ts', 'controller/test-foo-bar.controller.empty.ts')
          .assertEqual('test-foo-bar.controller.spec.ts', 'controller/test-foo-bar.controller.spec.empty.ts')
          .assertEqual('index.ts', 'controller/index.ts');
      });

      it('should render the REST templates in the proper directory.', () => {
        createController({ name: 'test-fooBar', type: 'REST', register: false });

        fs
          .assertEqual('test-foo-bar.controller.ts', 'controller/test-foo-bar.controller.rest.ts')
          .assertEqual('index.ts', 'controller/index.ts');
      });

      it('should not throw an error if index.ts does not exist.', () => {
        // TODO: replace with "should create index.ts if it does not exist."
        fs.rmfile('index.ts');
        createController({ name: 'test-fooBar', type: 'Empty', register: false });
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

    // TODO: refactor these tests and their mock and spec files.

    it('should add all the imports if none exists.', () => {
      fs
        .copyMock('controller/app.controller.no-import.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.no-import.ts');
    });

    it('should update the "subControllers" import in src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.controller-import.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.controller-import.ts');
    });

    it('should add a "subControllers" import in src/app/app.controller.ts if none already exists.', () => {
      fs
        .copyMock('controller/app.controller.no-controller-import.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.no-controller-import.ts');
    });

    it('should update the "@foal/core" import in src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.core-import.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.core-import.ts');
    });

    it('should update the "subControllers = []" property in src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.empty-property.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.empty-property.ts');
    });

    it('should update the "subControllers = [ \\n \\n ]" property in src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.empty-spaced-property.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.empty-spaced-property.ts');
    });

    it('should update the "subControllers = [ \\n (.*) \\n ]" property in'
        + ' src/app/app.controller.ts if it exists.', () => {
      fs
        .copyMock('controller/app.controller.no-empty-property.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', type: 'Empty', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.no-empty-property.ts');
    });

    it('should update the "subControllers" property with a special URL if the controller is a REST controller.', () => {
      fs
        .copyMock('controller/app.controller.rest.ts', 'app.controller.ts');

      createController({ name: 'test-fooBar', type: 'REST', register: true });

      fs
        .assertEqual('app.controller.ts', 'controller/app.controller.rest.ts');
    });

  });

});
