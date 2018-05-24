import {
  Context,
  HttpResponse,
  HttpResponseForbidden,
  HttpResponseUnauthorized,
  PreHook,
  ServiceManager,
} from '@foal/core';
import { expect } from 'chai';

import { restrictAccessToAdmin } from './restrict-access-to-admin.pre-hook';

describe('restrictAccessToAdmin', () => {

  let hook: PreHook;

  before(() => {
    hook = restrictAccessToAdmin();
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context();
    ctx.user = undefined;
    const actual = hook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should return an HttpResponseForbidden if the user is not an admin.', () => {
    const ctx = new Context();
    ctx.user = {};
    const actual = hook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseForbidden);

    const ctx2 = new Context();
    ctx.user = { isAdmin: false };
    const actual2 = hook(ctx2, new ServiceManager());
    expect(actual2).to.be.instanceOf(HttpResponseForbidden);
  });

  it('should not return any HttpResponse if the user is authenticated and is an admin.', () => {
    const ctx = new Context();
    ctx.user = { isAdmin: true };
    const actual = hook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
