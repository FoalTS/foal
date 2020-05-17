// FoalTS
import { FileSystem } from '../../file-system';
import { createModel } from './create-model';

describe('createModel', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      beforeEach(() => {
        fs
          .ensureDir(root)
          .cd(root)
          .copyMock('model/index.ts', 'index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        createModel({ name: 'test-fooBar' });

        fs
          .assertEqual('test-foo-bar.model.ts', 'model/test-foo-bar.model.ts')
          .assertEqual('index.ts', 'model/index.ts');
      });

      it('should create index.ts if it does not exist.', () => {
        fs.rmfile('index.ts');

        createModel({ name: 'test-fooBar' });

        fs.assertExists('index.ts');
      });

    });

  }

  test('src/app/models');
  test('models');
  test('');

});
