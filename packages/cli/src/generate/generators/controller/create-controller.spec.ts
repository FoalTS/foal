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
import { createController } from './create-controller';

describe('createController', () => {

  afterEach(() => {
    rmfileIfExists('src/app/controllers/test-foo-bar.controller.ts');
    rmfileIfExists('src/app/controllers/test-foo-bar.controller.spec.ts');
    rmfileIfExists('src/app/controllers/index.ts');
    rmdirIfExists('src/app/controllers');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('controllers/test-foo-bar.controller.ts');
    rmfileIfExists('controllers/test-foo-bar.controller.spec.ts');
    rmfileIfExists('controllers/index.ts');
    rmdirIfExists('controllers');

    rmfileIfExists('test-foo-bar.controller.ts');
    rmfileIfExists('test-foo-bar.controller.spec.ts');
    rmfileIfExists('index.ts');
  });

  const indexInitialContent = 'export { BarFooController } from \'./bar-foo.controller\';\n';

  describe('should render the empty templates', () => {

    it('in src/app/controllers/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/controllers');
      writeFileSync('src/app/controllers/index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'Empty' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.empty.ts');
      let actual = readFileFromRoot('src/app/controllers/test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      const expected2 = readFileFromTemplatesSpec('controller/test-foo-bar.controller.spec.empty.ts');
      const actual2 = readFileFromRoot('src/app/controllers/test-foo-bar.controller.spec.ts');
      strictEqual(actual2, expected2);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('src/app/controllers/index.ts');
      strictEqual(actual, expected);
    });

    it('in controllers/ if the directory exists.', () => {
      mkdirIfNotExists('controllers');
      writeFileSync('controllers/index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'Empty' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.empty.ts');
      let actual = readFileFromRoot('controllers/test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      const expected2 = readFileFromTemplatesSpec('controller/test-foo-bar.controller.spec.empty.ts');
      const actual2 = readFileFromRoot('controllers/test-foo-bar.controller.spec.ts');
      strictEqual(actual2, expected2);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('controllers/index.ts');
      strictEqual(actual, expected);
    });

    it('in the current directory otherwise.', () => {
      writeFileSync('index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'Empty' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.empty.ts');
      let actual = readFileFromRoot('test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      const expected2 = readFileFromTemplatesSpec('controller/test-foo-bar.controller.spec.empty.ts');
      const actual2 = readFileFromRoot('test-foo-bar.controller.spec.ts');
      strictEqual(actual2, expected2);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('index.ts');
      strictEqual(actual, expected);
    });

  });

  describe('should render the REST templates.', () => {

    it('in src/app/controllers/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/controllers');
      writeFileSync('src/app/controllers/index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'REST' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.rest.ts');
      let actual = readFileFromRoot('src/app/controllers/test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('src/app/controllers/index.ts');
      strictEqual(actual, expected);
    });

    it('in controllers/ if the directory exists.', () => {
      mkdirIfNotExists('controllers');
      writeFileSync('controllers/index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'REST' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.rest.ts');
      let actual = readFileFromRoot('controllers/test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('controllers/index.ts');
      strictEqual(actual, expected);
    });

    it('in the current directory otherwise.', () => {
      writeFileSync('index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'REST' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.rest.ts');
      let actual = readFileFromRoot('test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('index.ts');
      strictEqual(actual, expected);
    });

  });

  describe('should render the GraphQL templates.', () => {

    it('in src/app/controllers/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/controllers');
      writeFileSync('src/app/controllers/index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'GraphQL' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.graphql.ts');
      let actual = readFileFromRoot('src/app/controllers/test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('src/app/controllers/index.ts');
      strictEqual(actual, expected);
    });

    it('in controllers/ if the directory exists.', () => {
      mkdirIfNotExists('controllers');
      writeFileSync('controllers/index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'GraphQL' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.graphql.ts');
      let actual = readFileFromRoot('controllers/test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('controllers/index.ts');
      strictEqual(actual, expected);
    });

    it('in the current directory otherwise.', () => {
      writeFileSync('index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'GraphQL' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.graphql.ts');
      let actual = readFileFromRoot('test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('index.ts');
      strictEqual(actual, expected);
    });

  });

  describe('should render the Login templates.', () => {

    it('in src/app/controllers/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/controllers');
      writeFileSync('src/app/controllers/index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'Login' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.login.ts');
      let actual = readFileFromRoot('src/app/controllers/test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('src/app/controllers/index.ts');
      strictEqual(actual, expected);
    });

    it('in controllers/ if the directory exists.', () => {
      mkdirIfNotExists('controllers');
      writeFileSync('controllers/index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'Login' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.login.ts');
      let actual = readFileFromRoot('controllers/test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('controllers/index.ts');
      strictEqual(actual, expected);
    });

    it('in the current directory otherwise.', () => {
      writeFileSync('index.ts', indexInitialContent, 'utf8');

      createController({ name: 'test-fooBar', type: 'Login' });

      let expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.login.ts');
      let actual = readFileFromRoot('test-foo-bar.controller.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('controller/index.1.ts');
      actual = readFileFromRoot('index.ts');
      strictEqual(actual, expected);
    });

  });

});
