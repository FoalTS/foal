// std
import { deepStrictEqual } from 'assert';
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { EventName, SocketIOController, wsController, WebsocketContext, WebsocketErrorResponse, WebsocketHook, ISocketIOController } from '@foal/socket.io';
import { closeConnections, createConnections } from './common';

describe('Feature: Using Websocket controllers and hooks', () => {

  let socket: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;
  let controller: SocketIOController;

  afterEach(async () => {
    await closeConnections({ httpServer, socket, controller });
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

    // tslint:disable-next-line
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

    ({ httpServer, socket, controller } = await createConnections(WebsocketController));

    await new Promise<void>((resolve, reject) => {

      socket.emit('user:create', { name: 3 }, (response: any) => {
        try {
          deepStrictEqual(response, {
            status: 'error',
            error: 'Invalid name type'
          });
          resolve();
        } catch (error: any) {
          reject(error);
          return;
        }
        reject();
      });

    });

  });

});
