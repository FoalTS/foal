// 3p
import * as request from 'supertest';

// FoalTS
import {
  controller,
  createApp,
  ExpressApplication,
  HttpResponseCreated,
  HttpResponseOK,
  Post,
} from '@foal/core';
import { CsrfTokenRequired, getCsrfToken, setCsrfCookie } from '@foal/csrf';

describe('[CSRF|spa and api|stateless] Users', () => {

  let app: ExpressApplication;
  let csrfToken: string;

  class AuthController {
    @Post('/login')
    async login() {
      const response = new HttpResponseOK();
      setCsrfCookie(response, await getCsrfToken());
      return response;
    }
  }

  @CsrfTokenRequired({ doubleSubmitCookie: true })
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
    process.env.SETTINGS_CSRF_SECRET = 'csrf-secret';
    // Custom CSRF cookie name
    process.env.SETTINGS_CSRF_COOKIE_NAME = '_csrf';
    app = createApp(AppController);
  });

  after(async () => {
    delete process.env.SETTINGS_CSRF_SECRET;
    delete process.env.SETTINGS_CSRF_COOKIE_NAME;
  });

  it('can log in and get a CSRF token.', () => {
    return request(app)
      .post('/login')
      .expect(200)
      .then(response => {
        const cookies = response.header['set-cookie'];
        csrfToken = cookies[0].split('_csrf=')[1].split(';')[0];
      });
  });

  it('cannot access POST routes with no CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [`_csrf=${csrfToken}`])
      .expect(403)
      .expect('Bad csrf token.');
  });

  it('can access POST routes with the CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [`_csrf=${csrfToken}`])
      .set('X-CSRF-TOKEN', csrfToken)
      .expect(201);
  });

});
