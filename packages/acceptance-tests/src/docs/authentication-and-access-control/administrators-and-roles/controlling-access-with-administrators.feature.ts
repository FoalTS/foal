// std
import { strictEqual } from 'assert';

// 3p
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from '@foal/typeorm/node_modules/typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Config, Context, controller, createSession,
  dependency, Get, Hook, HttpResponseForbidden, HttpResponseOK,
  HttpResponseUnauthorized, IAppController, Post, Store, UseSessions
} from '@foal/core';
import { DatabaseSession, fetchUser } from '@foal/typeorm';
import { createAppAndSetUpDabaseConnection, getTypeORMStorePath } from '../../../common';

describe('Feature: Controlling access with administrators', () => {

  let closeDatabaseConnection = async () => {};

  beforeEach(() => Config.set('settings.session.store', getTypeORMStorePath()));

  afterEach(async () => {
    Config.remove('settings.session.store');
    await closeDatabaseConnection();
  });

  it('Example: A simple access control.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // entities/user.entity.ts
    @Entity()
    class User extends BaseEntity {

      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      isAdmin: boolean;

    }

    // hooks/admin-required.hook.ts
    function AdminRequired() {
      return Hook((ctx: Context<User|null>) => {
        if (!ctx.user) {
          return new HttpResponseUnauthorized();
        }
        if (!ctx.user.isAdmin) {
          return new HttpResponseForbidden();
        }
      });
    }

    // controllers/api.controller.ts
    class ApiController {
      private products = [ { id: 1, name: 'chair' } ];

      @Get('/products')
      @AdminRequired()
      readProducts() {
        return new HttpResponseOK(this.products);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    @UseSessions({
      user: fetchUser(User),
    })
    class AppController implements IAppController {
      @dependency
      store: Store;

      subControllers = [
        controller('/api', ApiController)
      ];

      @Post('/login-as-user')
      async loginAsUser(ctx: Context) {
        const user = await User.findOneByOrFail({ isAdmin: false });

        ctx.session = await createSession(this.store);
        ctx.session.setUser(user);

        return new HttpResponseOK({ token: ctx.session.getToken() });
      }

      @Post('/login-as-admin')
      async loginAsAdmin(ctx: Context) {
        const user = await User.findOneByOrFail({ isAdmin: true });

        ctx.session = await createSession(this.store);
        ctx.session.setUser(user);

        return new HttpResponseOK({ token: ctx.session.getToken() });
      }
    }

    let app: any;

    ({ app, closeDatabaseConnection } = await createAppAndSetUpDabaseConnection(AppController, [ User, DatabaseSession ]));

    const user = new User();
    user.isAdmin = false;
    await user.save();

    const admin = new User();
    admin.isAdmin = true;
    await admin.save();

    await request(app)
      .get('/api/products')
      .expect(401);

    let token = '';

    await request(app)
      .post('/login-as-user')
      .send()
      .expect(200)
      .then(response => {
        strictEqual(typeof response.body.token, 'string');
        token = response.body.token;
      });

    await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    await request(app)
      .post('/login-as-admin')
      .send()
      .expect(200)
      .then(response => {
        strictEqual(typeof response.body.token, 'string');
        token = response.body.token;
      });

    await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect([ { id: 1, name: 'chair' } ]);
  });

});
