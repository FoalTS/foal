// std
import { strictEqual } from 'assert';

// FoalTS
import { yellow } from 'colors/safe';
import { ClientError, FileSystem } from '../../file-system';
import { createModel } from './create-model';

describe('createModel', () => {

  const fs = new FileSystem();

  beforeEach(() => fs.setUp());

  afterEach(() => fs.tearDown());

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      beforeEach(() => {
        fs
          .copyFixture('model/package.mongoose.json', 'package.json')
          .ensureDir(root)
          .cd(root)
          .copyFixture('model/index.ts', 'index.ts');
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

  it('should throw a ClientError if the project does not have the dependency "mongoose".', () => {
    fs
      .copyFixture('model/index.ts', 'index.ts')
      .copyFixture('model/package.json', 'package.json');

    try {
      createModel({ name: 'test-fooBar' });
      throw new Error('An error should have been thrown');
    } catch (error) {
      if (!(error instanceof ClientError)) {
        throw new Error('The error thrown should be an instance of ClientError.');
      }
      strictEqual(
        error.message,
        `"foal generate|g ${yellow('model')} <name>" can only be used in a Mongoose project.\n`
        + `  Please use "foal generate|g ${yellow('entity')} <name>" instead.`
      );
    }
  });

});
