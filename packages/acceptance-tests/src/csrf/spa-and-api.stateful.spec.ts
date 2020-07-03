// 3p
import { createConnection, getConnection } from '@foal/typeorm/node_modules/typeorm';
import * as request from 'supertest';

// FoalTS
import {
  controller,
  createApp,
  dependency,
  HttpResponseCreated,
  HttpResponseOK,
  Post,
  setSessionCookie,
  TokenRequired
} from '@foal/core';
import { CsrfTokenRequired, getCsrfToken, setCsrfCookie } from '@foal/csrf';
import { TypeORMStore } from '@foal/typeorm';

describe('[CSRF|spa and api|stateful] Users', () => {

  let app: any;
  let sessionToken: string;
  let csrfToken: string;

  class AuthController {
    @dependency
    store: TypeORMStore;

    @Post('/login')
    async login() {
      const session = await this.store.createAndSaveSessionFromUser({ id: 1 }, { csrfToken: true });

      const response = new HttpResponseOK();
      setSessionCookie(response, session.getToken());
      setCsrfCookie(response, await getCsrfToken(session));
      return response;
    }
  }

  @TokenRequired({
    cookie: true,
    store: TypeORMStore,
  })
  @CsrfTokenRequired()
  class ApiController {
    @Post('/products')
    createProduct() {
      return new HttpResponseCreated();
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
      synchronize: true,
      type: 'sqlite',
    });

    app = createApp(AppController);
  });

  after(async () => {
    await getConnection().close();
    delete process.env.SETTINGS_SESSION_SECRET;
  });

  it('can log in and get a CSRF token.', () => {
    return request(app)
      .post('/login')
      .expect(200)
      .then(response => {
        const cookies = response.header['set-cookie'];
        sessionToken = cookies[0].split('sessionID=')[1].split(';')[0];
        csrfToken = cookies[1].split('csrfToken=')[1].split(';')[0];
      });
  });

  it('cannot access POST routes with no CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [`sessionID=${sessionToken}`])
      .expect(403)
      .expect('Bad csrf token.');
  });

  it('can access POST routes with the CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [`sessionID=${sessionToken}`])
      .set('X-CSRF-TOKEN', csrfToken)
      .expect(201);
  });

});
