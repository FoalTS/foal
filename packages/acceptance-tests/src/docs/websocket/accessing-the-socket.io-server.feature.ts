
// std
import { strictEqual } from 'assert';
import { AddressInfo } from 'net';
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';
import * as superagent from 'superagent';

// FoalTS
import { ISocketIOController, SocketIOController, WsServer } from '@foal/socket.io';
import { closeConnections, createConnections, sleep } from './common';
import { dependency, Post, HttpResponseOK, controller as httpController } from '@foal/core';

describe('Feature: Accessing the socket.io server', () => {

  let socket: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;
  let controller: SocketIOController;

  afterEach(async () => {
    await closeConnections({ httpServer, socket, controller });
  })

  it('Example: Accessing the socker.io server in a HTTP controller.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class UserController {
      @dependency
      wsServer: WsServer;

      @Post('/users')
      createUser() {
        // ...
        this.wsServer.io.emit('refresh users');

        return new HttpResponseOK();
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController {
      subControllers = [
        httpController('', UserController)
      ]
    }

    class WebsocketController extends SocketIOController implements ISocketIOController {}

    ({ httpServer, socket, controller } = await createConnections(WebsocketController, AppController));

    let refreshUsersHasBeenCalled = false;

    socket.on('refresh users', () => {
      refreshUsersHasBeenCalled = true
    });

    strictEqual(refreshUsersHasBeenCalled, false);

    const response = await superagent
      .post(`http://localhost:${(httpServer.address() as AddressInfo).port}/users`)
      .send();
    strictEqual(response.status, 200);

    await sleep();

    strictEqual(refreshUsersHasBeenCalled, true)

  });

});
