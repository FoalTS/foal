// std
import { deepStrictEqual } from 'assert';
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { EventName, ISocketIOController, renderWebsocketError, SocketIOController, WebsocketContext, WebsocketErrorResponse } from '@foal/socket.io';
import { closeConnections, createConnections } from './common';
import { Config } from '@foal/core';

describe('Feature: Customizing the error handler', () => {

  let socket: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;
  let controller: SocketIOController;

  beforeEach(() => Config.set('settings.logErrors', false));

  afterEach(async () => {
    Config.remove('settings.logErrors');
    await closeConnections({ httpServer, socket, controller });
  })

  it('Example: Example with a permission error.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class PermissionDenied extends Error {}

    class WebsocketController extends SocketIOController implements ISocketIOController {
      @EventName('create user')
      createUser() {
        throw new PermissionDenied();
      }

      handleError(error: Error, ctx: WebsocketContext){
        if (error instanceof PermissionDenied) {
          return new WebsocketErrorResponse('Permission is denied');
        }

        return renderWebsocketError(error, ctx);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    ({ httpServer, socket, controller } = await createConnections(WebsocketController));

    const response = await new Promise(resolve => {
      socket.emit('create user', {}, resolve)
    });

    deepStrictEqual(response, {
      status: 'error',
      error: 'Permission is denied'
    })

  });

});
