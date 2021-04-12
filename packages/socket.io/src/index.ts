/**
 * FoalTS
 * Copyright(c) 2017-2021 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

export {
  EventName,
  WebsocketContext,
  MergeWebsocketHooks,
  WebsocketHook,
  WebsocketHookDecorator,
  WebsocketHookFunction,
  WebsocketHookPostFunction,
  getWebsocketHookFunction,
  getWebsocketHookFunctions,
  WebsocketResponse,
  WebsocketErrorResponse,
  wsController
} from './architecture';
export { HttpToWebsocketHook, ValidatePayload } from './utils';
export { renderWebsocketError } from './errors';
export { SocketIOController } from './socketio-controller.service';