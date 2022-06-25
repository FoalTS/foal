// 3p
import * as request from 'supertest';
import { DataSource } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import {
  Config, controller, Get, HttpResponseOK, IAppController, UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAppWithDB, getTypeORMStorePath, ShutDownApp } from '../../../common';

describe('Feature: Requiring the session cookie', async () => {

  let app: any;
  let shutDownApp: ShutDownApp;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    if (shutDownApp) {
      await shutDownApp();
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

    ({ app, shutDownApp } = await createAppWithDB(AppController, [ DatabaseSession ]));

    await request(app)
      .get('/api/products')
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Session cookie not found.'
      });

  });

});
