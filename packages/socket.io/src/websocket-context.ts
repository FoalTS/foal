// 3p
import { Socket } from 'socket.io';
import { Session } from '@foal/core';

export class WebsocketContext<User = any, ContextSession = Session | undefined, ContextState = any> {
  state: ContextState = {} as ContextState;
  user: User;
  session: ContextSession;
  socket: Socket;

  constructor(public eventName: string, public payload: any, socket: any = {}) {
    this.socket = socket;
  }
}