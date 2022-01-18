// std
import { deepStrictEqual } from 'assert';
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { EventName, SocketIOController, wsController, WebsocketContext, ISocketIOController, WebsocketResponse } from '@foal/socket.io';
import { closeConnections, createConnections, sleep } from './common';
import { AddressInfo } from 'net';

describe('Feature: Broadcasting a message', () => {

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

    const messagesReceived: any[] = [];

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class UserController {

      @EventName('create')
      createUser(ctx: WebsocketContext) {
        ctx.socket.broadcast.emit('event 1', 'first message');
        ctx.socket.broadcast.emit('event 1', 'second message');
        return new WebsocketResponse();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    class WebsocketController extends SocketIOController implements ISocketIOController {
      subControllers = [
        wsController('user:', UserController)
      ]
    }

    ({ httpServer, socket, controller } = await createConnections(WebsocketController));


    /* ======================= DOCUMENTATION BEGIN ======================= */

    socket.on('event 1', payload => {
      console.log('Message: ', payload);
      messagesReceived.push(payload);
    });

    /* ======================= DOCUMENTATION END ========================= */

    deepStrictEqual(messagesReceived, [])

    const port = (httpServer.address() as AddressInfo).port;
    socket2 = io(`http://localhost:${port}`);

    const response = await new Promise(resolve => socket2.emit('user:create', {}, resolve));

    await sleep();

    deepStrictEqual(response, { status: 'ok' });

    deepStrictEqual(messagesReceived, [
      'first message',
      'second message',
    ])

  });

});
