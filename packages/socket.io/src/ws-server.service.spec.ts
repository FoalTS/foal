import { doesNotThrow, strictEqual, throws } from 'assert';
import { Server } from 'socket.io';
import { WsServer } from './ws-server.service';

describe('WsServer', () => {

  let wsServer: WsServer;

  beforeEach(() => wsServer = new WsServer());

  context('given the property "io" has not been assigned', () => {

    it('should throw an error when accessing the property.', () => {
      throws(
        () => wsServer.io,
        new Error('Impossible to access the io property. The server does not exist.')
      )
    });

    it('should not throw an error when calling the method "close".', () => {
      doesNotThrow(() => wsServer.close());
    })

  });

  context('given the property "io" has been assigned', () => {

    it('should return the property value when accessing it.', () => {
      const io = {} as Server;

      wsServer.io = io;

      strictEqual(wsServer.io, io)
    });

    it('should close the server when calling the method "close".', () => {
      let called = false;

      const io = {
        close: () => {
          called = true;
        }
      } as Server;

      wsServer.io = io;
      wsServer.close();

      strictEqual(called, true);
    });

  });

});