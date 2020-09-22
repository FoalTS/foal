// 3p
import * as request from 'supertest';

// FoalTS
import { Config, createApp, Get, HttpResponseOK } from '@foal/core';

describe('Feature: Creating a controller', () => {

  beforeEach(() => Config.set('settings.logErrors', false));

  afterEach(() => Config.remove('settings.logErrors'));

  it('Example: Returning "Hello world!"', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {

      @Get('/')
      index() {
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');
  });

});
