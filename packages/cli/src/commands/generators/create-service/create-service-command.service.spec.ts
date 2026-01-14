// FoalTS
import { FileSystemService, Generator, LoggerService } from '../../../services';
import { CreateServiceCommandService } from './create-service-command.service';

describe('CreateServiceCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: CreateServiceCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);

    const generator2 = new Generator(fileSystem, logger);
    service = new CreateServiceCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      beforeEach(() => {
        generator
          .ensureDir(root)
          .cd(root)
          .copyFixture('service/index.ts', 'index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        service.run({ name: 'test-fooBar' });

        generator
          .assertEqual('test-foo-bar.service.ts', 'service/test-foo-bar.service.empty.ts')
          .assertEqual('index.ts', 'service/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        service.run({ name: 'barfoo/hello/test-fooBar' });

        generator
          .assertExists('barfoo/hello/test-foo-bar.service.ts');
      });

      it('should create index.ts if it does not exist.', () => {
        generator.rmfile('index.ts');

        service.run({ name: 'test-fooBar' });

        generator.assertExists('index.ts');
      });

    });

  }

  test('src/app/services');
  test('services');
  test('');

});

