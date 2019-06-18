import {
  Context, controller, createApp, dependency, Get, hashPassword,
  HttpResponseNoContent, HttpResponseOK, HttpResponseUnauthorized,
  Post, Session, TokenRequired, ValidateBody, verifyPassword
} from '@foal/core';
import { FoalSession, TypeORMStore } from '@foal/typeorm';
import {
  Column, createConnection, Entity, getConnection, getRepository,
  PrimaryGeneratedColumn
} from '@foal/typeorm/node_modules/typeorm';
import { deepStrictEqual, strictEqual } from 'assert';
import * as request from 'supertest';

describe('[Authentication|auth token|no cookie, no redirection] Users', () => {

  let app: any;
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

  class LoginController {
    @dependency
    store: TypeORMStore;

    @Get('/logout')
    @TokenRequired({ store: TypeORMStore })
    async logout(ctx: Context<any, Session>) {
      await this.store.destroy(ctx.session.sessionID);
      return new HttpResponseNoContent();
    }

    @Post('/login')
    @ValidateBody({
      additionalProperties: false,
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      },
      required: [ 'email', 'password' ],
      type: 'object',
    })
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
  }

  class AppController {
    subControllers = [
      controller('', LoginController),
      controller('/api', ApiController),
    ];
  }

  before(async () => {
    process.env.SETTINGS_SESSION_SECRET = 'session-secret';
    await createConnection({
      database: 'e2e_db.sqlite',
      dropSchema: true,
      entities: [ User, FoalSession ],
      synchronize: true,
      type: 'sqlite',
    });

    const user = new User();
    user.email = 'john@foalts.org';
    user.password = await hashPassword('password');
    await getRepository(User).save(user);

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

    // Try to login with a wrong email
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
      .get('/logout')
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
