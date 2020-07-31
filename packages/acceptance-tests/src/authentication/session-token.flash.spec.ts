// 3p
import {
  createConnection, getConnection
} from '@foal/typeorm/node_modules/typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Context, createApp, dependency, Get, HttpResponseOK, Session, TokenRequired
} from '@foal/core';
import { DatabaseSession, TypeORMStore } from '@foal/typeorm';

describe('The framework', () => {

  let app: any;

  class AppController {
    @dependency
    store: TypeORMStore;

    @Get('/token')
    async generateToken() {
      const session = await this.store.createAndSaveSession({});
      session.set('error', 'error message', { flash: true });
      await this.store.update(session);
      const token = session.getToken();
      return new HttpResponseOK({ token });
    }

    @Get('/flash')
    @TokenRequired({ store: TypeORMStore })
    async readFlash(ctx: Context<any, Session>) {
      return new HttpResponseOK({
        a: 'b',
        error: ctx.session.get('error')
      });
    }
  }

  before(async () => {
    await createConnection({
      database: 'e2e_db.sqlite',
      dropSchema: true,
      entities: [ DatabaseSession ],
      synchronize: true,
      type: 'sqlite',
    });

    app = createApp(AppController);
  });

  after(async () => {
    await getConnection().close();
  });

  it('should support flash sessions.', async () => {
    let token: any;

    await request(app)
      .get('/token')
      .expect(200)
      .then(response => token = response.body.token);

    await request(app)
      .get('/flash')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({
        a: 'b',
        error: 'error message',
      });

    await request(app)
      .get('/flash')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({
        a: 'b',
      });
  });

});
