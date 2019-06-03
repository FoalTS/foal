// std
import { ok } from 'assert';

// 3p
import { Context, createApp, Get, HttpResponseOK, HttpResponseUnauthorized, Post } from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { sign } from 'jsonwebtoken';
import * as request from 'supertest';

const secret = 'my_strong_secret';

before(() => process.env.SETTINGS_JWT_SECRET_OR_PUBLIC_KEY = secret);
after(() => process.env.SETTINGS_JWT_SECRET_OR_PUBLIC_KEY = '');

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

const users: User[] = [
  { id: 1, username: 'John', isAdmin: true },
  { id: 2, username: 'Mary', isAdmin: false },
];

it('JWT test (no cookie)', async () => {

  const blackList: string[] = [];

  async function fetchUser(id): Promise<User|undefined> {
    return users.find(user => user.id.toString() === id);
  }

  function isBlackListed(token: string): boolean {
    return blackList.includes(token);
  }

  class AppController {
    @Post('/login')
    async logIn(ctx: Context) {
      const user = users.find(user => user.username === ctx.request.body.username);
      if (!user) {
        return new HttpResponseUnauthorized();
      }
      const payload = {
        id: user.id,
        username: user.username
      };

      const jwt = await new Promise((resolve, reject) => {
        sign(payload, secret, { subject: user.id.toString() }, (err, value) => {
          if (err) { reject(err); } else { resolve(value); }
        });
      });
      return new HttpResponseOK(jwt);
    }

    @Get('/is-admin')
    @JWTRequired({ user: fetchUser, blackList: isBlackListed })
    async isAdmin(ctx) {
      return new HttpResponseOK(ctx.user.isAdmin);
    }
  }

  const app = createApp(AppController);

  /* Try to login with a wrong username */

  await request(app)
    .post('/login')
    .send({ username: 'Someone' })
    .expect(401);

  /* Login with a correct username */

  let jwt = '';
  await request(app)
    .post('/login')
    .send({ username: 'John' })
    .expect(200)
    .then(data => jwt = data.text);

  /* Request /is-admin without the jwt */

  await request(app)
    .get('/is-admin')
    .expect(400)
    .expect({
      code: 'invalid_request',
      description: 'Authorization header not found.'
    });

  /* Request /is-admin with a bad jwt */

  await request(app)
    .get('/is-admin')
    .set('Authorization', 'Bearer hello')
    .expect(401)
    .expect({
      code: 'invalid_token',
      description: 'jwt malformed'
    });

  /* Request /is-admin with the correct jwt */

  await request(app)
    .get('/is-admin')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(200)
    .expect('true');

  /* Add the token to the black list and request /is-admin again */

  blackList.push(jwt);

  await request(app)
    .get('/is-admin')
    .set('Authorization', `Bearer ${jwt}`)
    .expect(401)
    .expect({
      code: 'invalid_token',
      description: 'jwt revoked'
    });
});

it('JWT test (with cookies)', async () => {
  class AppController {
    @Post('/login')
    async logIn(ctx: Context) {
      const user = users.find(user => user.username === ctx.request.body.username);
      if (!user) {
        return new HttpResponseUnauthorized();
      }
      const payload = {
        id: user.id,
        username: user.username
      };

      const jwt = await new Promise((resolve, reject) => {
        sign(payload, secret, { subject: user.id.toString() }, (err, value) => {
          if (err) { reject(err); } else { resolve(value); }
        });
      });

      return new HttpResponseOK()
        .setCookie('auth', jwt as string);
    }

    @Get('/get-username')
    @JWTRequired({ cookie: true })
    async getUsername(ctx) {
      return new HttpResponseOK(ctx.user.username);
    }
  }

  const app = createApp(AppController);

  /* Try to login with a wrong username */

  await request(app)
    .post('/login')
    .send({ username: 'Someone' })
    .expect(401);

  /* Login with a correct username */

  let jwt = '';
  await request(app)
    .post('/login')
    .send({ username: 'John' })
    .expect(200)
    .then(data => {
      ok(Array.isArray(data.header['set-cookie']));
      jwt = data.header['set-cookie'][0].split(';')[0].split('auth=')[1];
    });

  /* Request /get-username without the jwt */

  await request(app)
    .get('/get-username')
    .expect(400)
    .expect({
      code: 'invalid_request',
      description: 'Auth cookie not found.'
    });

  /* Request /get-username with a bad jwt */

  await request(app)
    .get('/get-username')
    .set('Cookie', 'auth=hello')
    .expect(401)
    .expect({
      code: 'invalid_token',
      description: 'jwt malformed'
    });

  /* Request /get-username with the correct jwt */

  await request(app)
    .get('/get-username')
    .set('Cookie', `auth=${jwt};`)
    .expect(200)
    .expect('John');
});
