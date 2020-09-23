// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, Get, HttpResponseOK } from '@foal/core';

describe('Feature: Creating a controller', () => {

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
