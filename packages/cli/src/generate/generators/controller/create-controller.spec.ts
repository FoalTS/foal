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
import { createController } from './create-controller';

describe('createController', () => {

  afterEach(() => {
    rmfileIfExists('src/app/controllers/test-foo-bar.controller.ts');
    rmdirIfExists('src/app/controllers');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('controllers/test-foo-bar.controller.ts');
    rmdirIfExists('controllers');

    rmfileIfExists('test-foo-bar.controller.ts');
  });

  describe('should render the empty templates', () => {

    it('in src/app/controllers/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/controllers', false);

      createController({ name: 'test-fooBar', type: 'Empty' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.empty.ts');
      const actual = readFileFromRoot('src/app/controllers/test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

    it('in controllers/ if the directory exists.', () => {
      mkdirIfNotExists('controllers', false);

      createController({ name: 'test-fooBar', type: 'Empty' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.empty.ts');
      const actual = readFileFromRoot('controllers/test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

    it('in the current directory otherwise.', () => {

      createController({ name: 'test-fooBar', type: 'Empty' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.empty.ts');
      const actual = readFileFromRoot('test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

  });

  describe('should render the REST templates.', () => {

    it('in src/app/controllers/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/controllers', false);

      createController({ name: 'test-fooBar', type: 'REST' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.rest.ts');
      const actual = readFileFromRoot('src/app/controllers/test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

    it('in controllers/ if the directory exists.', () => {
      mkdirIfNotExists('controllers', false);

      createController({ name: 'test-fooBar', type: 'REST' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.rest.ts');
      const actual = readFileFromRoot('controllers/test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

    it('in the current directory otherwise.', () => {

      createController({ name: 'test-fooBar', type: 'REST' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.rest.ts');
      const actual = readFileFromRoot('test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

  });

  describe('should render the GraphQL templates.', () => {

    it('in src/app/controllers/ if the directory exists.', () => {
      mkdirIfNotExists('src', false);
      mkdirIfNotExists('src/app', false);
      mkdirIfNotExists('src/app/controllers', false);

      createController({ name: 'test-fooBar', type: 'GraphQL' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.graphql.ts');
      const actual = readFileFromRoot('src/app/controllers/test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

    it('in controllers/ if the directory exists.', () => {
      mkdirIfNotExists('controllers', false);

      createController({ name: 'test-fooBar', type: 'GraphQL' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.graphql.ts');
      const actual = readFileFromRoot('controllers/test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

    it('in the current directory otherwise.', () => {

      createController({ name: 'test-fooBar', type: 'GraphQL' });

      const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.graphql.ts');
      const actual = readFileFromRoot('test-foo-bar.controller.ts');
      expect(actual).to.equal(expected);

    });

  });

});
