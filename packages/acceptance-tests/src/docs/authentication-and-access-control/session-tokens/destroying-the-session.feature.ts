
// std
import { notStrictEqual, strictEqual } from 'assert';

// 3p
import * as request from 'supertest';
import { Connection } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import {
  Config,
  Context,
  controller,
  createApp,
  createSession,
  HttpResponseNoContent,
  IAppController,
  Post,
  readSession,
  ServiceManager,
  Store,
  UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createTestConnection, getTypeORMStorePath } from '../../../common';

describe('Feature: Destroying the session', () => {

  let connection: Connection;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    if (connection) {
      await connection.close();
    }
  });

  it('Example: Simple log out', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AuthController {

      @Post('/logout')
      @UseSessions()
      async logout(ctx: Context) {
        if (ctx.session) {
          await ctx.session.destroy();
        }
        return new HttpResponseNoContent();
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    class AppController implements IAppController {
      subControllers = [
        controller('', AuthController),
      ];
    }

    const services = new ServiceManager();
    const app = await createApp(AppController, { serviceManager: services });
    connection = await createTestConnection([ DatabaseSession ]);
    const store = services.get(Store);

    const session = await createSession(store);
    await session.commit();

    notStrictEqual(await readSession(store, session.getToken()), null);

    await request(app)
      .post('/logout')
      .send()
      .expect(204);

    await request(app)
      .post('/logout')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .send()
      .expect(204);

    strictEqual(await readSession(store, session.getToken()), null);
  });

});
