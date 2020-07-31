// 3p
import { createConnection, getConnection } from '@foal/typeorm/node_modules/typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Context,
  controller,
  createApp,
  dependency,
  Get,
  HttpResponseCreated,
  HttpResponseOK,
  Post,
  setSessionCookie,
  TokenRequired
} from '@foal/core';
import { CsrfTokenRequired, getCsrfToken } from '@foal/csrf';
import { DatabaseSession, TypeORMStore } from '@foal/typeorm';

describe('[CSRF|regular web app|stateful] Users', () => {

  let app: any;
  let sessionToken: string;
  let csrfToken: string;

  class AuthController {
    @dependency
    store: TypeORMStore;

    @Post('/login')
    async login() {
      const session = await this.store.createAndSaveSession({ userId: 1 }, { csrfToken: true });

      const response = new HttpResponseOK();
      setSessionCookie(response, session.getToken());
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

  @TokenRequired({
    cookie: true,
    redirectTo: '/login',
    store: TypeORMStore,
  })
  class PageController {
    @Get('/home')
    async home(ctx: Context) {
      // Normally in an HTML template
      return new HttpResponseOK({ csrfToken: await getCsrfToken(ctx.session) });
    }
  }

  class AppController {
    subControllers = [
      AuthController,
      PageController,
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

  it('can log in and get a CSRF token.', async () => {
    await request(app)
      .post('/login')
      .expect(200)
      .then(response => {
        const cookies = response.header['set-cookie'];
        sessionToken = cookies[0].split('sessionID=')[1].split(';')[0];
      });

    await request(app)
      .get('/home')
      .set('Cookie', [`sessionID=${sessionToken}`])
      .expect(200)
      .then(response => {
        csrfToken = response.body.csrfToken;
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
