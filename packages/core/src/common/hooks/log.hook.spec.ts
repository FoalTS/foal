import { expect } from 'chai';

import { Context, getHookFunction, ServiceManager } from '../../core';
import { Log } from './log.hook';

describe('Log', () => {

  it('should log the message with the given log function.', () => {
    let called = false;
    const logFn = msg => called = true;
    const hook = getHookFunction(Log('foo', logFn));

    const ctx = new Context({});
    hook(ctx, new ServiceManager());

    expect(called).to.equal(true);
  });

});
