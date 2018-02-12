import { createEmptyContext, getPreMiddleware, ServiceManager } from '@foal/core';
import { expect } from 'chai';

import { fromSessionToState } from './from-session-to-state.pre-hook';

describe('fromSessionToState', () => {

  it('should do something.', () => {
    const middleware = getPreMiddleware(fromSessionToState('foobar'));
    const ctx = createEmptyContext();
    ctx.session = { foobar: 'barfoo' };

    middleware(ctx, new ServiceManager());

    expect(ctx.state.foobar).to.equal('barfoo');
  });
});
