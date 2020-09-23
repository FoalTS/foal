// 3p
import * as request from 'supertest';

// FoalTS
import { Context, controller, createApp, Get, HttpResponseOK, Post } from '@foal/core';

describe('Feature: Creating a controller', () => {

  it('Example: A simple controller.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ProductController {

      @Get('/products')
      listProducts(ctx: Context) {
        return new HttpResponseOK([]);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(ProductController);

    await request(app)
      .get('/products')
      .expect(200)
      .expect([]);
  });

  it('Example: A controller with several routes.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MyController {
      @Get('/foo')
      foo() {
        return new HttpResponseOK('I\'m listening to GET /foo requests.');
      }

      @Post('/bar')
      bar() {
        return new HttpResponseOK('I\'m listening to POST /bar requests.');
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .get('/foo')
      .expect(200)
      .expect('I\'m listening to GET /foo requests.');

    await request(app)
      .post('/bar')
      .expect(200)
      .expect('I\'m listening to POST /bar requests.');
  });

  it('Example: A controller with a sub-controller.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class MySubController {
      @Get('/foo')
      foo() {
        return new HttpResponseOK('I\'m listening to GET /barfoo/foo requests.');
      }
    }

    class MyController {
      subControllers = [
        controller('/barfoo', MySubController)
      ];

      @Post('/bar')
      bar() {
        return new HttpResponseOK('I\'m listening to POST /bar requests.');
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(MyController);

    await request(app)
      .get('/barfoo/foo')
      .expect(200)
      .expect('I\'m listening to GET /barfoo/foo requests.');

    await request(app)
      .post('/bar')
      .expect(200)
      .expect('I\'m listening to POST /bar requests.');
  });

});
