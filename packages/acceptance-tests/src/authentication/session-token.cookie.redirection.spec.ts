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
  Context, controller, createApp, dependency, ExpressApplication, Get, hashPassword,
  HttpResponseOK, HttpResponseRedirect, Post,
  setSessionCookie, TokenOptional, TokenRequired, ValidateBody, verifyPassword
} from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

describe('[Authentication|session token|cookie|redirection] Users', () => {

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

  @TokenRequired({ store: TypeORMStore, cookie: true })
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
      const response = new HttpResponseRedirect('/home');
      const token = session.getToken();
      setSessionCookie(response, token);
      return response;
    }

    @Post('/login')
    @ValidateBody(credentialsSchema)
    async login(ctx: Context) {
      const user = await getRepository(User).findOne({ email: ctx.request.body.email });

      if (!user) {
        return new HttpResponseRedirect('/login');
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseRedirect('/login');
      }

      const session = await this.store.createAndSaveSessionFromUser(user);
      const response = new HttpResponseRedirect('/home');
      const token = session.getToken();
      setSessionCookie(response, token);
      return response;
    }

    @Post('/logout')
    @TokenOptional({
      cookie: true,
      redirectTo: '/login',
      store: TypeORMStore,
    })
    async logout(ctx: Context) {
      if (ctx.session) {
        await ctx.session.destroy();
      }

      return new HttpResponseRedirect('/login');
    }

    @Get('/home')
    @TokenRequired({ store: TypeORMStore, cookie: true, redirectTo: '/login' })
    home() {
      return new HttpResponseOK('Home page');
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

  it('cannot access protected routes if they are not logged in.', async () => {
    await request(app)
      .get('/api/products')
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Session cookie not found.'
      });

    await request(app)
      .get('/home')
      .expect(302)
      .expect('Location', '/login');
  });

  it('can sign up.', async () => {
    await request(app)
      .post('/signup')
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(302)
      .expect('location', '/home')
      .then(response => {
        strictEqual(Array.isArray(response.header['set-cookie']), true);
        token = response.header['set-cookie'][0].split('sessionID=')[1].split(';')[0];
      });
  });

  it('can access routes once they signed up.', () => {
    return request(app)
      .get('/api/products')
      .set('Cookie', `sessionID=${token}`)
      .expect(200)
      .then(response => {
        deepStrictEqual(response.body, []);
      });
  });

  it('can log out.', () => {
    return request(app)
      .post('/logout')
      .set('Cookie', `sessionID=${token}`)
      .expect(302)
      .expect('location', '/login')
      .then(response => {
        strictEqual(Array.isArray(response.header['set-cookie']), true);
        strictEqual(response.header['set-cookie'][0].split('Max-Age=')[1].split(';')[0], '0');
      });
  });

  it('cannot access routes once they are logged out.', async () => {
    await request(app)
      .get('/api/products')
      .set('Cookie', `sessionID=${token}`)
      .expect(401)
      .expect({
        code: 'invalid_token',
        description: 'token invalid or expired'
      });

    await request(app)
      .get('/home')
      .set('Cookie', `sessionID=${token}`)
      .expect(302)
      .expect('Location', '/login');
  });

  it('can log in.', async () => {
    // Try to login with a wrong email
    await request(app)
      .post('/login')
      .send({ email: 'mary@foalts.org', password: 'password' })
      .expect(302)
      .expect('location', '/login');

    // Try to login with a wrong email
    await request(app)
      .post('/login')
      .send({ email: 'john@foalts.org', password: 'wrong_password' })
      .expect(302)
      .expect('location', '/login');

    // Login with a correct email
    await request(app)
      .post('/login')
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(302)
      .expect('location', '/home')
      .then(response => {
        strictEqual(Array.isArray(response.header['set-cookie']), true);
        token = response.header['set-cookie'][0].split('sessionID=')[1].split(';')[0];
      });
  });

  it('can access routes once they are logged in.', () => {
    return request(app)
      .get('/api/products')
      .set('Cookie', `sessionID=${token}`)
      .expect(200)
      .then(response => {
        deepStrictEqual(response.body, []);
      });
  });

  it('can log out.', () => {
    return request(app)
      .post('/logout')
      .set('Cookie', `sessionID=${token}`)
      .expect(302)
      .expect('location', '/login')
      .then(response => {
        strictEqual(Array.isArray(response.header['set-cookie']), true);
        strictEqual(response.header['set-cookie'][0].split('Max-Age=')[1].split(';')[0], '0');
      });
  });

  it('cannot access routes once they are logged out.', async () => {
    await request(app)
      .get('/api/products')
      .set('Cookie', `sessionID=${token}`)
      .expect(401)
      .expect({
        code: 'invalid_token',
        description: 'token invalid or expired'
      });

    await request(app)
      .get('/home')
      .set('Cookie', `sessionID=${token}`)
      .expect(302)
      .expect('Location', '/login');
  });

});
