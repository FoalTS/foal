// std
import { strictEqual } from 'assert';

// 3p
import { DataSource } from 'typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  controller,
  createApp,
  createSession,
  dependency,
  Get,
  HttpResponseOK,
  HttpResponseRedirect,
  Post,
  render,
  UseSessions,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { DatabaseSession, TypeORMStore } from '@foal/typeorm';
import { createFixtureUser, createAndInitializeDataSource, credentialsSchema, readCookie, User } from '../../../common';

describe('Feature: Stateful CSRF protection in a Regular Web App', () => {

  /* ======================= DOCUMENTATION BEGIN ======================= */

  // auth.controller.ts
  class AuthController {
    @dependency
    // "Store" documentation
    store: TypeORMStore;

    @Post('/login')
    @ValidateBody(credentialsSchema)
    @UseSessions({
      cookie: true,
      required: false,
      // Nothing in documentation
      store: TypeORMStore,
    })
    async login(ctx: Context) {
      const user = await User.findOneBy({ email: ctx.request.body.email });

      if (!user) {
        return new HttpResponseRedirect('/login');
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        return new HttpResponseRedirect('/login');
      }

      ctx.session = ctx.session || await createSession(this.store);
      ctx.session.setUser(user);

      return new HttpResponseRedirect('/products');
    }
  }

  // view.controller.ts
  class ViewController {
    @dependency
    // Nothing in documentation
    store: TypeORMStore;

    @Get('/login')
    async login(ctx: Context) {
      return render('./templates/login.html');
    }

    @Get('/products')
    @UseSessions({
      cookie: true,
      redirectTo: '/login',
      required: true,
      // Nothing in documentation
      store: TypeORMStore,
    })
    async index(ctx: Context) {
      return new HttpResponseOK({ csrfToken: ctx.session!.get('csrfToken') });
      // In documentation:
      // return render(
      //   './templates/products.html',
      //   { csrfToken: ctx.session.get('csrfToken') },
      // );
    }
  }

  // api.controller.ts
  @UseSessions({
    cookie: true,
    redirectTo: '/login',
    required: true,
    // Nothing in documentation
    store: TypeORMStore,
  })
  class ApiController {
    @Post('/products')
    createProduct() {
      return new HttpResponseRedirect('/products');
    }
  }

  /* ======================= DOCUMENTATION END ========================= */

  class AppController {
    subControllers = [
      controller('', AuthController),
      controller('', ViewController),
      controller('/api', ApiController),
    ];
  }

  const csrfCookieName = 'Custom-XSRF-Token';

  let dataSource: DataSource;
  let user: User;

  let app: any;
  let sessionToken: string;
  let csrfToken: string;

  before(async () => {
    Config.set('settings.session.csrf.enabled', true);
    Config.set('settings.session.csrf.cookie.name', csrfCookieName);

    dataSource = await createAndInitializeDataSource([ User, DatabaseSession ]);

    user = await createFixtureUser(1);
    await user.save();

    app = await createApp(AppController);
  });

  after(async () => {
    Config.remove('settings.session.csrf.enabled');
    Config.remove('settings.session.csrf.cookie.name');

    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('Step 1: User logs in.', () => {
    return request(app)
      .post('/login')
      .send({
        email: user.email,
        password: 'password1',
      })
      .expect(302)
      .expect('Location', '/products')
      .then(response => {
        const cookies = response.header['set-cookie'] as unknown as string[];
        strictEqual(cookies.length, 2, 'Expected two cookies in the response.');

        sessionToken = readCookie(cookies, 'sessionID').value;
      });
  });

  it('Step 1b: User loads the /products page and gets a CSRF token.', () => {
    return request(app)
      .get('/products')
      .set('Cookie', [
        `sessionID=${sessionToken}`,
        // The CSRF cookie is not required.
      ])
      .expect(200)
      .then(response => {
        csrfToken = response.body.csrfToken;
      });
  });

  it('Step 2: User cannot access POST routes with no CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [
        `sessionID=${sessionToken}`,
        // The CSRF cookie is not required.
      ])
      .expect(403)
      .expect('CSRF token missing or incorrect.');
  });

  it('Step 3: User can access POST routes with the CSRF token.', () => {
    return request(app)
      .post('/api/products')
      .set('Cookie', [
        `sessionID=${sessionToken}`,
        // The CSRF cookie is not required.
      ])
      .set('X-XSRF-TOKEN', csrfToken)
      .expect(302)
      .expect('Location', '/products');
  });

});
