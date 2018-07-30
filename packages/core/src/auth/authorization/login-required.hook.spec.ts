import { expect } from 'chai';

import {
  Context,
  getHookFunction,
  HookFunction,
  HttpResponse,
  HttpResponseUnauthorized,
  ServiceManager,
} from '../../core';
import { AbstractUser } from '../entities';
import { LoginRequired } from './login-required.hook';

describe('LoginRequired', () => {

  let preHook: HookFunction;

  class User extends AbstractUser {}

  before(() => {
    preHook = getHookFunction(LoginRequired());
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context({});
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should not return any HttpResponse if the user is authenticated.', () => {
    const ctx = new Context({});
    ctx.user = new User();
    const actual = preHook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
