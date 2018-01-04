import { expect } from 'chai';

import { postHook, preHook } from '../factories';
import { Hook, Middleware } from '../interfaces';
import { getPreMiddleware } from './get-pre-middleware';

describe('getPreMiddleware', () => {

  it('should return the pre-middleware of the given pre-hook.', () => {
    const middleware: Middleware = ctx => {};
    const hook: Hook = preHook(middleware);

    const actual = getPreMiddleware(hook);

    expect(actual).to.equal(middleware);
  });

  it('should throw an Error if the given hook is not a pre-hook.', () => {
    const middleware: Middleware = ctx => {};
    const hook: Hook = postHook(middleware);

    expect(() => getPreMiddleware(hook)).to.throw();
  });

});
