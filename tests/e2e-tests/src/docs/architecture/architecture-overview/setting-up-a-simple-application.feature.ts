// 3p
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  controller,
  createApp,
  Get,
  // Hook,
  HttpResponseNotFound,
  HttpResponseOK,
} from '@foal/core';
import { getSecretOrPrivateKey, JWTRequired } from '@foal/jwt';

describe('Feature: Setting up a simple application', () => {

  const secret = 'secretXXX';

  beforeEach(() => {
    Config.set('settings.jwt.secret', secret);
  });

  afterEach(() => {
    Config.remove('settings.jwt.secret');
  });

  it('Example: An API listing products (no database)', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    @JWTRequired()
    class ApiController {
      private products = [
        { id: 1, name: 'phone' },
        { id: 2, name: 'computer' },
      ];

      @Get('/products')
      listProducts() {
        return new HttpResponseOK(this.products);
      }

      @Get('/products/:id')
      getProduct(ctx: Context) {
        const product = this.products.find(
          p => p.id === parseInt(ctx.request.params.id, 10)
        );

        if (!product) {
          return new HttpResponseNotFound();
        }

        return new HttpResponseOK(product);
      }
    }

    // Commented in this test to avoid noise in the terminal.
    // @Hook(() => {
    //   console.log('Receiving a request...')
    // })
    class AppController {
      subControllers = [
        controller('/api', ApiController)
      ];

      @Get('/')
      index() {
        return new HttpResponseOK('Welcome!');
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(200)
      .expect('Welcome!');

    await request(app)
      .get('/api/products')
      .expect(400);

    const jwt = sign({}, getSecretOrPrivateKey());

    await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect([
        { id: 1, name: 'phone' },
        { id: 2, name: 'computer' },
      ]);

    await request(app)
      .get('/api/products/1')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect({
        id: 1,
        name: 'phone',
      });
  });

});
