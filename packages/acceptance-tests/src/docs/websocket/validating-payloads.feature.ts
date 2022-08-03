// std
import { deepStrictEqual } from 'assert';
import * as http from 'http';

// 3p
import { io } from 'socket.io-client';

// FoalTS
import { EventName, SocketIOController, WebsocketContext, WebsocketResponse, ValidatePayload } from '@foal/socket.io';
import { closeConnections, createConnections } from './common';

describe('Feature: Validating payloads', () => {

  let socket: ReturnType<typeof io>;
  let httpServer: ReturnType<typeof http.createServer>;
  let controller: SocketIOController;

  afterEach(async () => {
    await closeConnections({ httpServer, socket, controller });
  })


  it('Example: Simple example.', async () => {

    class Product {
      name: string;
      save() {}
    }

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

    /* ======================= DOCUMENTATION END ========================= */

    ({ httpServer, socket, controller } = await createConnections(WebsocketController));

    const response = await new Promise(resolve => socket.emit('create product', {}, resolve));

    deepStrictEqual(response,
      /* ======================= DOCUMENTATION BEGIN ======================= */
      {
        status: 'error',
        error: {
          code: 'VALIDATION_PAYLOAD_ERROR',
          payload: [
            {
              keyword: 'required',
              instancePath: '',
              schemaPath: '#/required',
              params: {
                missingProperty: 'name'
              },
              message: 'must have required property \'name\''
            }
          ]
        }
      }
      /* ======================= DOCUMENTATION END ========================= */
    );
  });

});
