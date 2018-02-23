import { expect } from 'chai';

import { Hook } from '../interfaces';
import { combineHooks } from './combine-hooks';
import { createEmptyContext } from '../testing';
import { ServiceManager } from '../classes/service-manager';
import { HttpResponseOK } from '../classes/http-responses';

describe('combineHooks', () => {

  it('should return a hook that executes the given sync or async hooks in the right order.', async () => {
    const hook1 = ctx => {
      ctx.state.foo += 'a';
    };
    const hook2 = async ctx => {
      ctx.state.foo += 'b';
    };
    const hook3 = ctx => {
      ctx.state.foo += 'c';
    };
    const hook4 = async ctx => {
      ctx.state.foo += 'd';
    };

    const hook: Hook = combineHooks([ hook1, hook2, hook3, hook4 ]);

    const ctx = createEmptyContext();
    ctx.state.foo = '';

    await hook(ctx, new ServiceManager());

    expect(ctx.state.foo).to.equal('abcd');
  });

  it('should break the execution of the hooks and return an HttpResponse if a hook returns one.', async () => {
    const httpResponse = new HttpResponseOK();
    const hook1 = ctx => {
      ctx.state.foo += 'a';
    };
    const hook2 = async ctx => {
      ctx.state.foo += 'b';
    };
    const hook3 = ctx => {
      ctx.state.foo += 'c';
      return httpResponse;
    };
    const hook4 = async ctx => {
      ctx.state.foo += 'd';
    };

    const hook: Hook = combineHooks([ hook1, hook2, hook3, hook4 ]);

    const ctx = createEmptyContext();
    ctx.state.foo = '';

    const actual = await hook(ctx, new ServiceManager());

    expect(ctx.state.foo).to.equal('abc');
    expect(actual).to.equal(httpResponse);
  });

});
