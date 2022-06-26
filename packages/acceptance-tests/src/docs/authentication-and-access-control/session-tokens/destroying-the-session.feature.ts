
// std
import { notStrictEqual, strictEqual } from 'assert';

// 3p
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  controller,
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
import { createAppWithDB, getTypeORMStorePath, ShutDownApp } from '../../../common';

describe('Feature: Destroying the session', () => {

  let app: any;
  let shutDownApp: ShutDownApp;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    if (shutDownApp) {
      await shutDownApp();
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

    ({ app, shutDownApp } = await createAppWithDB(AppController, [ DatabaseSession ], { serviceManager: services }));

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
