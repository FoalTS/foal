// std
import { strictEqual } from 'assert';

// FoalTS
import { IAppController } from '../app.controller.interface';
import { Config } from '../config';
import { Context, HttpResponse, HttpResponseCreated, HttpResponseOK, isHttpResponseInternalServerError } from '../http';
import { ServiceManager } from '../service-manager';
import { getResponse } from './get-response';
import { Route } from './route.interface';

describe('getResponse', () => {

  class AppController implements IAppController {}

  function createRoute(route: Partial<Route>): Route {
    return {
      controller: { fn: () => new HttpResponseOK() },
      hooks: [],
      httpMethod: 'GET',
      path: '/',
      propertyKey: 'fn',
      ...route,
    };
  }

  let ctx: Context;
  let services: ServiceManager;
  let appController: IAppController;

  beforeEach(() => {
    ctx = new Context({});
    services = new ServiceManager();
    appController = new AppController();

    Config.set('settings.logErrors', false);
  });

  afterEach(() => Config.remove('settings.logErrors'));

  it('should execute the hooks, controller method and post functions in the right order.', async () => {
    let order = '';

    const route = createRoute({
      controller: {
        fn: () => {
          order += '4';
          return new HttpResponseOK();
        }
      },
      hooks: [
        () => { order = '1'; },
        () => {
          order += '2';
          return () => order += '6';
        },
        // The two "async" are required to test async hooks and async post-hooks.
        async () => {
          order += '3';
          return async () => {
            await Promise.resolve(1);
            order += '5';
          };
        },
      ],
    });

    await getResponse(route, ctx, services, appController);

    strictEqual(order, '123456');
  });

  it('should call the hooks with the proper context and service manager.', async () => {
    let actualCtx: Context|undefined;
    let actualServices: ServiceManager|undefined;

    const route = createRoute({
      hooks: [
        (ctx: Context, services: ServiceManager) => {
          actualCtx = ctx;
          actualServices = services;
        },
      ]
    });

    await getResponse(route, ctx, services, appController);

    strictEqual(actualCtx, ctx);
    strictEqual(actualServices, services);
  });

  it('should call the controller method with the proper context and request.', async () => {
    let actualCtx: Context|undefined;
    let actualRequest: Request|undefined;

    const route = createRoute({
      controller: {
        fn: (ctx: Context, request: Request) => {
          actualCtx = ctx;
          actualRequest = request;
          return new HttpResponseOK();
        }
      },
    });

    ctx = new Context({
      body: { foo: 'bar' },
      params: { id: 'xxx' }
    });

    await getResponse(route, ctx, services, appController);

    strictEqual(actualCtx, ctx);
    strictEqual(actualRequest, ctx.request);
  });

  context('given a hook returns an HttpResponse object', () => {

    let route: Route;
    let order: string;
    let controllerCalled: boolean;
    let response: HttpResponse;
    let postFunctionResponse: HttpResponse;

    beforeEach(() => {
      order = '';
      controllerCalled = false;
      response = new HttpResponseCreated();

      route = createRoute({
        controller: {
          fn: () => {
            controllerCalled = true;
            return new HttpResponseOK();
          }
        },
        hooks: [
          () => response => { postFunctionResponse = response; },
          async () => {
            order = '1';
            return response;
          },
          () => {
            order += '2';
          },
          () => {
            order += '3';
          },
        ]
      });
    });

    it('should return this response.', async () => {
      const actual = await getResponse(route, ctx, services, appController);

      strictEqual(actual, response);
    });

    it('should not execute the remaining hooks.', async () => {
      await getResponse(route, ctx, services, appController);

      strictEqual(order, '1');
    });

    it('should not execute the controller method.', async () => {
      await getResponse(route, ctx, services, appController);

      strictEqual(controllerCalled, false);
    });

    it('should call the post hook functions with this response.', async () => {
      await getResponse(route, ctx, services, appController);

      strictEqual(postFunctionResponse, response);
    });

  });

  context('given a hook throws an error', () => {

    let route: Route;
    let order: string;
    let controllerCalled: boolean;
    let error: Error;
    let postFunctionResponse: HttpResponse;

    beforeEach(() => {
      order = '';
      controllerCalled = false;
      error = new Error('Error thrown in hook.');

      route = createRoute({
        controller: {
          fn: () => {
            controllerCalled = true;
            return new HttpResponseOK();
          }
        },
        hooks: [
          () => response => { postFunctionResponse = response; },
          () => {
            order = '1';
            throw error;
          },
          () => {
            order += '2';
          },
          () => {
            order += '3';
          },
        ]
      });
    });

    it('should convert the error to a response and return it.', async () => {
      const response = await getResponse(route, ctx, services, appController);

      if (!isHttpResponseInternalServerError(response)) {
        throw new Error('An HttpResponseInternalServerError instance should have been returned.');
      }

      strictEqual(response.error, error);
      strictEqual(response.ctx, ctx);
    });

    it('should not execute the remaining hooks.', async () => {
      await getResponse(route, ctx, services, appController);

      strictEqual(order, '1');
    });

    it('should not execute the controller method.', async () => {
      await getResponse(route, ctx, services, appController);

      strictEqual(controllerCalled, false);
    });

    it('should convert the error and use it in post functions.', async () => {
      await getResponse(route, ctx, services, appController);

      if (!isHttpResponseInternalServerError(postFunctionResponse)) {
        throw new Error('An HttpResponseInternalServerError instance should have been used.');
      }

      strictEqual(postFunctionResponse.error, error);
      strictEqual(postFunctionResponse.ctx, ctx);
    });

  });

  context('given no hook returns an HttpReponse object or throws an error', () => {

    context('given the controller method returns an HttpResponse object', () => {

      let route: Route;
      let response: HttpResponse;
      let postFunctionResponse: HttpResponse;

      beforeEach(() => {
        response = new HttpResponseCreated();

        route = createRoute({
          controller: {
            fn: async () => {
              return response;
            }
          },
          hooks: [
            () => response => { postFunctionResponse = response; },
          ]
        });
      });

      it('should return this response.', async () => {
        const actual = await getResponse(route, ctx, services, appController);

        strictEqual(actual, response);
      });

      it('should call the post hook functions with this response.', async () => {
        await getResponse(route, ctx, services, appController);

        strictEqual(postFunctionResponse, response);
      });

    });

    context('given the controller method does not return an HttpResponse object', () => {

      let route: Route;
      let postFunctionResponse: HttpResponse;

      beforeEach(() => {
        route = createRoute({
          controller: {
            fn: () => {}
          },
          hooks: [
            () => response => { postFunctionResponse = response; },
          ]
        });
      });

      it('should create an error, convert it to a response and return it.', async () => {
        const response = await getResponse(route, ctx, services, appController);

        if (!isHttpResponseInternalServerError(response)) {
          throw new Error('An HttpResponseInternalServerError instance should have been returned.');
        }

        strictEqual(response.error?.message, 'The controller method "fn" should return an HttpResponse.');
        strictEqual(response.ctx, ctx);
      });

      it('should create an error, convert it to a response and use it in post functions.', async () => {
        await getResponse(route, ctx, services, appController);

        if (!isHttpResponseInternalServerError(postFunctionResponse)) {
          throw new Error('An HttpResponseInternalServerError instance should have been used.');
        }

        strictEqual(postFunctionResponse.error?.message, 'The controller method "fn" should return an HttpResponse.');
        strictEqual(postFunctionResponse.ctx, ctx);
      });

    });

    context('given the controller method throws an error', () => {

      let route: Route;
      let error: Error;
      let postFunctionResponse: HttpResponse;

      beforeEach(() => {
        error = new Error('Error thrown in hook.');

        route = createRoute({
          controller: {
            fn: () => {
              throw error;
            }
          },
          hooks: [
            () => response => { postFunctionResponse = response; },
          ]
        });
      });

      it('should convert the error to a response and return it.', async () => {
        const response = await getResponse(route, ctx, services, appController);

        if (!isHttpResponseInternalServerError(response)) {
          throw new Error('An HttpResponseInternalServerError instance should have been returned.');
        }

        strictEqual(response.error, error);
        strictEqual(response.ctx, ctx);
      });

      it('should convert the error to a response and use it in post functions.', async () => {
        await getResponse(route, ctx, services, appController);

        if (!isHttpResponseInternalServerError(postFunctionResponse)) {
          throw new Error('An HttpResponseInternalServerError instance should have been used.');
        }

        strictEqual(postFunctionResponse.error, error);
        strictEqual(postFunctionResponse.ctx, ctx);
      });

    });

    context('given a hook post function throws an error', () => {

      let route: Route;
      let error: Error;
      let postFunctionResponse: HttpResponse;

      beforeEach(() => {
        error = new Error('Error thrown in hook.');

        route = createRoute({
          hooks: [
            () => response => { postFunctionResponse = response; },
            () => () => { throw error; },
          ]
        });
      });

      it('should convert the error to a response and return it.', async () => {
        const response = await getResponse(route, ctx, services, appController);

        if (!isHttpResponseInternalServerError(response)) {
          throw new Error('An HttpResponseInternalServerError instance should have been returned.');
        }

        strictEqual(response.error, error);
        strictEqual(response.ctx, ctx);
      });

      it('should convert the error to a response and use it in the next post functions.', async () => {
        await getResponse(route, ctx, services, appController);

        if (!isHttpResponseInternalServerError(postFunctionResponse)) {
          throw new Error('An HttpResponseInternalServerError instance should have been used.');
        }

        strictEqual(postFunctionResponse.error, error);
        strictEqual(postFunctionResponse.ctx, ctx);
      });

    });

  });

});
