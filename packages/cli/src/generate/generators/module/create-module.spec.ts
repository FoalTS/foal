// std
import { strictEqual } from 'assert';
import { existsSync, writeFileSync } from 'fs';

// FoalTS
import {
  mkdirIfNotExists,
  readFileFromRoot,
  readFileFromTemplatesSpec,
  rmdirIfExists,
  rmfileIfExists
} from '../../utils';
import { createModule } from './create-module';

// TODO: Use TestEnvironment.

function removeFiles(prefix: string = '') {
  rmdirIfExists(`${prefix}test-foo-bar/controllers/templates`);
  rmfileIfExists(`${prefix}test-foo-bar/controllers/index.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/controllers`);

  rmfileIfExists(`${prefix}test-foo-bar/hooks/index.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/hooks`);

  rmfileIfExists(`${prefix}test-foo-bar/entities/index.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/entities`);

  rmfileIfExists(`${prefix}test-foo-bar/sub-modules/index.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/sub-modules`);

  rmfileIfExists(`${prefix}test-foo-bar/services/index.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/services`);

  rmfileIfExists(`${prefix}test-foo-bar/test-foo-bar.module.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/index.ts`);

  rmdirIfExists(`${prefix}test-foo-bar`);
  rmfileIfExists(`${prefix}index.ts`);
}

describe('createModule', () => {

  afterEach(() => {
    removeFiles('src/app/sub-modules/');
    rmdirIfExists('src/app/sub-modules');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    removeFiles('sub-modules/');
    rmdirIfExists('sub-modules');

    removeFiles();
  });

  const indexInitialContent = 'export { BarFooModule } from \'./bar-foo\';\n';

  describe('should render the root templates', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createModule({ name: 'test-fooBar' });

      let expected = readFileFromTemplatesSpec('module/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/index.ts`);
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('module/test-foo-bar.module.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/test-foo-bar.module.ts`);
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('module/index.parent.ts');
      actual = readFileFromRoot(`${prefix}index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-modules');
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules');
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the controllers templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createModule({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('module/controllers/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/controllers/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-modules');
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules');
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the hooks templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createModule({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('module/hooks/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/hooks/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-modules');
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules');
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the entities templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createModule({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('module/entities/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/entities/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-modules');
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules');
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the sub-modules templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createModule({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('module/sub-modules/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/sub-modules/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-modules');
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules');
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the services templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createModule({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('module/services/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/services/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-modules');
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules');
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should create the controllers/templates directory.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createModule({ name: 'test-fooBar' });

      if (!existsSync(`${prefix}test-foo-bar/controllers/templates`)) {
        throw new Error('The controllers/templates directory should be created.');
      }
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-modules');
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules');
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

});
