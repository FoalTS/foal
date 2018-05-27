import { expect } from 'chai';

import {
  Context,
  ServiceManager,
} from '../../classes';
import {
  HttpResponse,
  HttpResponseUnauthorized,
} from '../../http';
import {
  PreHook,
} from '../../interfaces';
import { AbstractUser } from '../models';
import { restrictAccessToAuthenticated } from './restrict-access-to-authenticated.pre-hook';

describe('restrictAccessToAuthenticated', () => {

  let hook: PreHook;

  class User extends AbstractUser {}

  before(() => {
    hook = restrictAccessToAuthenticated();
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context();
    const actual = hook(ctx, new ServiceManager());
    expect(actual).to.be.instanceOf(HttpResponseUnauthorized);
  });

  it('should not return any HttpResponse if the user is authenticated.', () => {
    const ctx = new Context();
    ctx.user = new User();
    const actual = hook(ctx, new ServiceManager());
    expect(actual).not.to.be.instanceOf(HttpResponse);
  });

});
