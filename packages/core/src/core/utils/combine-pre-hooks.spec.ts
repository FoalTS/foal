import { expect } from 'chai';

import { Context } from '../contexts';
import { HttpResponseOK } from '../http';
import { PreHook } from '../interfaces';
import { ServiceManager } from '../service-manager';
import { combinePreHooks } from './combine-pre-hooks';

describe('combinePreHooks', () => {

  it('should return a pre-hook that executes the given sync or async pre-hooks in the right order.', async () => {
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

    const preHook: PreHook = combinePreHooks([ hook1, hook2, hook3, hook4 ]);

    const ctx = new Context();
    ctx.state.foo = '';

    await preHook(ctx, new ServiceManager());

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

    const preHook: PreHook = combinePreHooks([ hook1, hook2, hook3, hook4 ]);

    const ctx = new Context();
    ctx.state.foo = '';

    const actual = await preHook(ctx, new ServiceManager());

    expect(ctx.state.foo).to.equal('abc');
    expect(actual).to.equal(httpResponse);
  });

});
