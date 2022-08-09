// std
import { notStrictEqual } from 'assert';

// 3p
import * as request from 'supertest';
import { DataSource } from 'typeorm';

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
import { createAndInitializeDataSource, getTypeORMStorePath } from '../../../common';

describe('Feature: Regenerating the session ID', () => {

  let dataSource: DataSource;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    if (dataSource) {
      await dataSource.destroy();
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
    dataSource = await createAndInitializeDataSource([ DatabaseSession ]);

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
