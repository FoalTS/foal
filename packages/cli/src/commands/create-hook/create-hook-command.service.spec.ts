// FoalTS
import { FileSystem } from '../../services';
import { CreateHookCommandService } from './create-hook-command.service';

describe('CreateHookCommandService', () => {

  const fs = new FileSystem();
  let service: CreateHookCommandService;

  beforeEach(() => {
    fs.setUp();
    const fileSystem = new FileSystem();
    service = new CreateHookCommandService(fileSystem);
  });

  afterEach(() => fs.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      beforeEach(() => {
        fs
          .ensureDir(root)
          .cd(root)
          .copyFixture('hook/index.ts', 'index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        service.run({ name: 'test-fooBar' });

        fs
          .assertEqual('test-foo-bar.hook.ts', 'hook/test-foo-bar.hook.ts')
          .assertEqual('index.ts', 'hook/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        service.run({ name: 'barfoo/hello/test-fooBar' });

        fs
          .assertExists('barfoo/hello/test-foo-bar.hook.ts');
      });

      it('should create index.ts if it does not exist.', () => {
        fs.rmfile('index.ts');

        service.run({ name: 'test-fooBar' });

        fs.assertExists('index.ts');
      });

    });

  }

  test('src/app/hooks');
  test('hooks');
  test('');

});

