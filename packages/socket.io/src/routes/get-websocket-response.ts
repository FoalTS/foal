// 3p
import { ServiceManager } from '@foal/core';

// FoalTS
import { WebsocketContext } from '../websocket-context';
import { WebsocketRoute } from './websocket-route.interface';
import { ISocketIOController } from './socketio-controller.interface';
import { WebsocketErrorResponse, WebsocketResponse } from '../websocket-responses';
import { WebsocketHookPostFunction } from '../websocket-hooks';
import { convertErrorToWebsocketResponse } from './convert-error-to-websocket-response';

export async function getWebsocketResponse(
  route: WebsocketRoute, ctx: WebsocketContext, services: ServiceManager, socketIOController: ISocketIOController
): Promise<undefined | WebsocketResponse | WebsocketErrorResponse> {
  let response: undefined | WebsocketResponse | WebsocketErrorResponse;

  const hookPostFunctions: WebsocketHookPostFunction[] = [];

  for (const hook of route.hooks) {
    let result: WebsocketResponse | WebsocketErrorResponse | WebsocketHookPostFunction | void;
    try {
      result = await hook(ctx, services);
    } catch (error) {
      result = await convertErrorToWebsocketResponse(error, ctx, socketIOController);
    }
    if ((result instanceof WebsocketResponse) || (result instanceof WebsocketErrorResponse)) {
      response = result;
      break;
    } else if (typeof result === 'function') {
      hookPostFunctions.unshift(result);
    }
  }

  if (!((response instanceof WebsocketResponse) || (response instanceof WebsocketErrorResponse))) {
    try {
    response = await route.controller[route.propertyKey](ctx, ctx.payload);
    } catch (error) {
      response = await convertErrorToWebsocketResponse(error, ctx, socketIOController);
    }
  }

  for (const postFn of hookPostFunctions) {
    try {
      await postFn(response);
    } catch (error) {
      response = await convertErrorToWebsocketResponse(error, ctx, socketIOController);
    }
  }

  return response;
}
