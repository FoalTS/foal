// std
import { ok, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getHookFunction,
  HookFunction,
  HttpResponse,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  ServiceManager,
} from '../core';
import { AbstractUser } from './entities';
import { LoginRequired } from './login-required.hook';

describe('LoginRequired', () => {

  let preHook: HookFunction;

  class User extends AbstractUser {}

  beforeEach(() => {
    preHook = getHookFunction(LoginRequired());
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated'
      + ' and no redirect path was given.', () => {
    const ctx = new Context({});
    const actual = preHook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseUnauthorized);
  });

  it('should return an HttpResponseRedirect if the user is not authenticated'
      + ' and a redirect path was given.', () => {
    preHook = getHookFunction(LoginRequired({ redirect: '/login' }));

    const ctx = new Context({});
    const actual = preHook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseRedirect);
    strictEqual((actual as HttpResponseRedirect).path, '/login');
  });

  it('should not return any HttpResponse if the user is authenticated.', () => {
    const ctx = new Context({});
    ctx.user = new User();
    const actual = preHook(ctx, new ServiceManager());
    strictEqual(actual instanceof HttpResponse, false);
  });

});
