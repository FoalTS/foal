// 3p
import { Socket } from 'socket.io';
import { Session } from '@foal/core';

/**
 * Class instanciated on each WebSocket request. It includes:
 * - the socket object,
 * - the event name,
 * - the request payload,
 * - the user object if available,
 * - the session object if available,
 * - and a `state` object that can be used to pass data across several hooks.
 *
 * @export
 * @class WebsocketContext
 * @template User
 * @template ContextSession
 * @template ContextState
 */
export class WebsocketContext<User = { [key: string]: any } | null, ContextSession = Session | null, ContextState = { [key: string]: any }> {
  socket: Socket;

  user: User;
  session: ContextSession;
  state: ContextState;


  /**
   * Creates an instance of WebsocketContext.
   * @param {string} eventName The event name.
   * @param {*} payload The request payload.
   * @param {*} [socket={}] Either the socket object or a mock (for testing).
   * @memberof WebsocketContext
   */
  constructor(public eventName: string, public payload: any, socket: any = {}) {
    this.socket = socket;

    this.user = null as any;
    this.session = null as any;
    this.state = {} as any;
  }
}