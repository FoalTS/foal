import {
  Context,
  createEmptyContext,
  PreHook,
  HttpResponse,
  HttpResponseForbidden,
  HttpResponseUnauthorized,
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
    const actual = hook({
      ...createEmptyContext(),
      user: undefined
    }, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should return an HttpResponseForbidden if the user is not an admin.', () => {
    const actual = hook({
      ...createEmptyContext(),
      user: {}
    }, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseForbidden);
    const actual2 = hook({
      ...createEmptyContext(),
      user: { isAdmin: false }
    }, new ServiceManager());
    expect(actual2).to.be.instanceOf(HttpResponseForbidden);
  });

  it('should not return any HttpResponse if the user is authenticated and is an admin.', () => {
    const actual = hook({
      ...createEmptyContext(),
      user: { isAdmin: true }
    }, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
