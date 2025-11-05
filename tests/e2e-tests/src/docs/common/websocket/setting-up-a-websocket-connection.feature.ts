// std
import { strictEqual } from 'assert';
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { createApp, ServiceManager } from '@foal/core';
import { EventName, ValidatePayload, SocketIOController, WebsocketContext, WebsocketResponse } from '@foal/socket.io';

describe('Feature: Setting up a websocket connection', () => {

  let socket: ReturnType<typeof io>;
  let socket2: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;


  afterEach(done => {
    if (socket) {
      socket.disconnect();
    }
    if (socket2) {
      socket2.disconnect();
    }
    if (httpServer) {
      httpServer.close(done);
    } else {
      done();
    }
  })

  it('Example: simple example.', async () => {

    class Product {
      name: string;
      save() {}
    }

    let hasEventBeenBroadcast = false;

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class WebsocketController extends SocketIOController {

      @EventName('create product')
      @ValidatePayload({
        additionalProperties: false,
        properties: { name: { type: 'string' }},
        required: [ 'name' ],
        type: 'object'
      })
      async createProduct(ctx: WebsocketContext, payload: { name: string }) {
        const product = new Product();
        product.name = payload.name;
        await product.save();

        // Send a message to all clients.
        ctx.socket.broadcast.emit('refresh products');
        return new WebsocketResponse();
      }

    }

    class AppController {}

    async function main() {
      const serviceManager = new ServiceManager();

      const app = await createApp(AppController, { serviceManager });
      httpServer = http.createServer(app);

      // Instanciate, init and connect websocket controllers.
      await serviceManager.get(WebsocketController).attachHttpServer(httpServer);

      await new Promise<void>(resolve => httpServer.listen(3001, () => resolve()));
    }

    await main();

    /* ======================= DOCUMENTATION END ========================= */

    socket2 = io('ws://localhost:3001');
    socket2.on('connect', () => {});

    const promise = new Promise<void>(resolve => socket2.on('refresh products', () => {
      console.log('refresh products!');
      hasEventBeenBroadcast = true;
      resolve();
    }));

    /* ======================= DOCUMENTATION BEGIN ======================= */

    socket = io('ws://localhost:3001');

    socket.on('connect', () => {

      socket.emit('create product', { name: 'product 1' }, (response: any) => {
        if (response.status === 'error') {
          console.log(response.error);
        }
      });

    });

    socket.on('connect_error', () => {
      console.log('Impossible to establish the socket.io connection');
    });

    socket.on('refresh products', () => {
      console.log('refresh products!');
    });

    /* ======================= DOCUMENTATION END ========================= */

    await promise;

    strictEqual(hasEventBeenBroadcast, true)

  });

});
