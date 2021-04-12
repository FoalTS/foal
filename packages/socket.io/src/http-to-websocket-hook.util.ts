// 3p
import { Context, getHookFunction, HookDecorator, isHttpResponseClientError, isHttpResponseServerError } from '@foal/core';
import * as cookie from 'cookie';

// FoalTS
import { WebsocketHook, WebsocketHookDecorator } from './websocket-hooks';
import { WebsocketErrorResponse } from './websocket-responses';

export function HttpToWebsocketHook(httpHook: HookDecorator): WebsocketHookDecorator {
  return WebsocketHook(async (ctx, services) => {
    const httpHookFunction = getHookFunction(httpHook);

    const req = ctx.socket.request;

    if (!(req as any).cookies) {
      const cookies = req.headers.cookie;
      (req as any).cookies = cookies ? cookie.parse(cookies) : {};
    }

    if (!(req as any).get) {
      (req as any).get = function header(name: string) {
        const key = name.toLowerCase();

        switch (key) {
          case 'referer':
          case 'referrer':
            return this.headers.referrer
              || this.headers.referer;
          default:
            return this.headers[key];
        }
      }
    }

    const httpCtx = new Context(req);
    httpCtx.session = ctx.session;
    httpCtx.state = ctx.state;
    httpCtx.user = ctx.user;

    const response = await httpHookFunction(httpCtx, services);

    if (isHttpResponseClientError(response) || isHttpResponseServerError(response)) {
      return new WebsocketErrorResponse({
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        body: response.body
      })
    }

    if (response) {
      throw new Error(
        'HttpToWebsocketHook only supports hooks that return HttpResponseClientError '
        + `or HttpResponseServerError objects. Got an ${response.constructor.name}.`
      );
    }
  });
}