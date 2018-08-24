// std
import { writeFileSync } from 'fs';

// FoalTS
import {
  mkdirIfNotExists,
  rmdirIfExists,
  rmfileIfExists,
  validateGeneratedFile
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
      mkdirIfNotExists('src/app/hooks');
      writeFileSync('src/app/hooks/index.ts', indexInitialContent, 'utf8');

      createHook({ name: 'test-fooBar' });

      validateGeneratedFile(
        'src/app/hooks/test-foo-bar.hook.ts',
        'hook/test-foo-bar.hook.1.ts'
      );
      validateGeneratedFile(
        'src/app/hooks/index.ts',
        'hook/index.1.ts'
      );
    });

    it('in src/app/hooks/ if the directory exists.', () => {
      mkdirIfNotExists('hooks');
      writeFileSync('hooks/index.ts', indexInitialContent, 'utf8');

      createHook({ name: 'test-fooBar' });

      validateGeneratedFile(
        'hooks/test-foo-bar.hook.ts',
        'hook/test-foo-bar.hook.1.ts'
      );
      validateGeneratedFile(
        'hooks/index.ts',
        'hook/index.1.ts'
      );
    });

    it('in the current directory otherwise.', () => {
      writeFileSync('index.ts', indexInitialContent, 'utf8');

      createHook({ name: 'test-fooBar' });

      validateGeneratedFile(
        'test-foo-bar.hook.ts',
        'hook/test-foo-bar.hook.1.ts'
      );
      validateGeneratedFile(
        'index.ts',
        'hook/index.1.ts'
      );
    });

  });

});
