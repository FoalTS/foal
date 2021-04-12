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
    ctx = new WebsocketContext('default event', {}, { request: { headers: {} } });
    services = new ServiceManager();
  });

  describe('should take an HTTP hook and return a Websocket hook that', () => {

    it('should add a "cookies" property to the handshake request when the cookie header exists.', async () => {
      let actualCtx: Context|undefined;
      const httpHook = Hook(ctx => {
        actualCtx = ctx;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const websocketContext = new WebsocketContext('default event', {}, {
        request: { headers: { cookie: 'foo=bar; equation=E%3Dmc%5E2' } }
      });

      await websocketHookFunction(websocketContext, services);

      deepStrictEqual(actualCtx?.request.cookies, { foo: 'bar', equation: 'E=mc^2' })
    });

    it('should add a "cookies" property to the handshake request when the cookie header does not exist.', async () => {
      let actualCtx: Context|undefined;
      const httpHook = Hook(ctx => {
        actualCtx = ctx;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const websocketContext = new WebsocketContext('default event', {}, {
        request: { headers: {} }
      });

      await websocketHookFunction(websocketContext, services);

      deepStrictEqual(actualCtx?.request.cookies, {});
    });

    it('should add a "get" method to the handshake request.', async () => {
      let actualCtx: Context|undefined;
      const httpHook = Hook(ctx => {
        actualCtx = ctx;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const websocketContext = new WebsocketContext('default event', {}, {
        request: { headers: { foo: 'bar', referer: 'foobar' } }
      });

      await websocketHookFunction(websocketContext, services);

      strictEqual(actualCtx?.request.get('Foo'), 'bar');
      strictEqual(actualCtx?.request.get('referrer'), 'foobar');

      const websocketContext2 = new WebsocketContext('default event', {}, {
        request: { headers: { foo: 'bar', referrer: 'foobar' } }
      });

      await websocketHookFunction(websocketContext2, services);

      strictEqual(actualCtx?.request.get('referer'), 'foobar');
    });

    it('should not add a "cookies" property to the handshake request if it already exists.', async () => {
      let actualCtx: Context|undefined;
      const httpHook = Hook(ctx => {
        actualCtx = ctx;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const cookies = { foo: 'bar' };
      const websocketContext = new WebsocketContext('default event', {}, {
        request: { headers: {}, cookies }
      });

      await websocketHookFunction(websocketContext, services);

      strictEqual(actualCtx?.request.cookies, cookies);
    });

    it('should not add a "get" property to the handshake request if it already exists.', async () => {
      let actualCtx: Context|undefined;
      const httpHook = Hook(ctx => {
        actualCtx = ctx;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const get = () => {};
      const websocketContext = new WebsocketContext('default event', {}, {
        request: { headers: {}, get }
      });

      await websocketHookFunction(websocketContext, services);

      strictEqual(actualCtx?.request.get, get);
    })

    it('should call the HTTP hook with the proper context.', async () => {
      let actualCtx: Context|undefined;
      const httpHook = Hook(ctx => {
        actualCtx = ctx;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const websocketContext = new WebsocketContext('default event', {}, {
        request: { headers: {}, foo: 'bar' }
      });
      websocketContext.session = new Session({} as any, {} as any, { exists: false });
      websocketContext.state = { bar: 'foo' };
      websocketContext.user = { id: 1 };

      await websocketHookFunction(websocketContext, services);

      const expectedCtx = new Context({ foo: 'bar' });
      expectedCtx.session = websocketContext.session;
      expectedCtx.state = websocketContext.state;
      expectedCtx.user = websocketContext.user;

      strictEqual(actualCtx?.request.foo, expectedCtx.request.foo);
      strictEqual(actualCtx?.session, expectedCtx.session);
      strictEqual(actualCtx?.state, expectedCtx.state);
      strictEqual(actualCtx?.user, expectedCtx.user);
    });

    it('should call the HTTP hook with the proper service manager.', async () => {
      let actualServices: ServiceManager|undefined;
      const httpHook = Hook((ctx, services) => {
        actualServices = services;
      });

      const websocketHookFunction = getWebsocketHookFunction(HttpToWebsocketHook(httpHook));

      const websocketContext = new WebsocketContext('default event', { foo: 'bar' }, { request: { headers: {} } });

      const services = new ServiceManager();
      await websocketHookFunction(websocketContext, services);

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