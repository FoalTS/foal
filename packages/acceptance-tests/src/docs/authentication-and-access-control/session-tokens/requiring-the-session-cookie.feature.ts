// 3p
import * as request from 'supertest';
import { Connection } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import {
  Config, controller, createApp, Get, HttpResponseOK, IAppController, UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createTestConnection, getTypeORMStorePath } from '../../../common';

describe('Feature: Requiring the session cookie', async () => {

  let connection: Connection;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    if (connection) {
      await connection.close();
    }
  });

  it('Example: Simple example.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ApiController {

      @Get('/products')
      @UseSessions({ cookie: true, required: true })
      readProducts() {
        return new HttpResponseOK([]);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController implements IAppController {
      subControllers = [
        controller('/api', ApiController),
      ];
    }

    const app = await createApp(AppController);
    connection = await createTestConnection([ DatabaseSession ]);

    await request(app)
      .get('/api/products')
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Session cookie not found.'
      });

  });

});
