// std
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { EventName, ISocketIOController, SocketIOController, WebsocketContext, WebsocketResponse, wsController } from '@foal/socket.io';
import { createApp, ServiceManager } from '@foal/core';
import { deepStrictEqual } from 'assert';

describe('Feature: Sending messages', () => {

  let socket: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;

  afterEach(done => {
    if (socket) {
      socket.disconnect();
    }
    if (httpServer) {
      httpServer.close(done);
    } else {
      done();
    }
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

    class AppController {}

    async function main() {
      const serviceManager = new ServiceManager();

      const app = await createApp(AppController, { serviceManager });
      httpServer = http.createServer(app);

      // Instanciate, init and connect websocket controllers.
      await serviceManager.get(WebsocketController).attachHttpServer(httpServer);

      await new Promise(resolve => httpServer.listen(3001, () => resolve()));
    }

    await main();

    socket = io('ws://localhost:3001');

    /* ======================= DOCUMENTATION BEGIN ======================= */

    socket.on('event 1', payload => {
      console.log('Message: ', payload);
      messagesReceived.push(payload);
    });

    /* ======================= DOCUMENTATION END ========================= */

    deepStrictEqual(messagesReceived, [])

    const response = await new Promise(resolve => socket.emit('user:create', {}, resolve));

    deepStrictEqual(response, { status: 'ok' });

    deepStrictEqual(messagesReceived, [
      'first message',
      'second message',
    ])
  });

});
