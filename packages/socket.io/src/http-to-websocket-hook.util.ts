// 3p
import { Context, getHookFunction, HookDecorator, isHttpResponseClientError, isHttpResponseServerError, ServiceManager } from '@foal/core';

// FoalTS
import { WebsocketHook, WebsocketHookDecorator } from './websocket-hooks';
import { WebsocketErrorResponse } from './websocket-responses';

export function HttpToWebsocketHook(httpHook: HookDecorator): WebsocketHookDecorator {
  return WebsocketHook(async (ctx, services) => {
    const httpHookFunction = getHookFunction(httpHook);

    const httpCtx = new Context({ body: ctx.payload });
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