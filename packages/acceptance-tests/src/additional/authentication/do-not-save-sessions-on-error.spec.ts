// 3p
import * as request from 'supertest';
import { DataSource } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import { Config, Context, createApp, createSession, dependency, Get, Hook, HttpResponseOK, ServiceManager, Store, UseSessions } from '@foal/core';
import { DatabaseSession, TYPEORM_DATA_SOURCE_KEY } from '@foal/typeorm';
import { createTestDataSource, getTypeORMStorePath } from '../../common';

describe('Sessions should not be saved when an error has been thrown', () => {

  let dataSource: DataSource;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
    Config.set('settings.logErrors', false);
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    Config.remove('settings.logErrors');
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  function SetFooContent() {
    return Hook(ctx => {
      if (ctx.session) {
        ctx.session.set('foo', 'bar');
      }
    });
  }

  @UseSessions()
  class AppController {
    @dependency
    store: Store;

    @Get('/new-session')
    async createNewSession(ctx: Context) {
      ctx.session = await createSession(this.store);
      return new HttpResponseOK({ token: ctx.session.getToken() });
    }

    @Get('/error-in-hook')
    @SetFooContent()
    @Hook(() => {
      throw new Error('Error in hook');
    })
    errorInHook() {
      return new HttpResponseOK();
    }

    @Get('/error-in-method')
    @SetFooContent()
    errorInMethod() {
      throw new Error('Error in controller method');
    }

    @Get('/error-in-post-hook')
    @SetFooContent()
    @Hook(() => () => {
      throw new Error('Error in post hook function');
    })
    errorInPostHook() {
      return new HttpResponseOK();
    }

    @Get('/read-foo-content')
    readFooContent(ctx: Context) {
      return new HttpResponseOK(ctx.session?.get('foo') ?? 'null');
    }

  }

  let app: any;
  let token: string;

  beforeEach(async () => {
    dataSource = await createTestDataSource([ DatabaseSession ]);
    await dataSource.initialize();

    const serviceManager = new ServiceManager()
      .set(TYPEORM_DATA_SOURCE_KEY, dataSource);

    app = await createApp(AppController, { serviceManager });

    await request(app)
      .get('/new-session')
      .expect(200)
      .then(response => token = response.body.token);
  });

  it('in a hook.', async () => {
    await request(app)
      .get('/error-in-hook')
      .set('Authorization', `Bearer ${token}`)
      .expect(500);

    await request(app)
      .get('/read-foo-content')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('null');
  });

  it('in the controller method.', async () => {
    await request(app)
      .get('/error-in-method')
      .set('Authorization', `Bearer ${token}`)
      .expect(500);

    await request(app)
      .get('/read-foo-content')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('null');
  });

  it('in a hook post function', async () => {
    await request(app)
      .get('/error-in-post-hook')
      .set('Authorization', `Bearer ${token}`)
      .expect(500);

    await request(app)
      .get('/read-foo-content')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('null');
  });

});
