// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import {
  Column, createConnection, Entity, getConnection, getRepository,
  PrimaryGeneratedColumn
} from '@foal/typeorm/node_modules/typeorm';
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

// FoalTS
import {
  Config, Context, controller, createApp, ExpressApplication,
  Get, hashPassword, HttpResponseOK,
  HttpResponseUnauthorized, Post, ValidateBody, verifyPassword
} from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { fetchUser } from '@foal/typeorm';

describe('[Authentication|JWT|no cookie|no redirection] Users', () => {

  let app: ExpressApplication;
  let token: string;

  let blackList: string[];

  function isBlackListed(token: string): boolean {
    return blackList.includes(token);
  }

  @Entity()
  class User {
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

  @JWTRequired({ user: fetchUser(User), blackList: isBlackListed })
  class ApiController {
    @Get('/products')
    readProducts(ctx: Context<User>) {
      return new HttpResponseOK({
        email: ctx.user.email
      });
    }
  }

  class AuthController {

    @Post('/signup')
    @ValidateBody(credentialsSchema)
    async signup(ctx: Context) {
      const user = new User();
      user.email = ctx.request.body.email;
      user.password = await hashPassword(ctx.request.body.password);
      await getRepository(User).save(user);

      return this.generateLoginResponse(user);
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

      return this.generateLoginResponse(user);
    }

    private async generateLoginResponse(user: User): Promise<HttpResponseOK> {
      const payload = {
        email: user.email,
        id: user.id,
      };
      const secret = Config.get<string>('settings.jwt.secretOrPublicKey');

      const token = await new Promise<string>((resolve, reject) => {
        sign(payload, secret, { subject: user.id.toString() }, (err, value: string) => {
          if (err) {
            return reject(err);
          }
          resolve(value);
        });
      });

      return new HttpResponseOK({
        token
      });
    }
  }

  class AppController {
    subControllers = [
      AuthController,
      controller('/api', ApiController),
    ];
  }

  before(async () => {
    process.env.SETTINGS_JWT_SECRET_OR_PUBLIC_KEY = 'session-secret';
    await createConnection({
      database: 'e2e_db.sqlite',
      dropSchema: true,
      entities: [ User ],
      synchronize: true,
      type: 'sqlite',
    });

    blackList = [];

    app = createApp(AppController);
  });

  after(async () => {
    await getConnection().close();
    delete process.env.SETTINGS_JWT_SECRET_OR_PUBLIC_KEY;
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
        deepStrictEqual(response.body, {
          email: 'john@foalts.org'
        });
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
        deepStrictEqual(response.body, {
          email: 'john@foalts.org'
        });
      });
  });

  it('cannot access routes if the token is blacklisted.', () => {
    blackList.push(token);
    return request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)
      .expect({
        code: 'invalid_token',
        description: 'jwt revoked'
      });
  });

});
