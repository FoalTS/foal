// 3p
import { expect } from 'chai';

// FoalTS
import {
  mkdirIfNotExists,
  readFileFromRoot,
  readFileFromTemplatesSpec,
  rmdirIfExists,
  rmfileIfExists
} from '../../utils';
import { createModule } from './create-module';

function removeFiles(prefix: string = '') {
  rmfileIfExists(`${prefix}test-foo-bar/controllers/templates/index.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/controllers/templates/test.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/controllers/templates`);
  rmfileIfExists(`${prefix}test-foo-bar/controllers/index.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/controllers/test.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/controllers`);

  rmfileIfExists(`${prefix}test-foo-bar/hooks/index.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/hooks/test.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/hooks`);

  rmfileIfExists(`${prefix}test-foo-bar/entities/index.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/entities/test.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/entities`);

  rmfileIfExists(`${prefix}test-foo-bar/sub-modules/index.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/sub-modules/test.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/sub-modules`);

  rmfileIfExists(`${prefix}test-foo-bar/services/index.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/services/test.ts`);
  rmdirIfExists(`${prefix}test-foo-bar/services`);

  rmfileIfExists(`${prefix}test-foo-bar/test-foo-bar.module.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/index.ts`);
  rmfileIfExists(`${prefix}test-foo-bar/test.ts`);

  rmdirIfExists(`${prefix}test-foo-bar`);
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

  describe('should render the root templates', () => {

    function test(prefix = '') {
      createModule({ name: 'test-fooBar', log: false });

      let expected = readFileFromTemplatesSpec('module/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/index.ts`);
      expect(actual).to.equal(expected);

      expected = readFileFromTemplatesSpec('module/test-foo-bar.module.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/test-foo-bar.module.ts`);
      expect(actual).to.equal(expected);

      expected = readFileFromTemplatesSpec('module/test.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/test.ts`);
      expect(actual).to.equal(expected);

    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/sub-modules', false);
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules', false);
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the controllers templates.', () => {

    function test(prefix = '') {
      createModule({ name: 'test-fooBar', log: false });

      let expected = readFileFromTemplatesSpec('module/controllers/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/controllers/index.ts`);
      expect(actual).to.equal(expected);

      expected = readFileFromTemplatesSpec('module/controllers/test.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/controllers/test.ts`);
      expect(actual).to.equal(expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/sub-modules', false);
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules', false);
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the hooks templates.', () => {

    function test(prefix = '') {
      createModule({ name: 'test-fooBar', log: false });

      let expected = readFileFromTemplatesSpec('module/hooks/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/hooks/index.ts`);
      expect(actual).to.equal(expected);

      expected = readFileFromTemplatesSpec('module/hooks/test.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/hooks/test.ts`);
      expect(actual).to.equal(expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/sub-modules', false);
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules', false);
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the entities templates.', () => {

    function test(prefix = '') {
      createModule({ name: 'test-fooBar', log: false });

      let expected = readFileFromTemplatesSpec('module/entities/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/entities/index.ts`);
      expect(actual).to.equal(expected);

      expected = readFileFromTemplatesSpec('module/entities/test.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/entities/test.ts`);
      expect(actual).to.equal(expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/sub-modules', false);
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules', false);
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the sub-modules templates.', () => {

    function test(prefix = '') {
      createModule({ name: 'test-fooBar', log: false });

      let expected = readFileFromTemplatesSpec('module/sub-modules/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/sub-modules/index.ts`);
      expect(actual).to.equal(expected);

      expected = readFileFromTemplatesSpec('module/sub-modules/test.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/sub-modules/test.ts`);
      expect(actual).to.equal(expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/sub-modules', false);
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules', false);
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the services templates.', () => {

    function test(prefix = '') {
      createModule({ name: 'test-fooBar', log: false });

      let expected = readFileFromTemplatesSpec('module/services/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/services/index.ts`);
      expect(actual).to.equal(expected);

      expected = readFileFromTemplatesSpec('module/services/test.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/services/test.ts`);
      expect(actual).to.equal(expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/sub-modules', false);
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules', false);
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

  describe('should render the templates templates.', () => {

    function test(prefix = '') {
      createModule({ name: 'test-fooBar', log: false });

      let expected = readFileFromTemplatesSpec('module/controllers/templates/index.1.ts');
      let actual = readFileFromRoot(`${prefix}test-foo-bar/controllers/templates/index.ts`);
      expect(actual).to.equal(expected);

      expected = readFileFromTemplatesSpec('module/controllers/templates/test.1.ts');
      actual = readFileFromRoot(`${prefix}test-foo-bar/controllers/templates/test.ts`);
      expect(actual).to.equal(expected);
    }

    it('in src/app/sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/sub-modules', false);
      test('src/app/sub-modules/');
    });

    it('in sub-modules/ if the directory exists.', () => {
      mkdirIfNotExists('sub-modules', false);
      test('sub-modules/');
    });

    it('in the current directory otherwise.', () => {
      test();
    });

  });

});
