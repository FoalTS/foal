// std
import { strictEqual } from 'assert';

// 3p
import {
  Config,
  Context,
  createApp,
  createSession,
  dependency,
  Get,
  hashPassword,
  Hook,
  HttpResponseForbidden,
  HttpResponseNoContent,
  HttpResponseOK,
  HttpResponseUnauthorized,
  Post,
  UseSessions,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { RedisStore } from '@foal/redis';
import { createClient } from 'redis';
import * as request from 'supertest';
import { ObjectId as ObjectId2 } from 'mongodb';

// FoalTS
import {
  BaseEntity,
  Column,
  DataSource,
  Entity,
  ObjectId,
  ObjectIdColumn
} from 'typeorm';
import { createAndInitializeDataSource } from '../common';

describe('[Sample] MongoDB & Redis Store', async () => {

  let app: any;
  let token: string;
  let redisClient: ReturnType<typeof createClient>;

  @Entity()
  class User extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    isAdmin: boolean;
  }

  function AdminRequired() {
    return Hook((ctx: Context<User>) => {
      if (!ctx.user.isAdmin) {
        return new HttpResponseForbidden();
      }
    });
  }

  @UseSessions({
    user: id => User.findOneBy({ _id: new ObjectId2(id) }),
    userIdType: 'string',
    store: RedisStore,
    required: true,
  })
  class MyController {
    @Get('/foo')
    foo() {
      return new HttpResponseOK();
    }

    @Get('/bar')
    @AdminRequired()
    bar() {
      return new HttpResponseOK();
    }
  }

  class AuthController {
    @dependency
    store: RedisStore;

    @Post('/logout')
    @UseSessions({ store: RedisStore, required: false, })
    async logout(ctx: Context) {
      if (ctx.session) {
        await ctx.session.destroy();
      }

      return new HttpResponseNoContent();
    }

    @Post('/login')
    @ValidateBody({
      additionalProperties: false,
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      },
      required: ['email', 'password'],
      type: 'object',
    })
    async login(ctx: Context) {
      const user = await User.findOneBy({ email: ctx.request.body.email });

      if (!user) {
        return new HttpResponseUnauthorized();
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseUnauthorized();
      }

      const session = await createSession(this.store);
      session.setUser(user);
      await session.commit();

      return new HttpResponseOK({
        token: session.getToken()
      });
    }
  }

  class AppController {
    subControllers = [
      MyController,
      AuthController
    ];
  }

  let dataSource: DataSource;

  before(async () => {
    const MONGODB_URI = 'mongodb://localhost:27017/e2e_db';
    const REDIS_URI = 'redis://localhost:6380';

    Config.set('settings.mongodb.uri', MONGODB_URI);
    Config.set('settings.redis.uri', REDIS_URI);

    dataSource = await createAndInitializeDataSource([User], {
      database: 'e2e_db',
      type: 'mongodb',
    });

    redisClient = createClient({ url: REDIS_URI });
    await redisClient.connect();

    await redisClient.flushDb();

    const user = new User();
    user.email = 'john@foalts.org';
    user.password = await hashPassword('password');
    user.isAdmin = false;
    await user.save();

    app = await createApp(AppController);
  });

  after(() => {
    Config.remove('settings.mongodb.uri');
    Config.remove('settings.redis.uri');

    return Promise.all([
      dataSource.destroy(),
      app.foal.services.get(RedisStore).close(),
      redisClient.quit(),
    ]);
  });

  it('should work.', async () => {
    /* Try to access routes that require authentication and a specific permission */

    await Promise.all([
      request(app).get('/foo').expect(400),
      request(app).get('/bar').expect(400),
    ]);

    /* Try to login with a wrong email */

    await request(app)
      .post('/login')
      .send({ email: 'mary@foalts.org', password: 'password' })
      .expect(401);

    /* Try to login with a wrong password */

    await request(app)
      .post('/login')
      .send({ email: 'john@foalts.org', password: 'wrong-password' })
      .expect(401);

    /* Log in */

    await request(app)
      .post('/login')
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(200)
      .then(response => {
        strictEqual(typeof response.body.token, 'string');
        token = response.body.token;
      });

    /* Access and try to access routes that require authentication and a specific permission */

    await Promise.all([
      request(app).get('/foo').set('Authorization', `Bearer ${token}`).expect(200),
      request(app).get('/bar').set('Authorization', `Bearer ${token}`).expect(403),
    ]);

    /* Add the admin group and permission */

    const user2 = await User.findOneBy({ email: 'john@foalts.org' });
    if (!user2) {
      throw new Error('John was not found in the database.');
    }

    user2.isAdmin = true;
    await user2.save();

    /* Access the route that requires a specific permission */

    await request(app).get('/bar').set('Authorization', `Bearer ${token}`).expect(200);

    /* Log out */

    await request(app).post('/logout').set('Authorization', `Bearer ${token}`).expect(204);

    /* Try to access routes that require authentication and a specific permission */

    await Promise.all([
      request(app).get('/foo').set('Authorization', `Bearer ${token}`).expect(401),
      request(app).get('/bar').set('Authorization', `Bearer ${token}`).expect(401),
    ]);
  });

});
