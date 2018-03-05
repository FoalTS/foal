import {
  createEmptyContext,
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
    const actual = hook({
      ...createEmptyContext(),
      user: undefined
    }, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should not return any HttpResponse if the user is authenticated.', () => {
    const actual = hook({
      ...createEmptyContext(),
      user: {}
    }, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
