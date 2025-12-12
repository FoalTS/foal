// FoalTS
import { FileSystemService, Generator, LoggerService } from '../../../services';
import { CreateEntityCommandService } from './create-entity-command.service';

describe('CreateEntityCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: CreateEntityCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);

    const generator2 = new Generator(fileSystem, logger);
    service = new CreateEntityCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      it('should render the templates in the proper directory.', () => {
        generator
          .copyFixture('entity/package.json', 'package.json')
          .ensureDir(root)
          .cd(root)
          .copyFixture('entity/index.ts', 'index.ts');

        service.run({ name: 'test-fooBar' });

        generator
          .assertEqual('test-foo-bar.entity.ts', 'entity/test-foo-bar.entity.ts')
          .assertEqual('index.ts', 'entity/index.ts');
      });

      it('should render the templates in the proper directory (MongoDB).', () => {
        generator
          .copyFixture('entity/package.mongodb.json', 'package.json')
          .ensureDir(root)
          .cd(root)
          .copyFixture('entity/index.ts', 'index.ts');

        service.run({ name: 'test-fooBar' });

        generator
          .assertEqual('test-foo-bar.entity.ts', 'entity/test-foo-bar.entity.mongodb.ts')
          .assertEqual('index.ts', 'entity/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        generator
          .copyFixture('entity/package.json', 'package.json')
          .ensureDir(root)
          .cd(root)
          .copyFixture('entity/index.ts', 'index.ts');

        service.run({ name: 'barfoo/hello/test-fooBar' });

        generator
          .assertExists('barfoo/hello/test-foo-bar.entity.ts');
      });

      it('create index.ts if it does not exist.', () => {
        generator
          .copyFixture('entity/package.json', 'package.json')
          .ensureDir(root)
          .cd(root);

        service.run({ name: 'test-fooBar' });

        generator.assertExists('index.ts');
      });

    });

  }

  test('src/app/entities');
  test('entities');
  test('');

});

