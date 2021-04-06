// std
import { strictEqual } from 'assert';

// 3p
import { Config, ServiceManager } from '@foal/core';

// FoalTS
import { getWebsocketResponse } from './get-websocket-response';
import { ISocketIOController } from './socketio-controller.interface';
import { WebsocketRoute } from './websocket-route.interface';
import { WebsocketErrorResponse, WebsocketResponse } from '../websocket-responses';
import { WebsocketContext } from '../websocket-context';

describe('getWebsocketResponse', () => {

  class SocketIOController implements ISocketIOController {}

  function createRoute(route: Partial<WebsocketRoute>): WebsocketRoute {
    return {
      controller: { fn: () => new WebsocketResponse() },
      hooks: [],
      eventName: 'default event',
      propertyKey: 'fn',
      ...route,
    };
  }

  let ctx: WebsocketContext;
  let services: ServiceManager;
  let appController: ISocketIOController;

  beforeEach(() => {
    ctx = new WebsocketContext('default event', {});
    services = new ServiceManager();
    appController = new SocketIOController();

    Config.set('settings.logErrors', false);
  });

  afterEach(() => Config.remove('settings.logErrors'));

  it('should execute the hooks, controller method and post functions in the right order.', async () => {
    let order = '';

    const route = createRoute({
      controller: {
        fn: () => {
          order += '4';
          return new WebsocketResponse();
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

    await getWebsocketResponse(route, ctx, services, appController);

    strictEqual(order, '123456');
  });

  it('should call the hooks with the proper context and service manager.', async () => {
    let actualCtx: WebsocketResponse|undefined;
    let actualServices: ServiceManager|undefined;

    const route = createRoute({
      hooks: [
        (ctx: WebsocketResponse, services: ServiceManager) => {
          actualCtx = ctx;
          actualServices = services;
        },
      ]
    });

    await getWebsocketResponse(route, ctx, services, appController);

    strictEqual(actualCtx, ctx);
    strictEqual(actualServices, services);
  });

  it('should call the controller method with the proper context and socket payload.', async () => {
    let actualCtx: WebsocketResponse|undefined;
    let actualPayload: any;

    const route = createRoute({
      controller: {
        fn: (ctx: WebsocketResponse, payload: any) => {
          actualCtx = ctx;
          actualPayload = payload;
          return new WebsocketResponse();
        }
      },
    });

    ctx = new WebsocketContext('default event', {
      foo: 'bar'
    });

    await getWebsocketResponse(route, ctx, services, appController);

    strictEqual(actualCtx, ctx);
    strictEqual(actualPayload, ctx.payload);
  });

  context('given a hook returns a WebsocketResponse object', () => {

    let route: WebsocketRoute;
    let order: string;
    let controllerCalled: boolean;
    let response: WebsocketResponse|WebsocketErrorResponse;
    let postFunctionResponse: WebsocketResponse|WebsocketErrorResponse|undefined;

    beforeEach(() => {
      order = '';
      controllerCalled = false;
      response = new WebsocketResponse();

      route = createRoute({
        controller: {
          fn: () => {
            controllerCalled = true;
            return new WebsocketResponse();
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
      const actual = await getWebsocketResponse(route, ctx, services, appController);

      strictEqual(actual, response);
    });

    it('should not execute the remaining hooks.', async () => {
      await getWebsocketResponse(route, ctx, services, appController);

      strictEqual(order, '1');
    });

    it('should not execute the controller method.', async () => {
      await getWebsocketResponse(route, ctx, services, appController);

      strictEqual(controllerCalled, false);
    });

    it('should call the post hook functions with this response.', async () => {
      await getWebsocketResponse(route, ctx, services, appController);

      strictEqual(postFunctionResponse, response);
    });

  });

  context('given a hook throws an error', () => {

    let route: WebsocketRoute;
    let order: string;
    let controllerCalled: boolean;
    let error: Error;
    let postFunctionResponse: WebsocketResponse|WebsocketErrorResponse|undefined;

    beforeEach(() => {
      order = '';
      controllerCalled = false;
      error = new Error('Error thrown in hook.');

      route = createRoute({
        controller: {
          fn: () => {
            controllerCalled = true;
            return new WebsocketResponse();
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

    beforeEach(() => Config.set('settings.debug', true));

    afterEach(() => Config.remove('settings.debug'));

    it('should convert the error to a response and return it.', async () => {
      const response = await getWebsocketResponse(route, ctx, services, appController);

      if (!(response instanceof WebsocketErrorResponse)) {
        throw new Error('An WebsocketErrorResponse instance should have been returned.');
      }

      strictEqual(response.payload.message, error.message);
    });

    it('should not execute the remaining hooks.', async () => {
      await getWebsocketResponse(route, ctx, services, appController);

      strictEqual(order, '1');
    });

    it('should not execute the controller method.', async () => {
      await getWebsocketResponse(route, ctx, services, appController);

      strictEqual(controllerCalled, false);
    });

    it('should convert the error and use it in post functions.', async () => {
      await getWebsocketResponse(route, ctx, services, appController);

      if (!(postFunctionResponse instanceof WebsocketErrorResponse)) {
        throw new Error('An WebsocketErrorResponse instance should have been used.');
      }

      strictEqual(postFunctionResponse.payload.message, error.message);
    });

  });

  context('given no hook returns an WebsocketResponse or WebsocketErrorResponse object or throws an error', () => {

    context('given the controller method returns an WebsocketResponse object', () => {

      let route: WebsocketRoute;
      let response: WebsocketResponse;
      let postFunctionResponse: WebsocketResponse|WebsocketErrorResponse|undefined;

      beforeEach(() => {
        response = new WebsocketResponse();

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
        const actual = await getWebsocketResponse(route, ctx, services, appController);

        strictEqual(actual, response);
      });

      it('should call the post hook functions with this response.', async () => {
        await getWebsocketResponse(route, ctx, services, appController);

        strictEqual(postFunctionResponse, response);
      });

    });

    context('given the controller method does not return a WebsocketResponse or a WebsocketErrorResponse object', () => {

      let route: WebsocketRoute;
      let postFunctionResponse: WebsocketResponse|WebsocketErrorResponse|undefined;
      let called = false;

      beforeEach(() => {
        route = createRoute({
          controller: {
            fn: () => {}
          },
          hooks: [
            () => response => {
              called = true;
              postFunctionResponse = response;
            },
          ]
        });
      });

      it('should return undefined.', async () => {
        const response = await getWebsocketResponse(route, ctx, services, appController);

        strictEqual(response, undefined)
      });

      it('should execute the remaining post functions.', async () => {
        await getWebsocketResponse(route, ctx, services, appController);

        strictEqual(called, true);
        strictEqual(postFunctionResponse, undefined);
      });

    });

    context('given the controller method throws an error', () => {

      let route: WebsocketRoute;
      let error: Error;
      let postFunctionResponse: WebsocketResponse|WebsocketErrorResponse|undefined;

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

      beforeEach(() => Config.set('settings.debug', true));

      afterEach(() => Config.remove('settings.debug'));

      it('should convert the error to a response and return it.', async () => {
        const response = await getWebsocketResponse(route, ctx, services, appController);

        if (!(response instanceof WebsocketErrorResponse)) {
          throw new Error('An WebsocketErrorResponse instance should have been returned.');
        }

        strictEqual(response.payload.message, error.message);
      });

      it('should convert the error to a response and use it in post functions.', async () => {
        await getWebsocketResponse(route, ctx, services, appController);

        if (!(postFunctionResponse instanceof WebsocketErrorResponse)) {
          throw new Error('An HttpResponseInternalServerError instance should have been used.');
        }

        strictEqual(postFunctionResponse.payload.message, error.message);
      });

    });

    context('given a hook post function throws an error', () => {

      let route: WebsocketRoute;
      let error: Error;
      let postFunctionResponse: WebsocketResponse|WebsocketErrorResponse|undefined;

      beforeEach(() => {
        error = new Error('Error thrown in hook.');

        route = createRoute({
          hooks: [
            () => response => { postFunctionResponse = response; },
            () => () => { throw error; },
          ]
        });
      });

      beforeEach(() => Config.set('settings.debug', true));

      afterEach(() => Config.remove('settings.debug'));

      it('should convert the error to a response and return it.', async () => {
        const response = await getWebsocketResponse(route, ctx, services, appController);

        if (!(response instanceof WebsocketErrorResponse)) {
          throw new Error('An WebsocketErrorResponse instance should have been returned.');
        }

        strictEqual(response.payload.message, error.message);
      });

      it('should convert the error to a response and use it in the next post functions.', async () => {
        await getWebsocketResponse(route, ctx, services, appController);

        if (!(postFunctionResponse instanceof WebsocketErrorResponse)) {
          throw new Error('An HttpResponseInternalServerError instance should have been used.');
        }

        strictEqual(postFunctionResponse.payload.message, error.message);
      });

    });

  });

});
