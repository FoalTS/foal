// 3p
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  createApp,
  createSession,
  Get,
  HttpResponseOK,
  IAppController,
  ServiceManager,
  Store,
  UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAppWithDB, getTypeORMStorePath, ShutDownApp } from '../../../common';

describe('Feature: Modifying session timeouts', () => {

  let app: any;
  let shutDownApp: ShutDownApp;

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
    Config.set('settings.session.expirationTimeouts.inactivity', 1);
  });

  afterEach(async () => {
    Config.remove('settings.session.store');
    Config.remove('settings.session.expirationTimeouts.inactivity');
    if (shutDownApp) {
      await shutDownApp();
    }
  });

  it('Example: Simple authentication', async () => {

    @UseSessions({ required: true })
    class AppController implements IAppController {

      @Get('/')
      index(ctx: Context) {
        return new HttpResponseOK();
      }

    }

    const services = new ServiceManager();

    ({ app, shutDownApp } = await createAppWithDB(AppController, [ DatabaseSession ], { serviceManager: services }));

    const store = services.get(Store);

    const session = await createSession(store);
    await session.commit();

    await request(app)
      .get('/')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .expect(200);

    await new Promise(resolve => setTimeout(resolve, 1500));

    await request(app)
      .get('/')
      .set('Authorization', `Bearer ${session.getToken()}`)
      .expect(401)
      .expect({
        code: 'invalid_token',
        description: 'token invalid or expired'
      });

  });

});
