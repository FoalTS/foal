// std
import { notStrictEqual } from 'assert';

// 3p
import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  controller,
  createApp,
  createSession,
  dependency,
  Get,
  hashPassword,
  HttpResponseOK,
  HttpResponseUnauthorized,
  IAppController,
  Post,
  Store,
  UserRequired,
  UseSessions,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAndInitializeDataSource, getTypeORMStorePath } from '../../../common';

describe('Feature: Authenticating users in a stateful SPA using the `Authorization` header', () => {

  let dataSource: DataSource;
  let app: any;
  let token: string;

  /* ======================= DOCUMENTATION BEGIN ======================= */

  @Entity()
  class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
  }

  const credentialsSchema = {
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  };

  @UseSessions()
  class AuthController {
    @dependency
    store: Store;

    @Post('/signup')
    @ValidateBody(credentialsSchema)
    async signup(ctx: Context) {
      const user = new User();
      user.email = ctx.request.body.email;
      user.password = await hashPassword(ctx.request.body.password);
      await user.save();

      ctx.session = await createSession(this.store);
      ctx.session.setUser(user);

      return new HttpResponseOK({
        token: ctx.session.getToken()
      });
    }

    @Post('/login')
    @ValidateBody(credentialsSchema)
    async login(ctx: Context) {
      const user = await User.findOneBy({ email: ctx.request.body.email });

      if (!user) {
        return new HttpResponseUnauthorized();
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseUnauthorized();
      }

      ctx.session = await createSession(this.store);
      ctx.session.setUser(user);

      return new HttpResponseOK({
        token: ctx.session.getToken()
      });
    }

    @Post('/logout')
    async logout(ctx: Context) {
      if (ctx.session) {
        await ctx.session.destroy();
      }

      return new HttpResponseOK();
    }
  }

  // The `request` option returns a pretty message if the Authorization header is not here.
  @UseSessions({
    required: true,
    user: (id: number) => User.findOneBy({ id }),
  })
  @UserRequired()
  class ApiController {
    @Get('/products')
    readProducts() {
      return new HttpResponseOK([]);
    }
  }

  class AppController implements IAppController {

    subControllers = [
      controller('/auth', AuthController),
      controller('/api', ApiController),
    ];

  }

  /* ======================= DOCUMENTATION END ========================= */

  before(async () => {
    Config.set('settings.session.store', getTypeORMStorePath());
    app = await createApp(AppController);
    dataSource = await createAndInitializeDataSource([ User, DatabaseSession ]);
  });

  after(async () => {
    Config.remove('settings.session.store');
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  function formatBearer(token: string) {
    return `Bearer ${token}`;
  }

  it('Step: Users cannot access protected routes if they are not logged in.', async () => {
    await request(app)
      .get('/api/products')
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Authorization header not found.'
      });
  });

  it('Step: Users can sign up.', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(200);

    notStrictEqual(response.body.token, undefined);
    token = response.body.token;
  });

  it('Step: Users can access routes once they signed up.', async () => {
    await request(app)
      .get('/api/products')
      .set('Authorization', formatBearer(token))
      .expect(200)
      .expect([]);
  });

  it('Step: Users can log out.', async () => {
    await request(app)
      .post('/auth/logout')
      .set('Authorization', formatBearer(token))
      .expect(200);
  });

  it('Step: Users cannot access routes once they are logged out.', async () => {
    await request(app)
      .get('/api/products')
      .set('Authorization', formatBearer(token))
      .expect(401)
      .expect({
        code: 'invalid_token',
        description: 'token invalid or expired'
      });
  });

  it('Step: Users can log in.', async () => {
    // Try to login with a wrong email
    await request(app)
      .post('/auth/login')
      .send({ email: 'mary@foalts.org', password: 'password' })
      .expect(401);

    // Try to login with a wrong password
    await request(app)
      .post('/auth/login')
      .send({ email: 'john@foalts.org', password: 'wrong_password' })
      .expect(401);

    // Login with a correct email
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(200);

    notStrictEqual(response.body.token, undefined);
    token = response.body.token;
  });

  it('Step: Users can access routes once they are logged in.', async () => {
    await request(app)
      .get('/api/products')
      .set('Authorization', formatBearer(token))
      .expect(200)
      .expect([]);
  });

  it('Step: Users can log out.', async () => {
    await request(app)
      .post('/auth/logout')
      .set('Authorization', formatBearer(token))
      .expect(200);
  });

  it('Step: Users cannot access routes once they are logged out.', async () => {
    await request(app)
      .get('/api/products')
      .set('Authorization', formatBearer(token))
      .expect(401)
      .expect({
        code: 'invalid_token',
        description: 'token invalid or expired'
      });
  });

});
