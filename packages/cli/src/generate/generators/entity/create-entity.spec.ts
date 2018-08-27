// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment,
} from '../../utils';
import { createEntity } from './create-entity';

describe('createEntity', () => {

  afterEach(() => {
    rmfileIfExists('src/app/entities/test-foo-bar.entity.ts');
    rmfileIfExists('src/app/entities/index.ts');
    rmdirIfExists('src/app/entities');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('entities/test-foo-bar.entity.ts');
    rmfileIfExists('entities/index.ts');
    rmdirIfExists('entities');

    rmfileIfExists('test-foo-bar.entity.ts');
    rmfileIfExists('index.ts');
  });

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      const testEnv = new TestEnvironment('entity', root);

      beforeEach(() => {
        testEnv.mkRootDirIfDoesNotExist();
        testEnv.copyFileFromMocks('index.ts');
      });

      it('should render the templates in the proper directory.', () => {
        createEntity({ name: 'test-fooBar' });

        testEnv
          .validateSpec('test-foo-bar.entity.ts')
          .validateSpec('index.ts', 'index.ts');
      });

    });

  }

  test('src/app/entities');
  test('entities');
  test('');

});
