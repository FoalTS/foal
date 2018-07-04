// 3p
import { expect } from 'chai';

// FoalTS
import { readFileFromRoot, readFileFromTemplatesSpec, rmfileIfExists } from '../../utils';
import { createService } from './create-service';

describe('createService', () => {

  afterEach(() => {
    rmfileIfExists('test-foo-bar.service.ts');
    rmfileIfExists('test-foo-bar-serializer.service.ts');
    rmfileIfExists('test-foo-bar-resolver.service.ts');
  });

  it('should render the empty templates.', () => {

    createService({ name: 'test-fooBar', type: 'Empty' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.empty.ts');
    const actual = readFileFromRoot('test-foo-bar.service.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the serializer templates.', () => {

    createService({ name: 'test-fooBar', type: 'Serializer' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.serializer.ts');
    const actual = readFileFromRoot('test-foo-bar-serializer.service.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the model serializer templates.', () => {

    createService({ name: 'test-fooBar', type: 'ModelSerializer' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.model-serializer.ts');
    const actual = readFileFromRoot('test-foo-bar-serializer.service.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the model graphql templates.', () => {

    createService({ name: 'test-fooBar', type: 'GraphQLResolver' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.graphql-resolver.ts');
    const actual = readFileFromRoot('test-foo-bar-resolver.service.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the model authenticator templates.', () => {

    createService({ name: 'test-fooBar', type: 'Authenticator' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.authenticator.ts');
    const actual = readFileFromRoot('test-foo-bar.service.ts');
    expect(actual).to.equal(expected);

  });

  it('should render the model email authenticator templates.', () => {

    createService({ name: 'test-fooBar', type: 'EmailAuthenticator' });

    const expected = readFileFromTemplatesSpec('service/test-foo-bar.service.email-authenticator.ts');
    const actual = readFileFromRoot('test-foo-bar.service.ts');
    expect(actual).to.equal(expected);

  });

});
