import { expect } from 'chai';

import { Context, ServiceManager } from '../../core';
import { log } from './log.pre-hook';

describe('log', () => {

  it('should log the message with the given log function.', () => {
    let called = false;
    const logFn = msg => called = true;
    const hook = log('foo', logFn);

    const ctx = new Context({});
    hook(ctx, new ServiceManager());

    expect(called).to.equal(true);
  });

});
