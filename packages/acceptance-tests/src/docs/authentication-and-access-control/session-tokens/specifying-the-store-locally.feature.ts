// std
import { notStrictEqual, strictEqual } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  controller,
  createApp,
  createSession,
  dependency,
  Get,
  HttpResponseOK,
  IAppController,
  Post,
  ServiceManager,
  Session,
  UseSessions
} from '@foal/core';
import { RedisStore } from '@foal/redis';

describe('Feature: Specifying the store locally', () => {

  let store: RedisStore|undefined;

  beforeEach(() => {
    Config.set('settings.redis.uri', 'redis://localhost:6380');
  });

  afterEach(async () => {
    Config.remove('settings.redis.uri');
    if (store) {
      await store.close();
    }
  });

  it('Example: Usage with Redis store', async () => {

    let session: Session|null = null;

    /* ======================= DOCUMENTATION BEGIN ======================= */

    @UseSessions({ store: RedisStore })
    class ApiController {

      @dependency
      store: RedisStore;

      @Post('/login')
      async login(ctx: Context) {
        // Check the user credentials...

        ctx.session = await createSession(this.store);

        return new HttpResponseOK({
          token: ctx.session.getToken()
        });
      }

      @Get('/products')
      readProducts(ctx: Context) {
        // Not in the documentation:
        session = ctx.session;
        return new HttpResponseOK([]);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController implements IAppController {
      subControllers = [
        controller('/api', ApiController),
      ];
    }

    const services = new ServiceManager();
    const app = await createApp(AppController, { serviceManager: services });
    store = services.get(RedisStore);

    strictEqual(session, null);

    await request(app)
      .get('/api/products')
      .expect(200)
      .expect([]);

    strictEqual(session, null);

    const response = await request(app)
      .post('/api/login')
      .send({})
      .expect(200);

    strictEqual(session, null);

    const token: undefined|string = response.body.token;
    if (token === undefined) {
      throw new Error('The server should have returned a session token.');
    }

    await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([]);

    notStrictEqual(session, null);
    strictEqual((session as unknown as Session).getToken(), token);

  });

});
