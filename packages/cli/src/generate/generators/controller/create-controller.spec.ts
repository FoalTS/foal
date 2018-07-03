// 3p
import { expect } from 'chai';

// FoalTS
import { readFileFromRoot, readFileFromTemplatesSpec, rmfileIfExists } from '../../utils';
import { createController } from './create-controller';

describe('createController', () => {

  it('should render the empty templates.', () => {

    createController({ name: 'test-fooBar', type: 'Empty' });

    const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.empty.ts');
    const actual = readFileFromRoot('test-foo-bar.controller.ts');
    expect(actual).to.equal(expected);

    rmfileIfExists('test-foo-bar.controller.ts');

  });

  it('should render the REST templates.', () => {

    createController({ name: 'test-fooBar', type: 'REST' });

    const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.rest.ts');
    const actual = readFileFromRoot('test-foo-bar.controller.ts');
    expect(actual).to.equal(expected);

    rmfileIfExists('test-foo-bar.controller.ts');

  });

  it('should render the GraphQL templates.', () => {

    createController({ name: 'test-fooBar', type: 'GraphQL' });

    const expected = readFileFromTemplatesSpec('controller/test-foo-bar.controller.graphql.ts');
    const actual = readFileFromRoot('test-foo-bar.controller.ts');
    expect(actual).to.equal(expected);

    rmfileIfExists('test-foo-bar.controller.ts');

  });

});
