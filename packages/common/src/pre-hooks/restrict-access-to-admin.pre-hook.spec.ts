import {
  Context,
  HttpResponseForbidden,
  Hook,
  ServiceManager,
  HttpResponseUnauthorized,
  HttpResponse
} from '@foal/core';
import { expect } from 'chai';

import { restrictAccessToAdmin } from './restrict-access-to-admin.pre-hook';

describe('restrictAccessToAdmin', () => {

  let hook: Hook;
  let emptyContext: Context;

  before(() => {
    hook = restrictAccessToAdmin();
    emptyContext = {
      body: undefined,
      getHeader: (field: string): string => '',
      params: {},
      query: {},
      result: undefined,
      session: undefined,
      state: {},
      user: undefined
    };
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const actual = hook({
      ...emptyContext,
      user: undefined
    }, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should return an HttpResponseForbidden if the user is not an admin.', () => {
    const actual = hook({
      ...emptyContext,
      user: {}
    }, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseForbidden);
    const actual2 = hook({
      ...emptyContext,
      user: { isAdmin: false }
    }, new ServiceManager());
    expect(actual2).to.be.instanceOf(HttpResponseForbidden);
  });

  it('should not return any HttpResponse if the user is authenticated and is an admin.', () => {
    const actual = hook({
      ...emptyContext,
      user: { isAdmin: true }
    }, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
