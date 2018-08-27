// FoalTS
import {
  rmdirIfExists,
  rmfileIfExists,
  TestEnvironment
} from '../../utils';
import { createService } from './create-service';

describe('createService', () => {

  afterEach(() => {
    rmfileIfExists('src/app/services/test-foo-bar.service.ts');
    rmfileIfExists('src/app/services/test-foo-bar-collection.service.ts');
    rmfileIfExists('src/app/services/test-foo-bar-resolver.service.ts');
    rmfileIfExists('src/app/services/index.ts');
    rmdirIfExists('src/app/services');
    rmdirIfExists('src/app');
    // We cannot remove src/ since the generator code lives within. This is bad testing
    // approach.
    // rmdirIfExists('src');

    rmfileIfExists('services/test-foo-bar.service.ts');
    rmfileIfExists('services/test-foo-bar-collection.service.ts');
    rmfileIfExists('services/test-foo-bar-resolver.service.ts');
    rmfileIfExists('services/index.ts');
    rmdirIfExists('services');

    rmfileIfExists('test-foo-bar.service.ts');
    rmfileIfExists('test-foo-bar-collection.service.ts');
    rmfileIfExists('test-foo-bar-resolver.service.ts');
    rmfileIfExists('index.ts');

  });

  function test(root: string) {

    describe(`when the directory ${root}/ exists`, () => {

      const testEnv = new TestEnvironment('service', root);

      beforeEach(() => {
        testEnv.mkRootDirIfDoesNotExist();
        testEnv.copyFileFromMocks('index.ts');
      });

      it('should render the authenticator templates in the proper directory.', () => {
        createService({ name: 'test-fooBar', type: 'Authenticator' });

        testEnv
          .validateSpec('test-foo-bar.service.authenticator.ts', 'test-foo-bar.service.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the email-authenticator templates in the proper directory.', () => {
        createService({ name: 'test-fooBar', type: 'EmailAuthenticator' });

        testEnv
          .validateSpec('test-foo-bar.service.email-authenticator.ts', 'test-foo-bar.service.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the empty templates in the proper directory.', () => {
        createService({ name: 'test-fooBar', type: 'Empty' });

        testEnv
          .validateSpec('test-foo-bar.service.empty.ts', 'test-foo-bar.service.ts')
          .validateSpec('index.ts', 'index.ts');
      });

      it('should render the entity-resource-collection templates in the proper directory.', () => {
        createService({ name: 'test-fooBar', type: 'EntityResourceCollection' });

        testEnv
          .validateSpec('test-foo-bar.service.entity-resource-collection.ts', 'test-foo-bar-collection.service.ts')
          .validateSpec('index.collection.ts', 'index.ts');
      });

      it('should render the graphql-resolver templates in the proper directory.', () => {
        createService({ name: 'test-fooBar', type: 'GraphQLResolver' });

        testEnv
          .validateSpec('test-foo-bar.service.graphql-resolver.ts', 'test-foo-bar-resolver.service.ts')
          .validateSpec('index.resolver.ts', 'index.ts');
      });

      it('should render the resource-collection templates in the proper directory.', () => {
        createService({ name: 'test-fooBar', type: 'ResourceCollection' });

        testEnv
          .validateSpec('test-foo-bar.service.resource-collection.ts', 'test-foo-bar-collection.service.ts')
          .validateSpec('index.collection.ts', 'index.ts');
      });

    });

  }

  test('src/app/services');
  test('services');
  test('');

});
