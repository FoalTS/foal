// 3p
import { Class } from '@foal/core';

// FoalTS
import { WebsocketContext } from './websocket-context';
import { WebsocketErrorResponse, WebsocketResponse } from './websocket-responses';

export interface IWebsocketController {
  subControllers?: Class<IWebsocketController>[];
  [key: string]: any;
}

export interface ISocketIOController extends IWebsocketController {
  handleError?(error: Error, ctx: WebsocketContext):
    WebsocketResponse | WebsocketErrorResponse |
    Promise<WebsocketResponse | WebsocketErrorResponse>;
}