// 3p
import * as request from 'supertest';

// FoalTS
import {
  Config, controller, createApp, Get, HttpResponseOK, IAppController, UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { closeTestConnection, createTestConnection } from '../../../common';
import { getTypeORMStorePath } from '../common';

describe('Feature: Requiring the session cookie', async () => {

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(() => {
    Config.remove('settings.session.store');
    return closeTestConnection();
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

      async init() {
        await createTestConnection([ DatabaseSession ]);
      }
    }

    const app = await createApp(AppController);

    await request(app)
      .get('/api/products')
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Session cookie not found.'
      });

  });

});
