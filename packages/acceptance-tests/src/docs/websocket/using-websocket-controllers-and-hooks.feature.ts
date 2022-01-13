// std
import { deepStrictEqual } from 'assert';
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { ServiceManager, createApp } from '@foal/core';
import { EventName, SocketIOController, wsController, WebsocketContext, WebsocketErrorResponse, WebsocketHook, ISocketIOController } from '@foal/socket.io';

describe('Feature: Using Websocket controllers and hooks', () => {

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

  it('Example: Simple example with a controller.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class UserController {

      @EventName('create')
      createUser(ctx: WebsocketContext) {
        // ...
      }

      @EventName('delete')
      deleteUser(ctx: WebsocketContext) {
        // ...
      }

    }

    class WebsocketController extends SocketIOController {
      subControllers = [
        wsController('users ', UserController)
      ];
    }

    /* ======================= DOCUMENTATION END ========================= */

  });

  it('Example: Simple example with a hook.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class UserController {

      @EventName('create')
      @WebsocketHook((ctx, services) => {
        if (typeof ctx.payload.name !== 'string') {
          return new WebsocketErrorResponse('Invalid name type');
        }
      })
      createUser(ctx: WebsocketContext) {
        // ...
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

    await new Promise((resolve, reject) => socket.on('connect', () => {

      socket.emit('user:create', { name: 3 }, (response: any) => {
        try {
          deepStrictEqual(response, {
            status: 'error',
            error: 'Invalid name type'
          });
          resolve();
        } catch (error) {
          reject(error);
          return;
        }
        reject();
      });

    }));

  });

});
