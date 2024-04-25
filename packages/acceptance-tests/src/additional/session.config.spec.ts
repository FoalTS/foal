import {
  Config,
  Context,
  createApp,
  createSession,
  dependency,
  Get,
  HttpResponseOK,
  Post,
  ServiceManager,
  SessionStore,
  UseSessions,
} from '@foal/core';

import { strictEqual } from 'assert';
import * as request from 'supertest';

describe('The session store', () => {

  let serviceManager: ServiceManager;

  beforeEach(() => {
    // Use ".." to remove the "build/" directory.
    Config.set('settings.session.store', './../../../node_modules/@foal/redis');
    Config.set('settings.session.secret', 'secret');
    Config.set('settings.redis.uri', 'redis://localhost:6380');
    serviceManager = new ServiceManager();
  });

  afterEach(() => {
    Config.remove('settings.session.store');
    Config.remove('settings.session.secret');
    Config.remove('settings.redis.uri');
    // Hack to close the redis connection in this test.
    (serviceManager as any).map.forEach((value: any) => {
      if (value.service.close) {
        value.service.close();
      }
    });
  });

  it('can be configured in one place in the configuration.', async () => {

    class AuthController {

      @dependency
      store: SessionStore;

      @Post('/login')
      async login(ctx: Context) {
        const session = await createSession(this.store);
        session.set('products', [
          { name: 'product 1' }
        ]);
        await session.commit();

        return new HttpResponseOK({
          token: session.getToken()
        });
      }

      @Get('/products')
      @UseSessions({ required: true })
      readProducts(ctx: Context) {
        return new HttpResponseOK(ctx.session!.get('products'));
      }

    }

    const app = await createApp(AuthController, {
      serviceManager
    });
    await app.foal.services.boot();

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
