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
import { createHook } from './create-hook';

describe('createHook', () => {

  afterEach(() => {
    rmfileIfExists('src/app/hooks/test-foo-bar.hook.ts');
    rmdirIfExists('src/app/hooks');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('hooks/test-foo-bar.hook.ts');
    rmdirIfExists('hooks');

    rmfileIfExists('test-foo-bar.hook.ts');
  });

  describe('should render the templates.', () => {

    it('in src/app/hooks/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/hooks');

      createHook({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('hook/test-foo-bar.hook.1.ts');
      const actual = readFileFromRoot('src/app/hooks/test-foo-bar.hook.ts');
      strictEqual(actual, expected);

    });

    it('in src/app/hooks/ if the directory exists.', () => {
      mkdirIfNotExists('hooks');

      createHook({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('hook/test-foo-bar.hook.1.ts');
      const actual = readFileFromRoot('hooks/test-foo-bar.hook.ts');
      strictEqual(actual, expected);

    });

    it('in the current directory otherwise.', () => {

      createHook({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('hook/test-foo-bar.hook.1.ts');
      const actual = readFileFromRoot('test-foo-bar.hook.ts');
      strictEqual(actual, expected);

    });

  });

});
