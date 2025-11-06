// 3p
import * as request from 'supertest';

// FoalTS
import { createApp, Get, Hook, HttpResponseOK } from '@foal/core';

describe('Feature: Creating hooks with factories', () => {

  it('Example: A simple hook factory.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    function Log(msg: string) {
      return Hook(() => { /*console.log(msg);*/ });
    }

    class MyController {
      @Get('/route1')
      @Log('Receiving a GET /route1 request...')
      route1() {
        return new HttpResponseOK('Hello world!');
      }

      @Get('/route2')
      @Log('Receiving a GET /route2 request...')
      route2() {
        return new HttpResponseOK('Hello world!');
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .get('/route1')
      .expect(200)
      .expect('Hello world!');

    await request(app)
      .get('/route2')
      .expect(200)
      .expect('Hello world!');
  });

});
