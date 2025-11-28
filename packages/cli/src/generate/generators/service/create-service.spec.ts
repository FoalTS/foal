// FoalTS
import { FileSystem } from '../../../services';
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
          .copyFixture('service/index.ts', 'index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        createService({ name: 'test-fooBar' });

        fs
          .assertEqual('test-foo-bar.service.ts', 'service/test-foo-bar.service.empty.ts')
          .assertEqual('index.ts', 'service/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        createService({ name: 'barfoo/hello/test-fooBar' });

        fs
          .assertExists('barfoo/hello/test-foo-bar.service.ts');
      });

      it('should create index.ts if it does not exist.', () => {
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
