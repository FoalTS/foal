// std
import { deepStrictEqual, ok, strictEqual, throws } from 'assert';

// FoalTS
import {
  Context,
  getApiResponses,
  getHookFunction,
  HookFunction,
  HttpResponse,
  HttpResponseForbidden,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  IApiResponses,
  ServiceManager,
} from '../../../core';
import { PermissionRequired } from './permission-required.hook';
import { IUserWithPermissions } from './user-with-permissions.interface';

describe('PermissionRequired', () => {

  let hook: HookFunction;

  class User implements IUserWithPermissions {
    constructor(private readonly permissions: string[]) {}

    hasPerm(codeName: string): boolean {
      return this.permissions.includes(codeName);
    }
  }

  before(() => {
    hook = getHookFunction(PermissionRequired('bar'));
  });

  it('should return an HttpResponseUnauthorized if the user is not authenticated.', () => {
    const ctx = new Context({});
    const actual = hook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseUnauthorized);
  });

  it('should return an HttpResponseRedirect if the user is not authenticated'
      + ' and a redirect path was given.', () => {
    const preHook = getHookFunction(PermissionRequired('bar', { redirect: '/login' }));

    const ctx = new Context({});
    const actual = preHook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseRedirect);
    strictEqual((actual as HttpResponseRedirect).path, '/login');
  });

  it('should throw an error if the user instance does NOT have a "hasPerm" method.', () => {
    const ctx = new Context({});
    ctx.user = {};

    throws(
      () => hook(ctx, new ServiceManager()),
      new Error('ctx.user does not have a "hasPerm" method. Are you sure it implements the IUserWithPermissions interface?')
    );
  });

  it('should return an HttpResponseForbidden if the user does not have the required permission.', () => {
    const permission = 'foo';

    const ctx = new Context({});
    ctx.user = new User([ permission ]);

    const actual = hook(ctx, new ServiceManager());
    ok(actual instanceof HttpResponseForbidden);
  });

  it('should not return any HttpResponse if the user is authenticated and has the required permission.', () => {
    const permission = 'bar';

    const ctx = new Context({});
    ctx.user = new User([ permission ]);

    const actual = hook(ctx, new ServiceManager());
    strictEqual(actual instanceof HttpResponse, false);
  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false', () => {
      @PermissionRequired('bar', { openapi: false })
      class Foobar {}

      strictEqual(getApiResponses(Foobar), undefined);
    });

    context('given options.redirect is not defined', () => {

      it('with the proper API responses', () => {
        @PermissionRequired('bar')
        class Foobar {}

        const expected: IApiResponses = {
          401: {
            description: 'Unauthenticated request.'
          },
          403: {
            description: 'Permission denied.'
          }
        };

        deepStrictEqual(getApiResponses(Foobar), expected);
      });

    });

    context('given options.redirect is defined', () => {

      it('with the proper API responses', () => {
        @PermissionRequired('bar', { redirect: '/login' })
        class Foobar {}

        const expected: IApiResponses = {
          302: {
            description: 'Unauthenticated request.'
          },
          403: {
            description: 'Permission denied.'
          }
        };

        deepStrictEqual(getApiResponses(Foobar), expected);
      });

    });

  });

});
