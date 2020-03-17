// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import {
  Column, createConnection, Entity, getConnection, getRepository,
  PrimaryGeneratedColumn
} from '@foal/typeorm/node_modules/typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Context, controller, createApp, dependency, ExpressApplication, Get,
  hashPassword, HttpResponseNoContent, HttpResponseOK,
  HttpResponseUnauthorized, Post, TokenOptional, TokenRequired, ValidateBody, verifyPassword
} from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

describe('[Authentication|session token|no cookie|no redirection] Users', () => {

  let app: ExpressApplication;
  let token: string;

  @Entity()
  class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
  }

  @TokenRequired({ store: TypeORMStore })
  class ApiController {
    @Get('/products')
    readProducts() {
      return new HttpResponseOK([]);
    }
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

  class AuthController {
    @dependency
    store: TypeORMStore;

    @Post('/signup')
    @ValidateBody(credentialsSchema)
    async signup(ctx: Context) {
      const user = new User();
      user.email = ctx.request.body.email;
      user.password = await hashPassword(ctx.request.body.password);
      await getRepository(User).save(user);

      const session = await this.store.createAndSaveSessionFromUser(user);
      return new HttpResponseOK({
        token: session.getToken()
      });
    }

    @Post('/login')
    @ValidateBody(credentialsSchema)
    async login(ctx: Context) {
      const user = await getRepository(User).findOne({ email: ctx.request.body.email });

      if (!user) {
        return new HttpResponseUnauthorized();
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseUnauthorized();
      }

      const session = await this.store.createAndSaveSessionFromUser(user);
      return new HttpResponseOK({
        token: session.getToken()
      });
    }

    @Post('/logout')
    @TokenOptional({ store: TypeORMStore })
    async logout(ctx: Context) {
      if (ctx.session) {
        await ctx.session.destroy();
      }

      return new HttpResponseNoContent();
    }
  }

  class AppController {
    subControllers = [
      AuthController,
      controller('/api', ApiController),
    ];
  }

  before(async () => {
    process.env.SETTINGS_SESSION_SECRET = 'session-secret';
    await createConnection({
      database: 'e2e_db.sqlite',
      dropSchema: true,
      entities: [ User ],
      synchronize: true,
      type: 'sqlite',
    });

    app = createApp(AppController);
  });

  after(async () => {
    await getConnection().close();
    delete process.env.SETTINGS_SESSION_SECRET;
  });

  it('cannot access protected routes if they are not logged in.', () => {
    return request(app)
      .get('/api/products')
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Authorization header not found.'
      });
  });

  it('can sign up.', async () => {
    await request(app)
      .post('/signup')
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(200)
      .then(response => {
        strictEqual(typeof response.body.token, 'string');
        token = response.body.token;
      });
  });

  it('can access routes once they signed up.', () => {
    return request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        deepStrictEqual(response.body, []);
      });
  });

  it('can log out.', () => {
    return request(app)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('cannot access routes once they are logged out.', () => {
    return request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect({
        code: 'invalid_token',
        description: 'token invalid or expired'
      });
  });

  it('can log in.', async () => {
    // Try to login with a wrong email
    await request(app)
      .post('/login')
      .send({ email: 'mary@foalts.org', password: 'password' })
      .expect(401);

    // Try to login with a wrong email
    await request(app)
      .post('/login')
      .send({ email: 'john@foalts.org', password: 'wrong_password' })
      .expect(401);

    // Login with a correct email
    await request(app)
      .post('/login')
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(200)
      .then(response => {
        strictEqual(typeof response.body.token, 'string');
        token = response.body.token;
      });
  });

  it('can access routes once they are logged in.', () => {
    return request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(response => {
        deepStrictEqual(response.body, []);
      });
  });

  it('can log out.', () => {
    return request(app)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('cannot access routes once they are logged out.', () => {
    return request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect({
        code: 'invalid_token',
        description: 'token invalid or expired'
      });
  });

});
