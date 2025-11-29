// FoalTS
import { Generator } from '../../../services';
import { CreateEntityCommandService } from './create-entity-command.service';

describe('CreateEntityCommandService', () => {

  const generator = new Generator();
  let service: CreateEntityCommandService;

  beforeEach(() => {
    generator.setUp();
    const generator2 = new Generator();
    service = new CreateEntityCommandService(generator2);
  });

  afterEach(() => generator.tearDown());

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

