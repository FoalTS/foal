// 3p
import { Context, Hook, HttpResponseBadRequest, HttpResponseInternalServerError, HttpResponseRedirect, ServiceManager, Session } from '@foal/core';
import { deepStrictEqual, rejects, strictEqual } from 'assert';
import { HttpToWebsocketHook } from './http-to-websocket-hook.util';

// FoalTS
import { WebsocketContext } from './websocket-context';
import { getWebsocketHookFunction } from './websocket-hooks';
import { WebsocketErrorResponse } from './websocket-responses';

describe('HttpToWebsocketHook', () => {

  let ctx: WebsocketContext;
  let services: ServiceManager;

  beforeEach(() => {
    ctx = new WebsocketContext('default event', {});
    services = new ServiceManager();
  });

  describe('should take an HTTP hook and return a Websocket hook that', () => {

    it('should call the HTTP hook with the proper context.', () => {
      let actualCtx: Context|undefined;
      const httpHook = Hook(ctx => {
        actualCtx = ctx;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const websocketContext = new WebsocketContext('default event', { foo: 'bar' });
      websocketContext.session = new Session({} as any, {} as any, { exists: false });
      websocketContext.state = { bar: 'foo' };
      websocketContext.user = { id: 1 };

      websocketHookFunction(websocketContext, services);

      const expectedCtx = new Context({ body: { foo: 'bar' } });
      expectedCtx.session = websocketContext.session;
      expectedCtx.state = websocketContext.state;
      expectedCtx.user = websocketContext.user;

      deepStrictEqual(actualCtx, expectedCtx);
    });

    it('should call the HTTP hook with the proper service manager.', () => {
      let actualServices: ServiceManager|undefined;
      const httpHook = Hook((ctx, services) => {
        actualServices = services;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const websocketContext = new WebsocketContext('default event', { foo: 'bar' });

      const services = new ServiceManager();
      websocketHookFunction(websocketContext, services);

      strictEqual(actualServices, services);
    });

    context('given the given HTTP hook returns undefined', () => {

      it('should return undefined.', async () => {
        const httpHook = Hook(() => {});

        const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

        const response = await websocketHookFunction(ctx, services);

        strictEqual(response, undefined);
      });

    });

    context('given the given HTTP hook returns a HttpResponseClientError object', () => {

      it('should return a WebsocketErrorResponse object.', async () => {
        const httpResponse = new HttpResponseBadRequest({ foo: 'bar' });
        const httpHook = Hook(async () => httpResponse);

        const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

        const response = await websocketHookFunction(ctx, services);

        deepStrictEqual(response, new WebsocketErrorResponse({
          statusCode: httpResponse.statusCode,
          statusMessage: httpResponse.statusMessage,
          body: httpResponse.body,
        }));
      });

    });

    context('given the given HTTP hook returns a HttpResponseServerError object', () => {

      it('should return a WebsocketErrorResponse object.', async () => {
        const httpResponse = new HttpResponseInternalServerError({ foo: 'bar' });
        const httpHook = Hook(async () => httpResponse);

        const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

        const response = await websocketHookFunction(ctx, services);

        deepStrictEqual(response, new WebsocketErrorResponse({
          statusCode: httpResponse.statusCode,
          statusMessage: httpResponse.statusMessage,
          body: httpResponse.body,
        }));
      });

    });

    context('given the given HTTP hook returns a HttpResponse object which is not 4xx or 5xx', () => {

      it('should throw an error.', async () => {
        const httpResponse = new HttpResponseRedirect('/foo');
        const httpHook = Hook(async () => httpResponse);

        const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

        console.log(HttpResponseRedirect.name);

        await rejects(
          () => websocketHookFunction(ctx, services),
          new Error(
            'HttpToWebsocketHook only supports hooks that return'
            + ' HttpResponseClientError or HttpResponseServerError objects. Got an HttpResponseRedirect.'
          )
        );
      });

    });

  });
});