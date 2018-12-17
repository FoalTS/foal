// std
import { ok, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getHookFunction,
  HookFunction,
  HttpResponse,
  HttpResponseForbidden,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  ServiceManager,
} from '../../core';
import { UserWithPermissions, Permission } from '../entities';
import { PermissionRequired } from './permission-required.hook';

describe('PermissionRequired', () => {

  let preHook: HookFunction;

  class User extends UserWithPermissions {}

  before(() => {
    preHook = getHookFunction(PermissionRequired('bar'));
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context({});
    const actual = preHook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseUnauthorized);
  });

  it('should return an HttpResponseRedirect if the user is not authenticated'
      + ' and a redirect path was given.', () => {
    const preHook = getHookFunction(PermissionRequired('bar', { redirect: '/login' }));

    const ctx = new Context({});
    const actual = preHook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseRedirect);
    strictEqual((actual as HttpResponseRedirect).path, '/login');
  });

  it('should return an HttpResponseForbidden if the user does not have the required permission.', () => {
    const permission = new Permission();
    permission.name = '';
    permission.codeName = 'foo';

    const ctx = new Context({});
    ctx.user = new User();
    ctx.user.userPermissions = [ permission ];
    const actual = preHook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseForbidden);
  });

  it('should not return any HttpResponse if the user is authenticated and has the required permission.', () => {
    const permission = new Permission();
    permission.name = '';
    permission.codeName = 'bar';

    const ctx = new Context({});
    ctx.user = new User();
    ctx.user.userPermissions = [ permission ];
    const actual = preHook(ctx, new ServiceManager());
    strictEqual(actual instanceof HttpResponse, false);
  });

});
