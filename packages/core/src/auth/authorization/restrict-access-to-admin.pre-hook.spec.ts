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

  let preHook: PreHook;

  class User extends AbstractUser {}

  before(() => {
    preHook = restrictAccessToAdmin();
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context();
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should return an HttpResponseForbidden if the user is not an admin.', () => {
    const ctx = new Context();
    ctx.user = new User();
    ctx.user.roles = [];
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseForbidden);
  });

  it('should not return any HttpResponse if the user is authenticated and is an admin.', () => {
    const ctx = new Context();
    ctx.user = new User();
    ctx.user.roles = [ 'admin' ];
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
