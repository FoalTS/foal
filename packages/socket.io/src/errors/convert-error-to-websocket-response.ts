// 3p
import { Config } from '@foal/core';

// FoalTS
import { ISocketIOController, WebsocketContext, WebsocketErrorResponse, WebsocketResponse } from '../architecture';
import { renderWebsocketError } from './render-websocket-error';

export async function convertErrorToWebsocketResponse(
  error: Error, ctx: WebsocketContext, socketIOController: ISocketIOController, log = console.error
): Promise<WebsocketResponse | WebsocketErrorResponse> {
  if (Config.get('settings.logErrors', 'boolean', true)) {
    log(error.stack);
  }

  if (socketIOController.handleError) {
    try {
      return await socketIOController.handleError(error, ctx);
    } catch (error2) {
      return renderWebsocketError(error2, ctx);
    }
  }

  return renderWebsocketError(error, ctx);
}
