import { expect } from 'chai';

import {
  Context,
  HttpResponse,
  HttpResponseUnauthorized,
  PreHook,
  ServiceManager,
} from '../../core';
import { AbstractUser } from '../models';
import { restrictAccessToAuthenticated } from './restrict-access-to-authenticated.pre-hook';

describe('restrictAccessToAuthenticated', () => {

  let preHook: PreHook;

  class User extends AbstractUser {}

  before(() => {
    preHook = restrictAccessToAuthenticated();
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context();
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should not return any HttpResponse if the user is authenticated.', () => {
    const ctx = new Context();
    ctx.user = new User();
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
