// std
import * as http from 'http';
import { AddressInfo } from 'net';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { EventName, SocketIOController, WebsocketContext, WebsocketResponse } from '@foal/socket.io';
import { closeConnections, createConnections } from './common';

describe('Feature: Grouping clients in rooms', () => {

  let socket: ReturnType<typeof io>;
  let socket2: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;
  let controller: SocketIOController;

  afterEach(async () => {
    if (socket2) {
      socket2.disconnect();
    }
    await closeConnections({ httpServer, socket, controller });
  })

  it('Example: Simple example.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class WebsocketController extends SocketIOController {

      onConnection(ctx: WebsocketContext) {
        ctx.socket.join('some room');
      }

      @EventName('event 1')
      createUser(ctx: WebsocketContext) {
        ctx.socket.to('some room').emit('event 2');
        return new WebsocketResponse();
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    ({ httpServer, socket, controller } = await createConnections(WebsocketController));

    const port = (httpServer.address() as AddressInfo).port;
    socket2 = io(`http://localhost:${port}`);

    return new Promise(async resolve => {
      socket.on('event 2', resolve);
      socket2.emit('event 1');
    })

  });

});
