import { expect } from 'chai';

import { postHook, preHook } from '../factories';
import { Hook, Middleware } from '../interfaces';
import { getPostMiddleware } from './get-post-middleware';

describe('getPostMiddleware', () => {

  it('should return the post-middleware of the given post-hook.', () => {
    const middleware: Middleware = ctx => {};
    const hook: Hook = postHook(middleware);

    const actual = getPostMiddleware(hook);

    expect(actual).to.equal(middleware);
  });

  it('should throw an Error if the given hook is not a post-hook.', () => {
    const middleware: Middleware = ctx => {};
    const hook: Hook = preHook(middleware);

    expect(() => getPostMiddleware(hook)).to.throw();
  });

});
