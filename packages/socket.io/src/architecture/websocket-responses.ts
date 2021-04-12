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
  constructor(public payload?: any) {}
}