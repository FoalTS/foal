// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getApiResponses,
  getHookFunction,
  HookFunction,
  IApiResponses,
  isHttpResponseRedirect,
  isHttpResponseUnauthorized,
  ServiceManager
} from '../../../core';
import { UserRequired } from './user-required.hook';

describe('UserRequired', () => {

  let hook: HookFunction;
  let ctx: Context;
  let services: ServiceManager;

  beforeEach(() => {
    ctx = new Context({});
    services = new ServiceManager();
  });

  context('given options.redirectTo is not defined', () => {

    beforeEach(() => hook = getHookFunction(UserRequired()));

    context('given Context.user is null', () => {

      beforeEach(() => ctx.user = null);

      it('should return an HttpResponseUnauthorized instance.', () => {
        const response = hook(ctx, services);
        if (!isHttpResponseUnauthorized(response)) {
          throw new Error('The hook should have returned an HttpResponseUnauthorized instance.');
        }
      });

    });

    context('given Context.user is defined and not null', () => {

      beforeEach(() => ctx.user = {});

      it('should NOT return an HttpResponse instance.', () => {
        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

    });

  });

  context('given options.redirectTo is defined', () => {

    const path = '/foo';

    beforeEach(() => hook = getHookFunction(UserRequired({ redirectTo: path })));

    context('given Context.user is null', () => {

      beforeEach(() => ctx.user = null);

      it('should return an HttpResponseRedirect instance.', () => {
        const response = hook(ctx, services);
        if (!isHttpResponseRedirect(response)) {
          throw new Error('The hook should have returned an HttpResponseRedirect instance.');
        }
        strictEqual(response.path, path);
      });

    });

    context('given Context.user is defined and not null', () => {

      beforeEach(() => ctx.user = {});

      it('should NOT return an HttpResponse instance.', () => {
        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

    });

  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false', () => {
      @UserRequired({ openapi: false })
      class Foobar {}

      strictEqual(getApiResponses(Foobar), undefined);
    });

    context('given options.redirectTo is not defined', () => {

      it('with the proper API responses', () => {
        @UserRequired()
        class Foobar {}

        const expected: IApiResponses = {
          401: {
            description: 'Unauthenticated request.'
          }
        };

        deepStrictEqual(getApiResponses(Foobar), expected);
      });

    });

    context('given options.redirectTo is defined', () => {

      it('with the proper API responses', () => {
        @UserRequired({ redirectTo: '/foo' })
        class Foobar {}

        const expected: IApiResponses = {
          302: {
            description: 'Unauthenticated request.'
          }
        };

        deepStrictEqual(getApiResponses(Foobar), expected);
      });

    });

  });

});
