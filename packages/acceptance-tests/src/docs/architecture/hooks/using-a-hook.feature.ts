// 3p
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  createApp,
  Get,
  HttpResponseCreated,
  HttpResponseOK,
  Post,
  ValidateBody,
} from '@foal/core';
import { getSecretOrPrivateKey, JWTRequired } from '@foal/jwt';

describe('Feature: Using a hook', () => {

  const secret = 'secretXXX';

  beforeEach(() => {
    Config.set('settings.jwt.secret', secret);
  });

  afterEach(() => {
    Config.remove('settings.jwt.secret');
  });

  it('Example: A controller using hooks.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    @JWTRequired()
    class AppController {
      private products = [
        { name: 'Hoover' }
      ];

      @Get('/products')
      listProducts() {
        return new HttpResponseOK(this.products);
      }

      @Post('/products')
      @ValidateBody({
        additionalProperties: false,
        properties: {
          name: { type: 'string' }
        },
        required: [ 'name' ],
        type: 'object',
      })
      addProduct(ctx: Context) {
        this.products.push(ctx.request.body);
        return new HttpResponseCreated();
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/products')
      .expect(400);

    const jwt = sign({}, getSecretOrPrivateKey());

    await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect([
        { name: 'Hoover' }
      ]);

    await request(app)
      .post('/products')
      .send({ name: 'hello' })
      .set('Authorization', `Bearer ${jwt}`)
      .expect(201);

    await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect([
        { name: 'Hoover' },
        { name: 'hello' }
      ]);
  });

});
