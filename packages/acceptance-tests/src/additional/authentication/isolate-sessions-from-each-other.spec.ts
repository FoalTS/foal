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
  HttpResponseInternalServerError,
  HttpResponseNoContent,
  HttpResponseOK,
  Post,
  Store,
  UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAndInitializeDataSource, getTypeORMStorePath } from '../../common';

describe('Sessions should be isolated from each other.', () => {

  let dataSource: DataSource;

  before(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
    Config.set('settings.logErrors', false);
  });

  after(async () => {
    Config.remove('settings.session.store');
    Config.remove('settings.logErrors');
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  @UseSessions()
  class AppController {
    @dependency
    store: Store;

    @Get('/create-new-session')
    async createNewSession(ctx: Context) {
      ctx.session = await createSession(this.store);
      return new HttpResponseOK({ token: ctx.session.getToken() });
    }

    @Post('/add-value-to-session')
    async addValueToSession(ctx: Context) {
      if (ctx.session) {
        ctx.session.set('foo', ctx.request.body.value);
      }
      return new HttpResponseNoContent();
    }

    @Get('/read-value-from-session')
    async readValueFromSession(ctx: Context) {
      if (ctx.session) {
        return new HttpResponseOK({
          value: ctx.session.get('foo', null)
        });
      }
      return new HttpResponseInternalServerError();
    }

    @Get('/delete-session')
    async deleteSession(ctx: Context) {
      if (ctx.session) {
        await ctx.session.destroy();
      }
      return new HttpResponseNoContent();
    }

  }

  let app: any;
  let token1: string;
  let token2: string;

  before(async () => {
    app = await createApp(AppController);
    dataSource = await createAndInitializeDataSource([ DatabaseSession ]);
  });

  it('Step 1: Create two sessions.', async () => {
    await request(app)
      .get('/create-new-session')
      .expect(200)
      .then(response => token1 = response.body.token);

    await request(app)
      .get('/create-new-session')
      .expect(200)
      .then(response => token2 = response.body.token);
  });

  it('Step 2: Save a different value in the two sessions.', async () => {
    await request(app)
      .post('/add-value-to-session')
      .set('Authorization', `Bearer ${token1}`)
      .send({ value: 'bar1' })
      .expect(204);

    await request(app)
      .post('/add-value-to-session')
      .set('Authorization', `Bearer ${token2}`)
      .send({ value: 'bar2' })
      .expect(204);
  });

  it('Step 3: Check that the two sessions have both a different value.', async () => {
    await request(app)
      .get('/read-value-from-session')
      .set('Authorization', `Bearer ${token1}`)
      .expect(200)
      .expect({ value: 'bar1' });

    await request(app)
      .get('/read-value-from-session')
      .set('Authorization', `Bearer ${token2}`)
      .expect(200)
      .expect({ value: 'bar2' });
  });

  it('Step 4: Delete a session and check that the remaining one still exists.', async () => {
    await request(app)
      .get('/delete-session')
      .set('Authorization', `Bearer ${token1}`)
      .expect(204);

    // Session 1 does not exist anymore.
    await request(app)
      .get('/read-value-from-session')
      .set('Authorization', `Bearer ${token1}`)
      .expect(401);

    // Session 2 still exists.
    await request(app)
      .get('/read-value-from-session')
      .set('Authorization', `Bearer ${token2}`)
      .expect(200);
  });

});
