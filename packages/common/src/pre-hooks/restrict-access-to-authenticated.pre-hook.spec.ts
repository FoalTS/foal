import {
  Context,
  Hook,
  ServiceManager,
  HttpResponseUnauthorized,
  HttpResponse
} from '@foal/core';
import { expect } from 'chai';

import { restrictAccessToAuthenticated } from './restrict-access-to-authenticated.pre-hook';

describe('restrictAccessToAuthenticated', () => {

  let hook: Hook;
  let emptyContext: Context;

  before(() => {
    hook = restrictAccessToAuthenticated();
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

  it('should not return any HttpResponse if the user is authenticated.', () => {
    const actual = hook({
      ...emptyContext,
      user: {}
    }, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
