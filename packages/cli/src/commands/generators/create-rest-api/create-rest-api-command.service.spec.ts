// std
import { throws } from 'assert';

// FoalTS
import { ClientError, FileSystemService, Generator, LoggerService } from '../../../services';
import { CreateRestApiCommandService } from './create-rest-api-command.service';

describe('CreateRestApiCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: CreateRestApiCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);

    const generator2 = new Generator(fileSystem, logger);
    service = new CreateRestApiCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  it('should throw a ClientError if the project has the dependency "mongodb".', () => {
    generator
      .copyFixture('rest-api/package.mongodb.json', 'package.json');

    throws(
      () => service.run({ name: 'test-fooBar', register: false }),
      new ClientError('"npx foal generate|g rest-api <name>" cannot be used in a MongoDB project.')
    );
  });

  it('should throw a ClientError the directories entities (or src/app/entities) and controllers (or src/app/controllers) do not exist.', () => {
    generator
      .copyFixture('rest-api/package.json', 'package.json');

    throws(
      () => service.run({ name: 'test-fooBar', register: false }),
      new ClientError(
        'Impossible to generate a REST API endpoint. '
        + 'The directories controllers/ and entities/ (or src/app/controllers and src/app/entities) were not found.')
    );
  });

  function test(root: string) {

    beforeEach(() => {
      generator
        .copyFixture('rest-api/package.json', 'package.json')
        .ensureDir(root)
        .cd(root)
        .ensureDir('entities')
        .ensureDir('controllers');
    });

    context('given the provided name is a not a path', () => {

      it('should create in the controllers/ directory the controller and its test.', () => {
        service.run({ name: 'test-fooBar', register: false });

        generator
          .assertEqual('controllers/test-foo-bar.controller.ts', 'rest-api/controllers/test-foo-bar.controller.ts')
          .assertEqual('controllers/test-foo-bar.controller.spec.ts', 'rest-api/controllers/test-foo-bar.controller.spec.ts');
      });

      it('should create in the controllers/ directory the controller and its test (auth flag).', () => {
        service.run({ name: 'test-fooBar', register: false, auth: true });

        generator
          .assertEqual('controllers/test-foo-bar.controller.ts', 'rest-api/controllers/test-foo-bar.controller.auth.ts')
          .assertEqual('controllers/test-foo-bar.controller.spec.ts', 'rest-api/controllers/test-foo-bar.controller.spec.auth.ts');
      });

      it('should create in the entitites/ directory the entity.', () => {
        service.run({ name: 'test-fooBar', register: false });

        generator
          .assertEqual('entities/test-foo-bar.entity.ts', 'rest-api/entities/test-foo-bar.entity.ts');
      });

      it('should create in the entitites/ directory the entity (auth flag).', () => {
        service.run({ name: 'test-fooBar', register: false, auth: true });

        generator
          .assertEqual('entities/test-foo-bar.entity.ts', 'rest-api/entities/test-foo-bar.entity.auth.ts');
      });

      it(
        'should create in the controllers/ directory an index.ts file if it does not exist '
        + 'and export the controller.',
        () => {
          service.run({ name: 'test-fooBar', register: false });

          generator
            .assertEqual('controllers/index.ts', 'rest-api/controllers/index.empty.ts');
        }
      );

      it(
        'should create in the entities/ directory an index.ts file if it does not exist '
        + 'and export the entity.',
        () => {
          service.run({ name: 'test-fooBar', register: false });

          generator
            .assertEqual('entities/index.ts', 'rest-api/entities/index.empty.ts');
        }
      );

      it(
        'should update in the controllers/ directory the index.ts file '
        + 'if it exists and export the controller.',
        () => {
          generator
            .copyFixture('rest-api/index.controllers.ts', 'controllers/index.ts');

          service.run({ name: 'test-fooBar', register: false });

          generator
            .assertEqual('controllers/index.ts', 'rest-api/controllers/index.ts');
        }
        );

      it('should update in the entities/ directory the index.ts file if it exists and export the entity.', () => {
        generator
          .copyFixture('rest-api/index.entities.ts', 'entities/index.ts');

        service.run({ name: 'test-fooBar', register: false });

        generator
          .assertEqual('entities/index.ts', 'rest-api/entities/index.ts');
      });

      context('given the register option is false', () => {

        it('should not try to update in the file app.controller.ts if it exists the current directory.', () => {
          generator
            .copyFixture('rest-api/app.controller.ts', 'app.controller.ts');

          service.run({ name: 'test-fooBar', register: false });

          generator
            .assertEqual('app.controller.ts', 'rest-api/app.controller.not-modified.ts');
        });

      });

      context('given the register option is true', () => {

        it('should throw a ClientError if the file app.controller.ts does not exist in the current directory.', () => {
          throws(
            () => service.run({ name: 'test-fooBar', register: true }),
            new ClientError('Impossible to modify "app.controller.ts": the file does not exist.')
          );
        });

        it(
          'should register the controller in the file app.controller.ts '
          + 'if it exists in the current directory.',
          () => {
            generator
              .copyFixture('rest-api/app.controller.ts', 'app.controller.ts');

            service.run({ name: 'test-fooBar', register: true });

            generator
              .assertEqual('app.controller.ts', 'rest-api/app.controller.ts');
          }
        );

      });

    });

    context('given the provided name is a path', () => {

      it('should create the sub-directories if they do not exist in the controllers/ directory.', () => {
        service.run({ name: 'barfoo/api/test-fooBar', register: false });

        generator
          .assertExists('controllers/barfoo/api');
      });

      it('should create in the sub-directories the controller and its test.', () => {
        service.run({ name: 'barfoo/api/test-fooBar', register: false });

        generator
          .cd('controllers/barfoo/api')
          .assertEqual('test-foo-bar.controller.ts', 'rest-api/controllers/test-foo-bar.controller.subdir.ts')
          .assertEqual(
            'test-foo-bar.controller.spec.ts',
            'rest-api/controllers/test-foo-bar.controller.spec.subdir.ts'
          );
      });

      it('should create in the sub-directories the controller and its test (auth flag).', () => {
        service.run({ name: 'barfoo/api/test-fooBar', register: false, auth: true });

        generator
          .cd('controllers/barfoo/api')
          .assertEqual('test-foo-bar.controller.ts', 'rest-api/controllers/test-foo-bar.controller.auth.subdir.ts')
          .assertEqual('test-foo-bar.controller.spec.ts', 'rest-api/controllers/test-foo-bar.controller.spec.auth.subdir.ts');
      });

      it('should create in the entitites/ directory the entity.', () => {
        service.run({ name: 'barfoo/api/test-fooBar', register: false });

        generator
          .assertEqual('entities/test-foo-bar.entity.ts', 'rest-api/entities/test-foo-bar.entity.ts');
      });

      it('should create in the entitites/ directory the entity (auth flag).', () => {
        service.run({ name: 'barfoo/api/test-fooBar', register: false, auth: true });

        generator
          .assertEqual('entities/test-foo-bar.entity.ts', 'rest-api/entities/test-foo-bar.entity.auth.ts');
      });

      it(
        'should create in the controllers/ sub-directories an index.ts file if it does not exist '
        + 'and export the controller.',
        () => {
          service.run({ name: 'barfoo/api/test-fooBar', register: false });

          generator
            .cd('controllers/barfoo/api')
            .assertEqual('index.ts', 'rest-api/controllers/index.empty.ts');
        }
      );

      it(
        'should create in the entities/ directory an index.ts file if it does not exist '
        + 'and export the entity.',
        () => {
          service.run({ name: 'barfoo/api/test-fooBar', register: false });

          generator
            .assertEqual('entities/index.ts', 'rest-api/entities/index.empty.ts');
        }
      );

      it(
        'should update in controllers/ the sub-directories the index.ts file '
        + 'if it exists and export the controller.',
        () => {
          generator
            .ensureDir('controllers/barfoo/api')
            .cd('controllers/barfoo/api')
            .copyFixture('rest-api/index.controllers.ts', 'index.ts');

          service.run({ name: 'barfoo/api/test-fooBar', register: false });

          generator
            .assertEqual('index.ts', 'rest-api/controllers/index.ts');
        }
      );

      it('should update in the entities/ directory the index.ts file if it exists and export the entity.', () => {
        generator
          .copyFixture('rest-api/index.entities.ts', 'entities/index.ts');

        service.run({ name: 'barfoo/api/test-fooBar', register: false });

        generator
          .assertEqual('entities/index.ts', 'rest-api/entities/index.ts');
      });

      context('given the register option is false', () => {

        it('should not try to update the file xxx.controller.ts if it exists in the last sub-directory xxx.', () => {
          generator
            .ensureDir('controllers/barfoo')
            .cd('controllers/barfoo')
            .copyFixture('rest-api/api.controller.ts', 'api.controller.ts');

          service.run({ name: 'barfoo/api/test-fooBar', register: false });

          generator
            .assertEqual('api.controller.ts', 'rest-api/controllers/api.controller.not-modified.ts');
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
            generator
              .ensureDir('controllers/barfoo')
              .cd('controllers/barfoo')
              .copyFixture('rest-api/api.controller.ts', 'api.controller.ts');

            service.run({ name: 'barfoo/api/test-fooBar', register: true });

            generator
              .assertEqual('api.controller.ts', 'rest-api/controllers/api.controller.ts');
          }
        );

      });

    });

  }

  describe('when the directories controllers/ and entities/ exist', () => {
    test('');
  });

  describe('when the directories src/app/controllers/ and src/app/entities/ exist', () => {
    test('src/app');
  });

});

