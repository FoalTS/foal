// FoalTS
import { FileSystem } from '../../file-system';
import { createService } from './create-service';

describe('createService', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      beforeEach(() => {
        fs
          .ensureDir(root)
          .cd(root)
          .copyMock('service/index.ts', 'index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        createService({ name: 'test-fooBar' });

        fs
          .assertEqual('test-foo-bar.service.ts', 'service/test-foo-bar.service.empty.ts')
          .assertEqual('index.ts', 'service/index.ts');
      });

      it('should should create index.ts if it does not exist.', () => {
        fs.rmfile('index.ts');

        createService({ name: 'test-fooBar' });

        fs.assertExists('index.ts');
      });

    });

  }

  test('src/app/services');
  test('services');
  test('');

});
