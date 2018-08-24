// std
import { strictEqual } from 'assert';
import { writeFileSync } from 'fs';

// FoalTS
import {
  mkdirIfNotExists,
  readFileFromRoot,
  readFileFromTemplatesSpec,
  rmdirIfExists,
  rmfileIfExists,
  validateGeneratedFile
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

  describe('should render the templates.', () => {

    const indexInitialContent = 'export { BarFoo } from \'./bar-foo.entity\';\n';

    it('in src/app/entities/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/entities');
      writeFileSync('src/app/entities/index.ts', indexInitialContent, 'utf8');

      createEntity({ name: 'test-fooBar' });

      validateGeneratedFile(
        'src/app/entities/test-foo-bar.entity.ts',
        'entity/test-foo-bar.entity.1.ts'
      );
      validateGeneratedFile(
        'src/app/entities/index.ts',
        'entity/index.1.ts'
      );
    });

    it('in entities/ if the directory exists.', () => {
      mkdirIfNotExists('entities');
      writeFileSync('entities/index.ts', indexInitialContent, 'utf8');

      createEntity({ name: 'test-fooBar' });

      let expected = readFileFromTemplatesSpec('entity/test-foo-bar.entity.1.ts');
      let actual = readFileFromRoot('entities/test-foo-bar.entity.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('entity/index.1.ts');
      actual = readFileFromRoot('entities/index.ts');
      strictEqual(actual, expected);
    });

    it('in the current directory otherwise.', () => {
      writeFileSync('index.ts', indexInitialContent, 'utf8');

      createEntity({ name: 'test-fooBar' });

      let expected = readFileFromTemplatesSpec('entity/test-foo-bar.entity.1.ts');
      let actual = readFileFromRoot('test-foo-bar.entity.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('entity/index.1.ts');
      actual = readFileFromRoot('index.ts');
      strictEqual(actual, expected);
    });

  });

});
