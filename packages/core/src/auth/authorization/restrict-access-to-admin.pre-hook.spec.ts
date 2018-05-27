import { expect } from 'chai';

import {
  Context,
  HttpResponse,
  HttpResponseForbidden,
  HttpResponseUnauthorized,
  PreHook,
  ServiceManager,
} from '../../core';
import { AbstractUser } from '../models';
import { restrictAccessToAdmin } from './restrict-access-to-admin.pre-hook';

describe('restrictAccessToAdmin', () => {

  let hook: PreHook;

  class User extends AbstractUser {}

  before(() => {
    hook = restrictAccessToAdmin();
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context();
    const actual = hook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should return an HttpResponseForbidden if the user is not an admin.', () => {
    const ctx = new Context();
    ctx.user = new User();
    const actual = hook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseForbidden);

    const ctx2 = new Context();
    ctx.user = new User();
    ctx.user.roles = [];
    const actual2 = hook(ctx2, new ServiceManager());
    expect(actual2).to.be.instanceOf(HttpResponseForbidden);
  });

  it('should not return any HttpResponse if the user is authenticated and is an admin.', () => {
    const ctx = new Context();
    ctx.user = new User();
    ctx.user.roles = [ 'admin' ];
    const actual = hook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
