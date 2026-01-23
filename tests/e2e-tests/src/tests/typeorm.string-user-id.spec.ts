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
  Hook,
  HttpResponseForbidden,
  HttpResponseNoContent,
  HttpResponseOK,
  HttpResponseUnauthorized,
  PasswordService,
  Post,
  ServiceManager,
  UseSessions,
  ValidateBody
} from '@foal/core';
import { DatabaseSession, TypeORMStore } from '@foal/typeorm';
import * as request from 'supertest';

// FoalTS
import {
  BaseEntity,
  Column,
  DataSource,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { createAndInitializeDataSource, getTypeORMStorePath } from '../common';

describe('[Sample] TypeORM Store with String User IDs', async () => {

  let app: any;
  let token: string;
  // Using a hardcoded UUID to avoid adding uuid as a dependency
  const userId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  @Entity()
  class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
    user: id => User.findOneBy({ id }),
    userIdType: 'string',
    required: true
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
    store: TypeORMStore;

    @dependency
    passwordService: PasswordService;

    @Post('/logout')
    @UseSessions({ required: false, })
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

      if (!await this.passwordService.verifyPassword(ctx.request.body.password, user.password)) {
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
    Config.set('settings.session.store', getTypeORMStorePath());

    dataSource = await createAndInitializeDataSource([User, DatabaseSession]);

    const serviceManager = new ServiceManager();
    const passwordService = serviceManager.get(PasswordService);
    const user = new User();
    user.id = userId;
    user.email = 'john@foalts.org';
    user.password = await passwordService.hashPassword('password');
    user.isAdmin = false;
    await user.save();

    app = await createApp(AppController, { serviceManager });
  });

  after(async () => {
    Config.remove('settings.session.store');

    return dataSource.destroy();
  });

  it('should work with string user IDs.', async () => {
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

    /* Verify the session has the string user ID stored correctly */

    const session = await dataSource.getRepository(DatabaseSession).findOneBy({ id: token });
    strictEqual(session?.user_id, null);
    strictEqual(session?.user_id_str, userId);

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
