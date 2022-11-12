// std
import { strictEqual } from 'assert';

// 3p
import { BaseEntity, Column, Entity, DataSource, PrimaryGeneratedColumn } from 'typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Config, Context, controller, createApp, createSession,
  dependency, Get, Hook, HttpResponseForbidden, HttpResponseOK,
  HttpResponseUnauthorized, IAppController, Post, Store, UseSessions
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAndInitializeDataSource, getTypeORMStorePath } from '../../../common';

describe('Feature: Controlling access with static roles', () => {

  let dataSource: DataSource;

  beforeEach(() => Config.set('settings.session.store', getTypeORMStorePath()));

  afterEach(async () => {
    Config.remove('settings.session.store');
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('Example: A simple access control.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // entities/user.entity.ts
    @Entity()
    class User extends BaseEntity {

      @PrimaryGeneratedColumn()
      id: number;

      @Column('simple-array')
      roles: string[];

    }

    // hooks/role-required.hook.ts
    function RoleRequired(role: string) {
      return Hook((ctx: Context<User|null>) => {
        if (!ctx.user) {
          return new HttpResponseUnauthorized();
        }
        if (!ctx.user.roles.includes(role)) {
          return new HttpResponseForbidden();
        }
      });
    }

    // controllers/api.controller.ts
    class ApiController {
      private products = [ { id: 1, name: 'chair' } ];

      @Get('/products')
      @RoleRequired('admin')
      readProducts() {
        return new HttpResponseOK(this.products);
      }
    }

    /* ======================= DOCUMENTATION END ========================= */

    @UseSessions({
      user: (id: number) => User.findOneBy({ id }),
    })
    class AppController implements IAppController {
      @dependency
      store: Store;

      subControllers = [
        controller('/api', ApiController)
      ];

      @Post('/login-as-user')
      async loginAsUser(ctx: Context) {
        const user = await User.findOneByOrFail({ roles: 'user' });

        ctx.session = await createSession(this.store);
        ctx.session.setUser(user);

        return new HttpResponseOK({ token: ctx.session.getToken() });
      }

      @Post('/login-as-admin')
      async loginAsAdmin(ctx: Context) {
        const user = await User.findOneByOrFail({ roles: 'admin' });

        ctx.session = await createSession(this.store);
        ctx.session.setUser(user);

        return new HttpResponseOK({ token: ctx.session.getToken() });
      }
    }

    const app = await createApp(AppController);
    dataSource = await createAndInitializeDataSource([ User, DatabaseSession ]);

    const user = new User();
    user.roles = [ 'user' ];
    await user.save();

    const admin = new User();
    admin.roles = [ 'admin' ];
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
