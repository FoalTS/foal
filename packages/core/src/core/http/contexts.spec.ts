import { expect } from 'chai';

import { Context, PostContext } from './contexts';

describe('Context', () => {

  it('should instantiate with suitable properties.', () => {
    const request = {};
    const actual = new Context(request);
    expect(actual.request).to.be.equal(request);
    expect(actual.response).to.equal(undefined);
    expect(actual.state).to.deep.equal({});
    expect(actual.user).to.equal(undefined);
  });

});

describe('PostContext', () => {

  it('should inherit from Context.', () => {
    const ctx = new PostContext({});
    expect(ctx).to.be.an.instanceOf(Context);
  });

});
