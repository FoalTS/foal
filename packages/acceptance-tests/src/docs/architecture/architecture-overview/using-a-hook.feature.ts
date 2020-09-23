// 3p
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

// FoalTS
import { Config, createApp, Get, HttpResponseOK } from '@foal/core';
import { getSecretOrPrivateKey, JWTRequired } from '@foal/jwt';

describe('Feature: Using a hook', () => {

  const secret = 'secretXXX';

  beforeEach(() => {
    Config.set('settings.jwt.secret', secret);
  });

  afterEach(() => {
    Config.remove('settings.jwt.secret');
  });

  it('Example: Protecting a route against unauthenticated requests.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {

      @Get('/')
      @JWTRequired()
      index() {
        return new HttpResponseOK('Hello world!');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect(400);

    const jwt = sign({}, getSecretOrPrivateKey());

    await request(app)
      .get('/')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .expect('Hello world!');
  });

});
