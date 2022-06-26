// std
import { notStrictEqual } from 'assert';

// 3p
import * as request from 'supertest';
import { Connection } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import {
  Config,
  Context,
  createApp,
  createSession,
  dependency,
  Get,
  HttpResponseOK,
  IAppController,
  Store,
  UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createTestConnection, getTypeORMStorePath } from '../../../common';

describe('Feature: Regenerating the session ID', () => {

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

  it('Example: Simple Example.', async () => {

    @UseSessions()
    class AppController implements IAppController {
      @dependency
      store: Store;

      @Get('/new-session')
      async createSessionAndReturnToken(ctx: Context) {
        ctx.session = await createSession(this.store);
        return new HttpResponseOK({ token: ctx.session.getToken() });
      }

      @Get('/regenerated-id')
      async regenerateID(ctx: Context) {
        /* ======================= DOCUMENTATION BEGIN ======================= */

        await ctx.session!.regenerateID();

        /* ======================= DOCUMENTATION END ========================= */

        return new HttpResponseOK({ token: ctx.session!.getToken() });
      }
    }

    const app = await createApp(AppController);
    connection = await createTestConnection([ DatabaseSession ]);

    let token = '';

    await request(app)
      .get('/new-session')
      .expect(200)
      .then(response => token = response.body.token);

    await request(app)
      .get('/regenerated-id')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        notStrictEqual(response.body.token, token);
      });
  });

});
