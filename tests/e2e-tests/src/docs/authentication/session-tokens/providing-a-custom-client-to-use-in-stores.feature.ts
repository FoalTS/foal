// 3p
import * as request from 'supertest';
import { createClient } from 'redis';
import { MongoClient } from 'mongodb';

// FoalTS
import { createApp, createSession, dependency, Get, HttpResponseInternalServerError, HttpResponseOK, ServiceManager } from '@foal/core';
import { RedisStore } from '@foal/redis';
import { MongoDBStore } from '@foal/mongodb';

describe('Feature: Providing a Custom Client to Use in the Stores', () => {

  it('Example: RedisStore.', async () => {

    let redisClient: ReturnType<typeof createClient>;

    class AppController {
      @dependency
      store: RedisStore;

      @Get('/')
      async index() {
        const session = await createSession(this.store);
        try {
          await session.commit();
        } catch (error: any) {
          // Should throw because the connection has already been closed.
          if (error.message === 'The client is closed') {
            return new HttpResponseOK();
          }
          throw error;
        }
        return new HttpResponseInternalServerError();
      }
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    async function main() {
      redisClient = createClient({ url: 'redis://localhost:6380' });
      await redisClient.connect();

      const serviceManager = new ServiceManager();
      serviceManager.get(RedisStore).setRedisClient(redisClient);

      const app = await createApp(AppController, { serviceManager });

      return app;
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await main();

    await redisClient!.quit();

    return request(app)
      .get('/')
      .expect(200);
  });

  it('Example: MongoDBStore.', async () => {

    let mongoDBClient: MongoClient;

    class AppController {
      @dependency
      store: MongoDBStore;

      @Get('/')
      async index() {
        const session = await createSession(this.store);
        try {
          await session.commit();
        } catch (error: any) {
          // Should throw because the connection has already been closed.
          if (error.name === 'MongoNotConnectedError') {
            return new HttpResponseOK();
          }
          throw error;
        }
        return new HttpResponseInternalServerError();
      }
    }

    /* ======================= DOCUMENTATION BEGIN ======================= */

    async function main() {
      mongoDBClient = await MongoClient.connect('mongodb://localhost:27017/db');

      const serviceManager = new ServiceManager();
      serviceManager.get(MongoDBStore).setMongoDBClient(mongoDBClient);

      const app = await createApp(AppController, { serviceManager });

      return app;
    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await main();

    await mongoDBClient!.close();

    return request(app)
      .get('/')
      .expect(200);
  });

});
