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
  Session,
  Store,
  UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { closeTestConnection, createTestConnection, getTypeORMStorePath } from '../../../common';

describe('Feature: Modifying session timeouts', () => {

  beforeEach(() => {
    Config.set('settings.session.store', getTypeORMStorePath());
    Config.set('settings.session.expirationTimeouts.inactivity', 1);
  });

  afterEach(() => {
    Config.remove('settings.session.store');
    Config.remove('settings.session.expirationTimeouts.inactivity');
    return closeTestConnection();
  });

  it('Example: Simple authentication', async () => {

    @UseSessions({ required: true })
    class AppController implements IAppController {

      async init() {
        await createTestConnection([ DatabaseSession ]);
      }

      @Get('/')
      index(ctx: Context<any, Session>) {
        return new HttpResponseOK();
      }

    }

    const services = new ServiceManager();
    const app = await createApp(AppController, { serviceManager: services });
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
