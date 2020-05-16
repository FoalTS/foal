// std
import { strictEqual } from 'assert';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

// FoalTS
import {
  mkdirIfDoesNotExist,
  rmDirAndFilesIfExist,
} from '../../utils';
import { createSubApp } from './create-sub-app';

// TODO: Use FileSystem or remove this command.

function rmfileIfExists(path: string) {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

function readFileFromTemplatesSpec(src: string): string {
  return readFileSync(join(__dirname, '../../specs', src), 'utf8');
}

function readFileFromRoot(src: string): string {
  return readFileSync(src, 'utf8');
}

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
      mkdirIfDoesNotExist('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in src/app/sub-apps/ if src/app/ exists.', () => {
      mkdirIfDoesNotExist('src/app');
      test('src/app/sub-apps/', false);
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfDoesNotExist('sub-apps');
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
      mkdirIfDoesNotExist('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfDoesNotExist('sub-apps');
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
      mkdirIfDoesNotExist('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfDoesNotExist('sub-apps');
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
      mkdirIfDoesNotExist('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfDoesNotExist('sub-apps');
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
      mkdirIfDoesNotExist('src/app/sub-apps');
      test('src/app/sub-apps/');
    });

    it('in sub-apps/ if the directory exists.', () => {
      mkdirIfDoesNotExist('sub-apps');
      test('sub-apps/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

});
