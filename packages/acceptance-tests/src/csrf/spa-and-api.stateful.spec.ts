// 3p
import { createConnection, getConnection } from '@foal/typeorm/node_modules/typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Context,
  controller,
  createApp,
  createSession,
  dependency,
  generateToken,
  HttpResponseCreated,
  HttpResponseOK,
  Post,
  TokenOptional,
  TokenRequired,
} from '@foal/core';
import { CsrfTokenRequired, getCsrfToken, setCsrfCookie } from '@foal/csrf';
import { DatabaseSession, TypeORMStore } from '@foal/typeorm';

describe('[CSRF|spa and api|stateful] Users', () => {

  let app: any;
  let sessionToken: string;
  let csrfToken: string;

  class AuthController {
    @dependency
    store: TypeORMStore;

    @Post('/login')
    @TokenOptional({
      cookie: true,
      store: TypeORMStore,
    })
    async login(ctx: Context) {
      ctx.session = await createSession(this.store);
      ctx.session.set('csrfToken', await generateToken());
      ctx.session.setUser({ id: 1 });

      const response = new HttpResponseOK();
      setCsrfCookie(response, await getCsrfToken(ctx.session));
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
    await createConnection({
      database: 'e2e_db.sqlite',
      dropSchema: true,
      entities: [ DatabaseSession ],
      synchronize: true,
      type: 'sqlite',
    });

    app = createApp(AppController);
  });

  after(async () => {
    await getConnection().close();
  });

  it('can log in and get a CSRF token.', () => {
    return request(app)
      .post('/login')
      .expect(200)
      .then(response => {
        const cookies = response.header['set-cookie'];
        csrfToken = cookies[0].split('csrfToken=')[1].split(';')[0];
        sessionToken = cookies[1].split('sessionID=')[1].split(';')[0];
      });
  });

  it('cannot access POST routes with no CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [`sessionID=${sessionToken}`])
      .expect(403)
      .expect('CSRF token missing or incorrect.');
  });

  it('can access POST routes with the CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [`sessionID=${sessionToken}`])
      .set('X-CSRF-TOKEN', csrfToken)
      .expect(201);
  });

});
