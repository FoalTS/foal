// std
import { strictEqual } from 'assert';

// FoalTS
import {
  mkdirIfNotExists,
  readFileFromRoot,
  readFileFromTemplatesSpec,
  rmdirIfExists,
  rmfileIfExists
} from '../../utils';
import { createEntity } from './create-entity';

describe('createEntity', () => {

  afterEach(() => {
    rmfileIfExists('src/app/entities/test-foo-bar.entity.ts');
    rmdirIfExists('src/app/entities');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('entities/test-foo-bar.entity.ts');
    rmdirIfExists('entities');

    rmfileIfExists('test-foo-bar.entity.ts');
  });

  describe('should render the templates.', () => {

    it('in src/app/entities/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/entities');

      createEntity({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('entity/test-foo-bar.entity.1.ts');
      const actual = readFileFromRoot('src/app/entities/test-foo-bar.entity.ts');
      strictEqual(actual, expected);

    });

    it('in entities/ if the directory exists.', () => {
      mkdirIfNotExists('entities');

      createEntity({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('entity/test-foo-bar.entity.1.ts');
      const actual = readFileFromRoot('entities/test-foo-bar.entity.ts');
      strictEqual(actual, expected);

    });

    it('in the current directory otherwise.', () => {

      createEntity({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('entity/test-foo-bar.entity.1.ts');
      const actual = readFileFromRoot('test-foo-bar.entity.ts');
      strictEqual(actual, expected);

    });

  });

});
