// std
import { strictEqual } from 'assert';
import { writeFileSync } from 'fs';

// FoalTS
import {
  mkdirIfNotExists,
  readFileFromRoot,
  readFileFromTemplatesSpec,
  rmdirIfExists,
  rmfileIfExists
} from '../../utils';
import { createHook } from './create-hook';

describe('createHook', () => {

  afterEach(() => {
    rmfileIfExists('src/app/hooks/test-foo-bar.hook.ts');
    rmfileIfExists('src/app/hooks/index.ts');
    rmdirIfExists('src/app/hooks');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('hooks/test-foo-bar.hook.ts');
    rmfileIfExists('hooks/index.ts');
    rmdirIfExists('hooks');

    rmfileIfExists('test-foo-bar.hook.ts');
    rmfileIfExists('index.ts');
  });

  describe('should render the templates.', () => {

    const indexInitialContent = 'export { BarFoo } from \'./bar-foo.hook\';\n';

    it('in src/app/hooks/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/hooks');
      writeFileSync('src/app/hooks/index.ts', indexInitialContent, 'utf8');

      createHook({ name: 'test-fooBar' });

      let expected = readFileFromTemplatesSpec('hook/test-foo-bar.hook.1.ts');
      let actual = readFileFromRoot('src/app/hooks/test-foo-bar.hook.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('hook/index.1.ts');
      actual = readFileFromRoot('src/app/hooks/index.ts');
      strictEqual(actual, expected);
    });

    it('in src/app/hooks/ if the directory exists.', () => {
      mkdirIfNotExists('hooks');
      writeFileSync('hooks/index.ts', indexInitialContent, 'utf8');

      createHook({ name: 'test-fooBar' });

      let expected = readFileFromTemplatesSpec('hook/test-foo-bar.hook.1.ts');
      let actual = readFileFromRoot('hooks/test-foo-bar.hook.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('hook/index.1.ts');
      actual = readFileFromRoot('hooks/index.ts');
      strictEqual(actual, expected);
    });

    it('in the current directory otherwise.', () => {
      writeFileSync('index.ts', indexInitialContent, 'utf8');

      createHook({ name: 'test-fooBar' });

      let expected = readFileFromTemplatesSpec('hook/test-foo-bar.hook.1.ts');
      let actual = readFileFromRoot('test-foo-bar.hook.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('hook/index.1.ts');
      actual = readFileFromRoot('index.ts');
      strictEqual(actual, expected);
    });

  });

});
