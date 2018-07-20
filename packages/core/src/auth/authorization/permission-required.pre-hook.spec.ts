import { expect } from 'chai';

import {
  Context,
  getHookFunction,
  HookFunction,
  HttpResponse,
  HttpResponseForbidden,
  HttpResponseUnauthorized,
  ServiceManager,
} from '../../core';
import { AbstractUser } from '../entities';
import { PermissionRequired } from './permission-required.pre-hook';

describe('PermissionRequired', () => {

  let preHook: HookFunction;

  class User extends AbstractUser {}

  before(() => {
    preHook = getHookFunction(PermissionRequired('bar'));
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context({});
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should return an HttpResponseForbidden if the user does not have the required permission.', () => {
    const ctx = new Context({});
    ctx.user = new User();
    ctx.user.permissions = [ 'foo' ];
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseForbidden);
  });

  it('should not return any HttpResponse if the user is authenticated and has the required permission.', () => {
    const ctx = new Context({});
    ctx.user = new User();
    ctx.user.permissions = [ 'bar' ];
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
