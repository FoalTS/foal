// 3p
import { expect } from 'chai';
import 'reflect-metadata';

// FoalTS
import { combinePreHooks, Hook, HookFunction } from './hooks';
import { Context, HttpResponseOK } from './http';
import { PreHook } from './interfaces';
import { ServiceManager } from './service-manager';

describe('Hook', () => {

  const hook1: HookFunction = () => {};
  const hook2: HookFunction = () => {};

  it('should add the hook to the metadata hooks on the method class.', () => {
    class Foobar {
      @Hook(hook1)
      @Hook(hook2)
      barfoo() {}
    }

    const actual = Reflect.getMetadata('hooks', Foobar.prototype, 'barfoo');
    expect(actual).to.deep.equal([ hook1, hook2 ]);
  });

  it('should add the hook to the metadata hooks on the class.', () => {
    @Hook(hook1)
    @Hook(hook2)
    class Foobar {}

    const actual = Reflect.getMetadata('hooks', Foobar);
    expect(actual).to.deep.equal([ hook1, hook2 ]);
  });

});

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
