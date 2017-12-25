import { createEmptyContext, getPreMiddleware, ServiceManager } from '@foal/core';
import { expect } from 'chai';
import { log } from './log.pre-hook';

describe('log(message: string, logFn = console.log)', () => {

  it('should log the message with the given log function.', () => {
    let called = false;
    const logFn = msg => called = true;
    const middleware = getPreMiddleware(log('foo', logFn));
    const ctx = createEmptyContext();

    middleware(ctx, new ServiceManager());

    expect(called).to.equal(true);
  });

});
