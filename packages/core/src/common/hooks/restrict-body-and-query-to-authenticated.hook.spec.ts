import { expect } from 'chai';

import { AbstractUser } from '../../auth';
import { Context, getHookFunction, ServiceManager } from '../../core';
import { restrictBodyAndQueryToAuthenticated } from './restrict-body-and-query-to-authenticated.hook';

describe('restrictBodyAndQueryToAuthenticated', () => {

  class User extends AbstractUser {}

  it('should throw an Error if no user is authenticated.', () => {
    const preHook = getHookFunction(restrictBodyAndQueryToAuthenticated());
    const ctx = new Context({});

    expect(() => preHook(ctx, new ServiceManager()))
      .to.throw('No user is authenticated.');
  });

  it('should add the suitable userId to ctx.request.body if it is an object.', () => {
    const preHook = getHookFunction(restrictBodyAndQueryToAuthenticated());
    const ctx = new Context({});
    ctx.user = new User();
    ctx.user.id = 1;
    ctx.request.body = { foo: 'bar' };

    preHook(ctx, new ServiceManager());

    expect(ctx.request.body).to.deep.equal({ foo: 'bar', userId: 1 });
  });

  it('should leave ctx.body undefined is it is undefined.', () => {
    const preHook = getHookFunction(restrictBodyAndQueryToAuthenticated());
    const ctx = new Context({});
    ctx.user = new User();
    ctx.user.id = 1;

    preHook(ctx, new ServiceManager());

    expect(ctx.request.body).to.equal(undefined);
  });

  it('should add the suitable userId to ctx.state.query whether this object already '
      + 'exists or not.', () => {
    const preHook = getHookFunction(restrictBodyAndQueryToAuthenticated());
    const ctx = new Context({});
    ctx.user = new User();
    ctx.user.id = 1;

    preHook(ctx, new ServiceManager());
    expect(ctx.state.query).to.deep.equal({ userId: 1 });

    ctx.state.query = { foo: 'bar' };

    preHook(ctx, new ServiceManager());
    expect(ctx.state.query).to.deep.equal({ foo: 'bar', userId: 1 });
  });

});
