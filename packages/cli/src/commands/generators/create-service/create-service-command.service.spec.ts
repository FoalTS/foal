// FoalTS
import { FileSystem } from '../../../services';
import { CreateServiceCommandService } from './create-service-command.service';

describe('CreateServiceCommandService', () => {

  const fs = new FileSystem();
  let service: CreateServiceCommandService;

  beforeEach(() => {
    fs.setUp();
    const fileSystem = new FileSystem();
    service = new CreateServiceCommandService(fileSystem);
  });

  afterEach(() => fs.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      beforeEach(() => {
        fs
          .ensureDir(root)
          .cd(root)
          .copyFixture('service/index.ts', 'index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        service.run({ name: 'test-fooBar' });

        fs
          .assertEqual('test-foo-bar.service.ts', 'service/test-foo-bar.service.empty.ts')
          .assertEqual('index.ts', 'service/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        service.run({ name: 'barfoo/hello/test-fooBar' });

        fs
          .assertExists('barfoo/hello/test-foo-bar.service.ts');
      });

      it('should create index.ts if it does not exist.', () => {
        fs.rmfile('index.ts');

        service.run({ name: 'test-fooBar' });

        fs.assertExists('index.ts');
      });

    });

  }

  test('src/app/services');
  test('services');
  test('');

});

