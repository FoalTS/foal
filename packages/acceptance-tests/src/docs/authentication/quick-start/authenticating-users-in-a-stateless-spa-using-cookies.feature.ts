// std
import { promisify } from 'util';

// 3p
import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  controller,
  createApp,
  Get,
  hashPassword,
  HttpResponseOK,
  HttpResponseUnauthorized,
  IAppController,
  Post,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { getSecretOrPrivateKey, JWTRequired, removeAuthCookie, setAuthCookie } from '@foal/jwt';
import { createAndInitializeDataSource, readCookie, writeCookie } from '../../../common';

describe('Feature: Authenticating users in a stateless SPA using cookies', () => {

  let dataSource: DataSource;
  let app: any;
  let token: string;
  let response: request.Response|undefined;
  const cookieName = 'auth';

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

  class AuthController {

    @Post('/signup')
    @ValidateBody(credentialsSchema)
    async signup(ctx: Context) {
      const user = new User();
      user.email = ctx.request.body.email;
      user.password = await hashPassword(ctx.request.body.password);
      await user.save();

      const response = new HttpResponseOK();
      await setAuthCookie(response, await this.createJWT(user));
      return response;
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

      const response = new HttpResponseOK();
      await setAuthCookie(response, await this.createJWT(user));
      return response;
    }

    @Post('/logout')
    async logout(ctx: Context) {
      const response = new HttpResponseOK();
      removeAuthCookie(response);
      return response;
    }

    private async createJWT(user: User): Promise<string> {
      const payload = {
        email: user.email,
        id: user.id,
      };

      return promisify(sign as any)(
        payload,
        getSecretOrPrivateKey(),
        { subject: user.id.toString() }
      );
    }
  }

  @JWTRequired({
    cookie: true,
    // Add the line below if you prefer ctx.user
    // to be an instance of User instead of the JWT payload.
    // user: (id: number) => User.findOneBy({ id })
  })
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
    Config.set('settings.jwt.secret', 'Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8=');
    Config.set('settings.jwt.secretEncoding', 'base64');
    app = await createApp(AppController);
    dataSource = await createAndInitializeDataSource([ User ]);
  });

  after(async () => {
    Config.remove('settings.jwt.secret');
    Config.remove('settings.jwt.secretEncoding');
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  function setCookieInBrowser(response: request.Response): void {
    try {
      // There may not be a cookie in the response.
      token = readCookie(response.get('Set-Cookie') || [], cookieName).value;
    } catch {}
  }

  beforeEach(() => response = undefined);

  afterEach(() => {
    if (response) {
      setCookieInBrowser(response);
    }
  });

  it('Step: Users cannot access protected routes if they are not logged in.', async () => {
    response = await request(app)
      .get('/api/products')
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Auth cookie not found.'
      });
  });

  it('Step: Users can sign up.', async () => {
    response = await request(app)
      .post('/auth/signup')
      .set('Cookie', writeCookie(cookieName, token))
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(200);
  });

  it('Step: Users can access routes once they signed up.', async () => {
    response = await request(app)
      .get('/api/products')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200)
      .expect([]);
  });

  it('Step: Users can log out.', async () => {
    response = await request(app)
      .post('/auth/logout')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200);
  });

  it('Step: Users cannot access routes once they are logged out.', async () => {
    response = await request(app)
      .get('/api/products')
      // .set('Cookie', writeCookie(cookieName, token))
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Auth cookie not found.'
      });
  });

  it('Step: Users can log in.', async () => {
    // Try to login with a wrong email
    response = await request(app)
      .post('/auth/login')
      .set('Cookie', writeCookie(cookieName, token))
      .send({ email: 'mary@foalts.org', password: 'password' })
      .expect(401);
    setCookieInBrowser(response);

    // Try to login with a wrong password
    response = await request(app)
      .post('/auth/login')
      .set('Cookie', writeCookie(cookieName, token))
      .send({ email: 'john@foalts.org', password: 'wrong_password' })
      .expect(401);
    setCookieInBrowser(response);

    // Login with a correct email
    response = await request(app)
      .post('/auth/login')
      .set('Cookie', writeCookie(cookieName, token))
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(200);
  });

  it('Step: Users can access routes once they are logged in.', async () => {
    response = await request(app)
      .get('/api/products')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200)
      .expect([]);
  });

  it('Step: Users can log out.', async () => {
    response = await request(app)
      .post('/auth/logout')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200);
  });

  it('Step: Users cannot access routes once they are logged out.', async () => {
    response = await request(app)
      .get('/api/products')
      // .set('Cookie', writeCookie(cookieName, token))
      .expect(400)
      .expect({
        code: 'invalid_request',
        description: 'Auth cookie not found.'
      });
  });

});
