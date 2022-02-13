import { Server } from 'socket.io';

export class WsServer {

  private server: Server|undefined;

  get io(): Server {
    if (!this.server) {
      throw new Error('Impossible to access the io property. The server does not exist.');
    }
    return this.server;
  }

  set io(server: Server) {
    this.server = server;
  }

  close(): void {
    if (this.server) {
      this.server.close();
    }
  }

}