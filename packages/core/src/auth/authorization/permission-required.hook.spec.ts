// std
import { ok, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getHookFunction,
  HookFunction,
  HttpResponse,
  HttpResponseForbidden,
  HttpResponseUnauthorized,
  ServiceManager,
} from '../../core';
import { AbstractUser, Permission } from '../entities';
import { PermissionRequired } from './permission-required.hook';

describe('PermissionRequired', () => {

  let preHook: HookFunction;

  class User extends AbstractUser {}

  before(() => {
    preHook = getHookFunction(PermissionRequired('bar'));
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context({});
    const actual = preHook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseUnauthorized);
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
