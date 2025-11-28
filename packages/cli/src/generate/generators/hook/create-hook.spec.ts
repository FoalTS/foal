// FoalTS
import { FileSystem } from '../../../services';
import { createHook } from './create-hook';

describe('createHook', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

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
        createHook({ name: 'test-fooBar' });

        fs
          .assertEqual('test-foo-bar.hook.ts', 'hook/test-foo-bar.hook.ts')
          .assertEqual('index.ts', 'hook/index.ts');
      });

      it('should create the directory if it does not exist.', () => {
        createHook({ name: 'barfoo/hello/test-fooBar' });

        fs
          .assertExists('barfoo/hello/test-foo-bar.hook.ts');
      });

      it('should create index.ts if it does not exist.', () => {
        fs.rmfile('index.ts');

        createHook({ name: 'test-fooBar' });

        fs.assertExists('index.ts');
      });

    });

  }

  test('src/app/hooks');
  test('hooks');
  test('');

});
