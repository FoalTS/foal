import { expect } from 'chai';

import { PostContext, ServiceManager } from '../../core';
import { afterThatLog } from './after-that-log.post-hook';

describe('afterThatLog', () => {

  it('should log the message with the given log function.', () => {
    let called = false;
    const logFn = msg => called = true;
    const hook = afterThatLog('foo', logFn);

    const ctx = new PostContext();
    hook(ctx, new ServiceManager());

    expect(called).to.equal(true);
  });

});
