import { createEmptyContext, ServiceManager } from '@foal/core';
import { expect } from 'chai';
import { afterThatLog } from './after-that-log.post-hook';

describe('afterThatLog(message: string, logFn = console.log)', () => {

  it('should log the message with the given log function.', () => {
    let called = false;
    const logFn = msg => called = true;
    const hook = afterThatLog('foo', logFn);

    const ctx = createEmptyContext();
    hook(ctx, new ServiceManager());

    expect(called).to.equal(true);
  });

});
