// std
import { } from 'assert';
import * as http from 'http';
import { AddressInfo } from 'net';

// 3p
import { io } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

// FoalTS
import { createApp, ServiceManager } from '@foal/core';
import { EventName, SocketIOController, WebsocketContext, WebsocketResponse } from '@foal/socket.io';
import { closeConnections } from './common';

describe('Feature: Using redis to manage multiple node servers', () => {

  let httpServer: ReturnType<typeof http.createServer>;
  let socket: ReturnType<typeof io>;
  let controller: SocketIOController;
  let pubClient: ReturnType<typeof createClient>;
  let subClient: ReturnType<typeof createClient>;

  let httpServer2: ReturnType<typeof http.createServer>;
  let socket2: ReturnType<typeof io>;
  let controller2: SocketIOController;
  let pubClient2: ReturnType<typeof createClient>;
  let subClient2: ReturnType<typeof createClient>;

  afterEach(() => Promise.all([
    pubClient && pubClient.quit(),
    pubClient2 && pubClient2.quit(),
    subClient && subClient.quit(),
    subClient2 && subClient2.quit(),
    closeConnections({ httpServer, socket, controller }),
    closeConnections({ httpServer: httpServer2, socket: socket2, controller: controller2 }),
  ]))

  it('Example: Simple example.', async () => {

    function createServerAndConnections(): Promise<{
      httpServer: ReturnType<typeof http.createServer>,
      socket: ReturnType<typeof io>,
      controller: SocketIOController,
      pubClient: ReturnType<typeof createClient>,
      subClient: ReturnType<typeof createClient>,
    }> {
      return new Promise(resolve => {
        /* ======================= DOCUMENTATION BEGIN ======================= */

        const pubClient = createClient({ url: 'redis://localhost:6380' });
        const subClient = pubClient.duplicate();

        class WebsocketController extends SocketIOController {
          adapter = createAdapter(pubClient, subClient);

          @EventName('create user')
          createUser(ctx: WebsocketContext) {
            // Broadcast an event to all clients of all servers.
            ctx.socket.broadcast.emit('refresh users');
            return new WebsocketResponse();
          }
        }

        /* ======================= DOCUMENTATION END ========================= */

        class AppController {}

        /* ======================= DOCUMENTATION BEGIN ======================= */

        async function main() {
          const serviceManager = new ServiceManager();

          const app = await createApp(AppController, { serviceManager });
          const httpServer = http.createServer(app);

          // Connect the redis clients to the database.
          await Promise.all([pubClient.connect(), subClient.connect()]);

          await serviceManager.get(WebsocketController).attachHttpServer(httpServer);

          /* ======================= DOCUMENTATION END ========================= */

          httpServer.listen(() => {
            const port = (httpServer.address() as AddressInfo).port;
            const socket = io(`http://localhost:${port}`);
            socket.on('connect', () => resolve({ httpServer, socket, controller: serviceManager.get(WebsocketController), pubClient, subClient }));
          });
        }

        main();

      })
    }

    ({ httpServer, socket, controller, pubClient, subClient } = await createServerAndConnections());
    ({ httpServer: httpServer2, socket: socket2, controller: controller2, pubClient: pubClient2, subClient: subClient2 } = await createServerAndConnections());

    return new Promise(resolve => {
      socket2.on('refresh users', resolve);
      socket.emit('create user');
    })

  });

});
