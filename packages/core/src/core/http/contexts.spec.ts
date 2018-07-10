import { expect } from 'chai';

import { Context, PostContext } from './contexts';

describe('Context', () => {

  it('should instantiate with suitable properties.', () => {
    const request = {};
    const actual = new Context(request);
    expect(actual.request).to.be.equal(request);
    expect(actual.state).to.deep.equal({});
    expect(actual.user).to.equal(undefined);
  });

});

describe('PostContext', () => {

  it('should inherit from Context.', () => {
    const ctx = new PostContext({});
    expect(ctx).to.be.an.instanceOf(Context);
  });

  it('should has a response property whose value is undefined.', () => {
    const ctx = new PostContext({});
    expect(ctx.hasOwnProperty('response')).to.equal(true);
    expect(ctx.response).to.equal(undefined);
  });

});
