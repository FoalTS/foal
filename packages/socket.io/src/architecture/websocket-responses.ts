import { WebsocketContext } from './websocket-context';

/**
 * Returns a response to the socket.io client with an optional payload.
 *
 * @export
 * @class WebsocketResponse
 */
export class WebsocketResponse {
  constructor(public payload?: any) {}
}

/**
 * Returns an error response to the socket.io client with an optional payload.
 *
 * @export
 * @class WebsocketResponse
 */
export class WebsocketErrorResponse {
  readonly error?: Error;
  readonly ctx?: WebsocketContext;

  constructor(public payload?: any, options: { error?: Error, ctx?: WebsocketContext } = {}) {
    this.error = options.error;
    this.ctx = options.ctx;
  }
}