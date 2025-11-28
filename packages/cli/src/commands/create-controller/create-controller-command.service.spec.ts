// std
import { throws } from 'assert';

// FoalTS
import { ClientError, FileSystem } from '../../services';
import { CreateControllerCommandService } from './create-controller-command.service';

describe('CreateControllerCommandService', () => {

  const fs = new FileSystem();
  let service: CreateControllerCommandService;

  beforeEach(() => {
    fs.setUp();
    const fileSystem = new FileSystem();
    service = new CreateControllerCommandService(fileSystem);
  });

  afterEach(() => fs.tearDown());

  function test(root: string) {

    beforeEach(() => {
      fs
        .ensureDir(root)
        .cd(root);
    });

    context('given the provided name is a not a path', () => {

      it('should create in the current directory the controller and its test.', () => {
        service.run({ name: 'test-fooBar', register: false });

        fs
          .assertEqual('test-foo-bar.controller.ts', 'controller/test-foo-bar.controller.empty.ts')
          .assertEqual('test-foo-bar.controller.spec.ts', 'controller/test-foo-bar.controller.spec.empty.ts');
      });

      it(
        'should create in the current directory an index.ts file if it does not exist '
        + 'and export the controller.',
        () => {
          service.run({ name: 'test-fooBar', register: false });

          fs
            .assertEqual('index.ts', 'controller/index.empty.ts');
        }
      );

      it('should update in the current directory the index.ts file if it exists and export the controller.', () => {
        fs
          .copyFixture('controller/index.ts', 'index.ts');

        service.run({ name: 'test-fooBar', register: false });

        fs
          .assertEqual('index.ts', 'controller/index.ts');
      });

      context('given the register option is false', () => {

        it('should not try to update in the file app.controller.ts if it exists the parent directory.', () => {
          fs
            .cd('..')
            .copyFixture('controller/app.controller.ts', 'app.controller.ts');

          service.run({ name: 'test-fooBar', register: false });

          fs
            .assertEqual('app.controller.ts', 'controller/app.controller.not-modified.ts');
        });

      });

      context('given the register option is true', () => {

        it('should throw a ClientError if the file app.controller.ts does not exist in the parent directory.', () => {
          throws(
            () => service.run({ name: 'test-fooBar', register: true }),
            new ClientError('Impossible to modify "app.controller.ts": the file does not exist.')
          );
        });

        it('should register the controller in the file app.controller.ts if it exists in the parent directory.', () => {
          fs
            .cd('..')
            .copyFixture('controller/app.controller.ts', 'app.controller.ts');

          service.run({ name: 'test-fooBar', register: true });

          fs
            .assertEqual('app.controller.ts', 'controller/app.controller.ts');
        });

      });

    });

    context('given the provided name is a path', () => {

      it('should create the sub-directories if they do not exist.', () => {
        service.run({ name: 'barfoo/api/test-fooBar', register: false });

        fs
          .assertExists('barfoo/api');
      });

      it('should create in the sub-directories the controller and its test.', () => {
        service.run({ name: 'barfoo/api/test-fooBar', register: false });

        fs
          .cd('barfoo/api')
          .assertEqual('test-foo-bar.controller.ts', 'controller/test-foo-bar.controller.empty.ts')
          .assertEqual('test-foo-bar.controller.spec.ts', 'controller/test-foo-bar.controller.spec.empty.ts');
      });

      it(
        'should create in the sub-directories an index.ts file if it does not exist '
        + 'and export the controller.',
        () => {
          service.run({ name: 'barfoo/api/test-fooBar', register: false });

          fs
            .cd('barfoo/api')
            .assertEqual('index.ts', 'controller/index.empty.ts');
        }
      );

      it('should update in the sub-directories the index.ts file if it exists and export the controller.', () => {
        fs
          .ensureDir('barfoo/api')
          .cd('barfoo/api')
          .copyFixture('controller/index.ts', 'index.ts');

        service.run({ name: 'barfoo/api/test-fooBar', register: false });

        fs
          .assertEqual('index.ts', 'controller/index.ts');
      });

      context('given the register option is false', () => {

        it('should not try to update the file xxx.controller.ts if it exists in the last sub-directory xxx.', () => {
          fs
            .ensureDir('barfoo')
            .cd('barfoo')
            .copyFixture('controller/api.controller.ts', 'api.controller.ts');

          service.run({ name: 'barfoo/api/test-fooBar', register: false });

          fs
            .assertEqual('api.controller.ts', 'controller/api.controller.not-modified.ts');
        });

      });

      context('given the register option is true', () => {

        it(
          'should throw a ClientError if the file xxx.controller.ts does not exist '
          + 'in the last sub-directory xxx.',
          () => {
            throws(
              () => service.run({ name: 'barfoo/api/test-fooBar', register: true }),
              new ClientError('Impossible to modify "api.controller.ts": the file does not exist.')
            );
          }
        );

        it(
          'should register the controller in the file xxx.controller.ts if it exists '
          + 'in the last sub-directory xxx.',
          () => {
            fs
              .ensureDir('barfoo')
              .cd('barfoo')
              .copyFixture('controller/api.controller.ts', 'api.controller.ts');

            service.run({ name: 'barfoo/api/test-fooBar', register: true });

            fs
              .assertEqual('api.controller.ts', 'controller/api.controller.ts');
          }
        );

      });

    });

  }

  describe('when the directories src/app/controllers and controllers/ do not exist', () => {
    test('');
  });

  describe('when the directory controllers/ exists.', () => {
    test('controllers');
  });

  describe('when the directory src/app/controllers exists.', () => {
    test('src/app/controllers');
  });

});

