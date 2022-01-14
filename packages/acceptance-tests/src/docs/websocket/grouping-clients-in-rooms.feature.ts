// std
import { deepStrictEqual, strictEqual } from 'assert';
import * as http from 'http';
import { AddressInfo } from 'net';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { EventName, SocketIOController, WebsocketContext, WebsocketResponse } from '@foal/socket.io';
import { closeConnections, createConnections, sleep } from './common';

describe('Feature: Grouping clients in rooms', () => {

  let socket: ReturnType<typeof io>;
  let socket2: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;
  let controller: SocketIOController;

  afterEach(async () => {
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

    let event2HasBeenCalled = false;

    socket.on('event 2', () => {
      event2HasBeenCalled = true
    });

    const port = (httpServer.address() as AddressInfo).port;
    socket2 = io(`http://localhost:${port}`);

    const response = await new Promise(resolve => socket2.emit('event 1', {}, resolve));

    await sleep();

    deepStrictEqual(response, { status: 'ok' });

    strictEqual(event2HasBeenCalled, true)

  });

});
