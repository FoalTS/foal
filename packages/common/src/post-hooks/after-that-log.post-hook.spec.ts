import { createEmptyPostContext, ServiceManager } from '@foal/core';
import { expect } from 'chai';

import { afterThatLog } from './after-that-log.post-hook';

describe('afterThatLog', () => {

  it('should log the message with the given log function.', () => {
    let called = false;
    const logFn = msg => called = true;
    const hook = afterThatLog('foo', logFn);

    const ctx = createEmptyPostContext();
    hook(ctx, new ServiceManager());

    expect(called).to.equal(true);
  });

});
