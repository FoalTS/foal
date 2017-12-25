import { expect } from 'chai';

import { createEmptyContext } from './create-empty-context';

describe('createEmptyContext', () => {

  it('should create an empty context.', () => {
    const actual = createEmptyContext();

    expect(actual.body).to.equal(undefined);
    expect(actual.params).to.deep.equal({});
    expect(actual.query).to.deep.equal({});
    expect(actual.result).to.equal(undefined);
    expect(actual.session).to.equal(undefined);
    expect(actual.state).to.deep.equal({});
    expect(actual.user).to.equal(undefined);
  });

});
