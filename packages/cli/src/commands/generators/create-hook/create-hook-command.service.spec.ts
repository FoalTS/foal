// FoalTS
import { FileSystemService, Generator, LoggerService } from '../../../services';
import { CreateHookCommandService } from './create-hook-command.service';

describe('CreateHookCommandService', () => {

  let fileSystem: FileSystemService;
  let generator: Generator;
  let service: CreateHookCommandService;

  beforeEach(() => {
    fileSystem = new FileSystemService();
    fileSystem.setUp();
    const logger = new LoggerService();
    generator = new Generator(fileSystem, logger);

    const generator2 = new Generator(fileSystem, logger);
    service = new CreateHookCommandService(generator2);
  });

  afterEach(() => fileSystem.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      beforeEach(() => {
        generator
          .ensureDir(root)
          .cd(root)
          .copyFixture('hook/index.ts', 'index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        service.run({ name: 'test-fooBar' });

        generator
          .assertEqual('test-foo-bar.hook.ts', 'hook/test-foo-bar.hook.ts')
          .assertEqual('index.ts', 'hook/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        service.run({ name: 'barfoo/hello/test-fooBar' });

        generator
          .assertExists('barfoo/hello/test-foo-bar.hook.ts');
      });

      it('should create index.ts if it does not exist.', () => {
        generator.rmfile('index.ts');

        service.run({ name: 'test-fooBar' });

        generator.assertExists('index.ts');
      });

    });

  }

  test('src/app/hooks');
  test('hooks');
  test('');

});

