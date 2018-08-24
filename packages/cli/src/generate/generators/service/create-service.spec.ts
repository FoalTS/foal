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
import { createService } from './create-service';

describe('createService', () => {

  afterEach(() => {
    rmfileIfExists('src/app/services/test-foo-bar.service.ts');
    rmfileIfExists('src/app/services/index.ts');
    rmdirIfExists('src/app/services');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('services/test-foo-bar.service.ts');
    rmfileIfExists('services/index.ts');
    rmdirIfExists('services');

    rmfileIfExists('test-foo-bar.service.ts');
    rmfileIfExists('index.ts');

    rmfileIfExists('test-foo-bar-collection.service.ts');
    rmfileIfExists('test-foo-bar-resolver.service.ts');
  });

  const indexInitialContent = 'export { BarFoo } from \'./bar-foo.service\';\n';

  describe('should render the empty templates.', () => {

    it('in src/app/services/ if the directory exists.', () => {
      mkdirIfNotExists('src');
      mkdirIfNotExists('src/app');
      mkdirIfNotExists('src/app/services');
      writeFileSync('src/app/services/index.ts', indexInitialContent, 'utf8');

      createService({ name: 'test-fooBar', type: 'Empty' });

      let expected = readFileFromTemplatesSpec('service/test-foo-bar.service.empty.ts');
      let actual = readFileFromRoot('src/app/services/test-foo-bar.service.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('service/index.1.ts');
      actual = readFileFromRoot('src/app/services/index.ts');
      strictEqual(actual, expected);
    });

    it('in services/ if the directory exists.', () => {
      mkdirIfNotExists('services');
      writeFileSync('services/index.ts', indexInitialContent, 'utf8');

      createService({ name: 'test-fooBar', type: 'Empty' });

      let expected = readFileFromTemplatesSpec('service/test-foo-bar.service.empty.ts');
      let actual = readFileFromRoot('services/test-foo-bar.service.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('service/index.1.ts');
      actual = readFileFromRoot('services/index.ts');
      strictEqual(actual, expected);
    });

    it('in the current directory otherwise.', () => {
      writeFileSync('index.ts', indexInitialContent, 'utf8');

      createService({ name: 'test-fooBar', type: 'Empty' });

      let expected = readFileFromTemplatesSpec('service/test-foo-bar.service.empty.ts');
      let actual = readFileFromRoot('test-foo-bar.service.ts');
      strictEqual(actual, expected);

      expected = readFileFromTemplatesSpec('service/index.1.ts');
      actual = readFileFromRoot('index.ts');
      strictEqual(actual, expected);
    });

  });

  it('should render the resource collection templates.', () => {
    writeFileSync('index.ts', indexInitialContent, 'utf8');

    createService({ name: 'test-fooBar', type: 'ResourceCollection' });

    let expected = readFileFromTemplatesSpec('service/test-foo-bar.service.resource-collection.ts');
    let actual = readFileFromRoot('test-foo-bar-collection.service.ts');
    strictEqual(actual, expected);

    expected = readFileFromTemplatesSpec('service/index.collection.ts');
    actual = readFileFromRoot('index.ts');
    strictEqual(actual, expected);
  });

  it('should render the entity resource collection templates.', () => {
    writeFileSync('index.ts', indexInitialContent, 'utf8');

    createService({ name: 'test-fooBar', type: 'EntityResourceCollection' });

    let expected = readFileFromTemplatesSpec('service/test-foo-bar.service.entity-resource-collection.ts');
    let actual = readFileFromRoot('test-foo-bar-collection.service.ts');
    strictEqual(actual, expected);

    expected = readFileFromTemplatesSpec('service/index.collection.ts');
    actual = readFileFromRoot('index.ts');
    strictEqual(actual, expected);
  });

  it('should render the graphql templates.', () => {
    writeFileSync('index.ts', indexInitialContent, 'utf8');

    createService({ name: 'test-fooBar', type: 'GraphQLResolver' });

    let expected = readFileFromTemplatesSpec('service/test-foo-bar.service.graphql-resolver.ts');
    let actual = readFileFromRoot('test-foo-bar-resolver.service.ts');
    strictEqual(actual, expected);

    expected = readFileFromTemplatesSpec('service/index.resolver.ts');
    actual = readFileFromRoot('index.ts');
    strictEqual(actual, expected);
  });

  it('should render the authenticator templates.', () => {
    writeFileSync('index.ts', indexInitialContent, 'utf8');

    createService({ name: 'test-fooBar', type: 'Authenticator' });

    let expected = readFileFromTemplatesSpec('service/test-foo-bar.service.authenticator.ts');
    let actual = readFileFromRoot('test-foo-bar.service.ts');
    strictEqual(actual, expected);

    expected = readFileFromTemplatesSpec('service/index.1.ts');
    actual = readFileFromRoot('index.ts');
    strictEqual(actual, expected);
  });

  it('should render the email authenticator templates.', () => {
    writeFileSync('index.ts', indexInitialContent, 'utf8');

    createService({ name: 'test-fooBar', type: 'EmailAuthenticator' });

    let expected = readFileFromTemplatesSpec('service/test-foo-bar.service.email-authenticator.ts');
    let actual = readFileFromRoot('test-foo-bar.service.ts');
    strictEqual(actual, expected);

    expected = readFileFromTemplatesSpec('service/index.1.ts');
    actual = readFileFromRoot('index.ts');
    strictEqual(actual, expected);
  });

});
