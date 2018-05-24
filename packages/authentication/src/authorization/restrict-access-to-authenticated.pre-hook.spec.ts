import {
  Context,
  HttpResponse,
  HttpResponseUnauthorized,
  PreHook,
  ServiceManager,
} from '@foal/core';
import { expect } from 'chai';

import { restrictAccessToAuthenticated } from './restrict-access-to-authenticated.pre-hook';

describe('restrictAccessToAuthenticated', () => {

  let hook: PreHook;

  before(() => {
    hook = restrictAccessToAuthenticated();
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context();
    ctx.user = undefined;
    const actual = hook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should not return any HttpResponse if the user is authenticated.', () => {
    const ctx = new Context();
    ctx.user = {};
    const actual = hook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
