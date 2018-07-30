import { expect } from 'chai';

import { Context } from './contexts';

describe('Context', () => {

  it('should instantiate with suitable properties.', () => {
    const request = {};
    const actual = new Context(request);
    expect(actual.request).to.be.equal(request);
    expect(actual.state).to.deep.equal({});
    expect(actual.user).to.equal(undefined);
  });

});
