// FoalTS
import { FileSystem } from '../../../services';
import { CreateEntityCommandService } from './create-entity-command.service';

describe('CreateEntityCommandService', () => {

  const fs = new FileSystem();
  let service: CreateEntityCommandService;

  beforeEach(() => {
    fs.setUp();
    const fileSystem = new FileSystem();
    service = new CreateEntityCommandService(fileSystem);
  });

  afterEach(() => fs.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      it('should render the templates in the proper directory.', () => {
        fs
          .copyFixture('entity/package.json', 'package.json')
          .ensureDir(root)
          .cd(root)
          .copyFixture('entity/index.ts', 'index.ts');

        service.run({ name: 'test-fooBar' });

        fs
          .assertEqual('test-foo-bar.entity.ts', 'entity/test-foo-bar.entity.ts')
          .assertEqual('index.ts', 'entity/index.ts');
      });

      it('should render the templates in the proper directory (MongoDB).', () => {
        fs
          .copyFixture('entity/package.mongodb.json', 'package.json')
          .ensureDir(root)
          .cd(root)
          .copyFixture('entity/index.ts', 'index.ts');

        service.run({ name: 'test-fooBar' });

        fs
          .assertEqual('test-foo-bar.entity.ts', 'entity/test-foo-bar.entity.mongodb.ts')
          .assertEqual('index.ts', 'entity/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        fs
          .copyFixture('entity/package.json', 'package.json')
          .ensureDir(root)
          .cd(root)
          .copyFixture('entity/index.ts', 'index.ts');

        service.run({ name: 'barfoo/hello/test-fooBar' });

        fs
          .assertExists('barfoo/hello/test-foo-bar.entity.ts');
      });

      it('create index.ts if it does not exist.', () => {
        fs
          .copyFixture('entity/package.json', 'package.json')
          .ensureDir(root)
          .cd(root);

        service.run({ name: 'test-fooBar' });

        fs.assertExists('index.ts');
      });

    });

  }

  test('src/app/entities');
  test('entities');
  test('');

});

