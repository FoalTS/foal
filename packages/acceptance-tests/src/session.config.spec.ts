import {
  Context, createApp, dependency, Get, HttpResponseOK, Post, ServiceManager, Session, SessionStore, TokenRequired
} from '@foal/core';

import { strictEqual } from 'assert';
import * as request from 'supertest';

describe('The session store', () => {

  let serviceManager: ServiceManager;

  beforeEach(() => {
    // Use ".." to remove the "build/" directory.
    process.env.SETTINGS_SESSION_STORE = './../node_modules/@foal/redis';
    process.env.SETTINGS_SESSION_SECRET = 'secret';
    serviceManager = new ServiceManager();
  });

  afterEach(() => {
    delete process.env.SETTINGS_SESSION_STORE;
    delete process.env.SETTINGS_SESSION_SECRET;
    // Hack to close the redis connection in this test.
    (serviceManager as any).map.forEach((value: any) => {
      if (value.service.getRedisInstance) {
        value.service.getRedisInstance().end(true);
      }
    });
  });

  it('can be configured in one place in the configuration.', async () => {

    class AuthController {

      @dependency
      store: SessionStore;

      @Post('/login')
      async login(ctx: Context) {
        const session = await this.store.createAndSaveSession({
          products: [
            { name: 'product 1' }
          ]
        });

        return new HttpResponseOK({
          token: session.getToken()
        });
      }

      @Get('/products')
      @TokenRequired()
      readProducts(ctx: Context<any, Session>) {
        return new HttpResponseOK(ctx.session.get('products'));
      }

    }

    const app = createApp(AuthController, {
      serviceManager
    });

    await request(app)
      .get('/products')
      .set('Authorization', `Bearer wrongtoken`)
      .expect(401);

    let token = '';
    await request(app)
      .post('/login')
      .send()
      .then(response => {
        strictEqual(response.status, 200);
        token = response.body.token;
      });

    await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([
        { name: 'product 1' }
      ]);
  });

});
