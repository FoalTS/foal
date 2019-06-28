// std
import { strictEqual } from 'assert';
import { existsSync, writeFileSync } from 'fs';

// FoalTS
import {
  mkdirIfNotExists,
  readFileFromRoot,
  readFileFromTemplatesSpec,
  rmDirAndFilesIfExist,
  rmfileIfExists
} from '../../utils';
import { createSubApp } from './create-sub-app';

// TODO: Use TestEnvironment.

describe('createSubApp', () => {

  afterEach(() => {
    rmDirAndFilesIfExist('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    rmDirAndFilesIfExist('sub-apps');
    rmDirAndFilesIfExist('test-foo-bar');
    rmfileIfExists('index.ts');
  });

  const indexInitialContent = 'export { BarFooController } from \'./bar-foo\';\n';

  describe('should render the root templates', () => {

    function test(prefix = '', indexAlreadyExist = true) {
      if (indexAlreadyExist) {
        writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');
      }

      createSubApp({ name: 'test-fooBar' });

      let expected = readFileFromTemplatesSpec('sub-app/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/index.ts`);
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('sub-app/test-foo-bar.controller.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/test-foo-bar.controller.ts`);
      strictEqual(actual, expected);

      if (indexAlreadyExist) {
        expected = readFileFromTemplatesSpec('sub-app/index.parent.ts');
        actual = readFileFromRoot(`${prefix}index.ts`);
        strictEqual(actual, expected);
      } else {
        expected = readFileFromTemplatesSpec('sub-app/index.parent.empty.ts');
        actual = readFileFromRoot(`${prefix}index.ts`);
        strictEqual(actual, expected);
      }
    }

    it('in src/app/sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in src/app/sub-apps/ if src/app/ exists.', () => {
      mkdirIfNotExists('src/app');
      test('src/app/sub-apps/', false);
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('sub-apps');
      test('sub-apps/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the controllers templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createSubApp({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('sub-app/controllers/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/controllers/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('sub-apps');
      test('sub-apps/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the hooks templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createSubApp({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('sub-app/hooks/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/hooks/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('sub-apps');
      test('sub-apps/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the entities templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createSubApp({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('sub-app/entities/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/entities/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('sub-apps');
      test('sub-apps/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the sub-apps templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createSubApp({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('sub-app/sub-apps/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/sub-apps/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('sub-apps');
      test('sub-apps/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the services templates.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createSubApp({ name: 'test-fooBar' });

      const expected = readFileFromTemplatesSpec('sub-app/services/index.1.ts');
      const actual = readFileFromRoot(`${prefix}test-foo-bar/services/index.ts`);
      strictEqual(actual, expected);
    }

    it('in src/app/sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('sub-apps');
      test('sub-apps/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should create the controllers/templates directory.', () => {

    function test(prefix = '') {
      writeFileSync(`${prefix}index.ts`, indexInitialContent, 'utf8');

      createSubApp({ name: 'test-fooBar' });

      if (!existsSync(`${prefix}test-foo-bar/controllers/templates`)) {
        throw new Error('The controllers/templates directory should be created.');
      }
    }

    it('in src/app/sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfNotExists('sub-apps');
      test('sub-apps/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

});
