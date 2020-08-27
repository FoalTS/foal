// std
import { strictEqual } from 'assert';

// 3p
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

// FoalTS
import {
  Context,
  controller,
  createApp,
  HttpResponseCreated,
  HttpResponseNoContent,
  HttpResponseUnauthorized,
  Post,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { getSecretOrPrivateKey, JWTRequired, setAuthCookie } from '@foal/jwt';
import { Connection } from 'typeorm';
import { createFixtureUser, createTestConnection, credentialsSchema, readCookie, User } from '../common';

describe('Feature: Stateless CSRF protection in a Single-Page Application', () => {

  /* ======================= DOCUMENTATION BEGIN ======================= */

  // auth.controller.ts
  class AuthController {
    @Post('/login')
    @ValidateBody(credentialsSchema)
    async login(ctx: Context) {
      const user = await User.findOne({ email: ctx.request.body.email });

      if (!user) {
        return new HttpResponseUnauthorized();
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseUnauthorized();
      }

      const token: string = await new Promise((resolve, reject) => {
        sign(
          { email: user.email },
          getSecretOrPrivateKey(),
          { subject: user.id.toString() },
          (err, encoded) => {
            if (err) {
              return reject(err);
            }
            resolve(encoded);
          }
        );
      });

      const response = new HttpResponseNoContent();
      // Do not forget the "await" keyword.
      await setAuthCookie(response, token);
      return response;
    }
  }

  // api.controller.ts
  @JWTRequired({
    cookie: true,
  })
  class ApiController {
    @Post('/products')
    createProduct() {
      return new HttpResponseCreated();
    }
  }

  /* ======================= DOCUMENTATION END ========================= */

  class AppController {
    subControllers = [
      controller('', AuthController),
      controller('/api', ApiController),
    ];
  }

  const csrfCookieName = 'Custom-XSRF-Token';

  let connection: Connection;
  let user: User;

  let app: any;
  let authToken: string;
  let csrfToken: string;

  before(async () => {
    process.env.SETTINGS_JWT_SECRET = 'jwtSecret';
    process.env.SETTINGS_JWT_CSRF_ENABLED = 'true';
    process.env.SETTINGS_JWT_CSRF_COOKIE_NAME = csrfCookieName;

    connection = await createTestConnection([ User ]);

    user = await createFixtureUser(1);
    await user.save();

    app = createApp(AppController);
  });

  after(async () => {
    delete process.env.SETTINGS_JWT_SECRET;
    delete process.env.SETTINGS_JWT_CSRF_ENABLED;
    delete process.env.SETTINGS_JWT_CSRF_COOKIE_NAME;

    await connection.close();
  });

  it('Step 1: User logs in and gets a CSRF token.', () => {
    return request(app)
      .post('/login')
      .send({
        email: user.email,
        password: 'password1',
      })
      .expect(204)
      .then(response => {
        const cookies: string[] = response.header['set-cookie'];
        strictEqual(cookies.length, 2, 'Expected two cookies in the response.');

        authToken = readCookie(cookies, 'auth').value;
        csrfToken = readCookie(cookies, csrfCookieName).value;
      });
  });

  it('Step 2: User cannot access POST routes with no CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [
        `auth=${authToken}`,
        `${csrfCookieName}=${csrfToken}`
      ])
      .expect(403)
      .expect('CSRF token missing or incorrect.');
  });

  it('Step 3: User can access POST routes with the CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [
        `auth=${authToken}`,
        `${csrfCookieName}=${csrfToken}`
      ])
      .set('X-XSRF-TOKEN', csrfToken)
      .expect(201);
  });

});
