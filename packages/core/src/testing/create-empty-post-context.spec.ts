import { expect } from 'chai';

import { createEmptyPostContext } from './create-empty-post-context';

describe('createEmptyPostContext', () => {

  it('should create an empty context.', () => {
    const actual = createEmptyPostContext();

    expect(actual.body).to.equal(undefined);
    expect(actual.params).to.deep.equal({});
    expect(actual.query).to.deep.equal({});
    expect(actual.response).to.equal(undefined);
    expect(actual.session).to.equal(undefined);
    expect(actual.state).to.deep.equal({});
    expect(actual.user).to.equal(null);
  });

});
