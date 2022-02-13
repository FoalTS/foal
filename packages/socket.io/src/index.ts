/**
 * FoalTS
 * Copyright(c) 2017-2022 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

export {
  EventName,
  ISocketIOController,
  IWebsocketController,
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
export { ValidatePayload } from './utils';
export { renderWebsocketError } from './errors';
export { SocketIOController } from './socketio-controller.service';
export { WsServer } from './ws-server.service';