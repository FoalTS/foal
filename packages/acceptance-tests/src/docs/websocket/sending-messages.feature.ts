// std
import { deepStrictEqual } from 'assert';
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { EventName, ISocketIOController, SocketIOController, WebsocketContext, WebsocketResponse, wsController } from '@foal/socket.io';
import { closeConnections, createConnections, sleep } from './common';

describe('Feature: Sending messages', () => {

  let socket: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;
  let controller: SocketIOController;

  afterEach(async () => {
    await closeConnections({ httpServer, socket, controller });
  })

  it('Example: Simple Example.', async () => {

    const messagesReceived: any[] = [];

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class UserController {

      @EventName('create')
      createUser(ctx: WebsocketContext) {
        ctx.socket.emit('event 1', 'first message');
        ctx.socket.emit('event 1', 'second message');
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

    const response = await new Promise(resolve => socket.emit('user:create', {}, resolve));

    await sleep();

    deepStrictEqual(response, { status: 'ok' });

    deepStrictEqual(messagesReceived, [
      'first message',
      'second message',
    ])
  });

});
