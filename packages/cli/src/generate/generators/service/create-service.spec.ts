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
import { createService } from './create-service';

describe('createService', () => {

  afterEach(() => {
    rmfileIfExists('src/app/services/test-foo-bar.service.ts');
    rmdirIfExists('src/app/services');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('services/test-foo-bar.service.ts');
    rmdirIfExists('services');

    rmfileIfExists('test-foo-bar.service.ts');

    rmfileIfExists('test-foo-bar-serializer.service.ts');
    rmfileIfExists('test-foo-bar-resolver.service.ts');
  });

  describe('should render the empty templates.', () => {

    it('in src/app/services/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/services');

      createService({ name: 'test-fooBar', type: 'Empty' });

      const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.empty.ts');
      const actual = readFileFromRoot('src/app/services/test-foo-bar.service.ts');
      strictEqual(actual, expected);

    });

    it('in services/ if the directory exists.', () => {
      mkdirIfNotExists('services');

      createService({ name: 'test-fooBar', type: 'Empty' });

      const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.empty.ts');
      const actual = readFileFromRoot('services/test-foo-bar.service.ts');
      strictEqual(actual, expected);

    });

    it('in the current directory otherwise.', () => {

      createService({ name: 'test-fooBar', type: 'Empty' });

      const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.empty.ts');
      const actual = readFileFromRoot('test-foo-bar.service.ts');
      strictEqual(actual, expected);

    });

  });

  it('should render the serializer templates.', () => {

    createService({ name: 'test-fooBar', type: 'Serializer' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.serializer.ts');
    const actual = readFileFromRoot('test-foo-bar-serializer.service.ts');
    strictEqual(actual, expected);

  });

  it('should render the entity serializer templates.', () => {

    createService({ name: 'test-fooBar', type: 'EntitySerializer' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.entity-serializer.ts');
    const actual = readFileFromRoot('test-foo-bar-serializer.service.ts');
    strictEqual(actual, expected);

  });

  it('should render the graphql templates.', () => {

    createService({ name: 'test-fooBar', type: 'GraphQLResolver' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.graphql-resolver.ts');
    const actual = readFileFromRoot('test-foo-bar-resolver.service.ts');
    strictEqual(actual, expected);

  });

  it('should render the authenticator templates.', () => {

    createService({ name: 'test-fooBar', type: 'Authenticator' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.authenticator.ts');
    const actual = readFileFromRoot('test-foo-bar.service.ts');
    strictEqual(actual, expected);

  });

  it('should render the email authenticator templates.', () => {

    createService({ name: 'test-fooBar', type: 'EmailAuthenticator' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.email-authenticator.ts');
    const actual = readFileFromRoot('test-foo-bar.service.ts');
    strictEqual(actual, expected);

  });

});
