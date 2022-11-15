// std
import { } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import { All, createApp, Get, HttpResponseNotFound, HttpResponseOK } from '@foal/core';

describe('Feature: Handling routes with no handler', () => {

  it('Example: GET requests.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ViewController {
      @Get('/home')
      home() {
        return new HttpResponseOK('You are on the home page!');
      }
    }

    class AppController {
      subControllers = [ ViewController ];

      @Get('*')
      notFound() {
        return new HttpResponseNotFound('The page you are looking for does not exist.');
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/home')
      .expect(200)
      .expect('You are on the home page!');

    await request(app)
      .get('/unknown')
      .expect(404)
      .expect('The page you are looking for does not exist.');
  });

  it('Example: POST, PUT, GET, etc requests.', async () => {

    class ViewController {
      @Get('/home')
      home() {
        return new HttpResponseOK('You are on the home page!');
      }
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {
      subControllers = [ ViewController ];

      @All('*')
      notFound() {
        return new HttpResponseNotFound('The route you are looking for does not exist.');
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/home')
      .expect(200)
      .expect('You are on the home page!');

    await request(app)
      .get('/unknown')
      .expect(404)
      .expect('The route you are looking for does not exist.');

    await request(app)
      .post('/unknown')
      .expect(404)
      .expect('The route you are looking for does not exist.');

    await request(app)
      .put('/unknown')
      .expect(404)
      .expect('The route you are looking for does not exist.');
  });

});
