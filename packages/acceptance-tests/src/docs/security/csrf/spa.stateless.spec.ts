// std
import { strictEqual } from 'assert';

// 3p
import { DataSource } from '@foal/typeorm/node_modules/typeorm';
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  controller,
  HttpResponseCreated,
  HttpResponseNoContent,
  HttpResponseUnauthorized,
  Post,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { getSecretOrPrivateKey, JWTRequired, setAuthCookie } from '@foal/jwt';
import { createAppWithDB, createFixtureUser, credentialsSchema, readCookie, User } from '../../../common';

describe('Feature: Stateless CSRF protection in a Single-Page Application', () => {

  /* ======================= DOCUMENTATION BEGIN ======================= */

  // auth.controller.ts
  class AuthController {
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

      const token: string = await new Promise((resolve, reject) => {
        sign(
          { email: user.email },
          getSecretOrPrivateKey(),
          { subject: user.id.toString() },
          (err: any, encoded: any) => {
            if (err) {
              return reject(err);
            }
            resolve(encoded as string);
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

  let dataSource: DataSource;
  let user: User;

  let app: any;
  let authToken: string;
  let csrfToken: string;

  before(async () => {
    Config.set('settings.jwt.secret', 'jwtSecret');
    Config.set('settings.jwt.csrf.enabled', true);
    Config.set('settings.jwt.csrf.cookie.name', csrfCookieName);

    ({ app, dataSource }  = await createAppWithDB(AppController, [ User ]));

    user = await createFixtureUser(1);
    await user.save();
  });

  after(async () => {
    Config.remove('settings.jwt.secret');
    Config.remove('settings.jwt.csrf.enabled');
    Config.remove('settings.jwt.csrf.cookie.name');

    await dataSource.destroy();
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
