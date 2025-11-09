// std
import { strictEqual } from 'assert';

// 3p
import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as request from 'supertest';

// FoalTS
import {
  Config,
  Context,
  controller,
  createApp,
  dependency,
  Get,
  hashPassword,
  HttpResponseOK,
  HttpResponseRedirect,
  IAppController,
  Post,
  render,
  Store,
  UserRequired,
  UseSessions,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { DatabaseSession } from '@foal/typeorm';
import { createAndInitializeDataSource, getTypeORMStorePath, readCookie, writeCookie } from '../../../common';

describe('Feature: Authenticating users in a statefull SSR application using cookies', () => {

  let dataSource: DataSource;
  let app: any;
  let token: string;
  let response: request.Response|undefined;
  const cookieName = 'sessionID';

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

      ctx.session!.setUser(user);
      await ctx.session!.regenerateID();

      return new HttpResponseRedirect('/');
    }

    @Post('/login')
    @ValidateBody(credentialsSchema)
    async login(ctx: Context) {
      const user = await User.findOneBy({ email: ctx.request.body.email });

      if (!user) {
        ctx.session!.set('errorMessage', 'Unknown email.', { flash: true });
        return new HttpResponseRedirect('/login');
      }

      if (!await verifyPassword(ctx.request.body.password, user.password)) {
        ctx.session!.set('errorMessage', 'Invalid password.', { flash: true });
        return new HttpResponseRedirect('/login');
      }

      ctx.session!.setUser(user);
      await ctx.session!.regenerateID();

      return new HttpResponseRedirect('/');
    }

    @Post('/logout')
    async logout(ctx: Context) {
      await ctx.session!.destroy();

      return new HttpResponseRedirect('/login');
    }
  }

  @UserRequired()
  class ApiController {
    @Get('/products')
    readProducts() {
      return new HttpResponseOK([]);
    }
  }

  @UseSessions({
    cookie: true,
    user: (id: number) => User.findOneBy({ id }),
  })
  class AppController implements IAppController {
    // This line is required.
    @dependency
    store: Store;

    subControllers = [
      controller('/auth', AuthController),
      controller('/api', ApiController),
    ];

    @Get('/')
    @UserRequired({ redirectTo: '/login' })
    index() {
      // Not in the documentation: process.cwd()
      return render('./assets/authentication/quick-start/templates/index.html', {}, process.cwd());
    }

    @Get('/login')
    login(ctx: Context) {
      // Not in the documentation: process.cwd()
      return render('./assets/authentication/quick-start/templates/login.html', {
        errorMessage: ctx.session!.get<string>('errorMessage', '')
      }, process.cwd());
    }

  }

  /* ======================= DOCUMENTATION END ========================= */

  before(async () => {
    Config.set('settings.session.store', getTypeORMStorePath());
    app = await createApp(AppController);
    dataSource = await createAndInitializeDataSource([ User, DatabaseSession ]);
  });

  after(async () => {
    Config.remove('settings.session.store');
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  function setCookieInBrowser(response: request.Response): void {
    token = readCookie(response.get('Set-Cookie') || [], cookieName).value;
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
      .expect(401);

    response = await request(app)
      .get('/')
      .expect(302)
      .expect('Location', '/login');
  });

  it('Step: Users can sign up.', async () => {
    response = await request(app)
      .post('/auth/signup')
      .set('Cookie', writeCookie(cookieName, token))
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(302)
      .expect('Location', '/');
  });

  it('Step: Users can access routes once they signed up.', async () => {
    response = await request(app)
      .get('/api/products')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200)
      .expect([]);

    response = await request(app)
      .get('/')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200);
  });

  it('Step: Users can log out.', async () => {
    response = await request(app)
      .post('/auth/logout')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(302)
      .expect('Location', '/login');
  });

  it('Step: Users cannot access routes once they are logged out.', async () => {
    response = await request(app)
      .get('/api/products')
      // .set('Cookie', writeCookie(cookieName, token))
      .expect(401);

    response = await request(app)
      .get('/')
      // .set('Cookie', writeCookie(cookieName, token))
      .expect(302)
      .expect('Location', '/login');
  });

  it('Step: Users can log in.', async () => {
    // Try to login with a wrong email
    response = await request(app)
      .post('/auth/login')
      .set('Cookie', writeCookie(cookieName, token))
      .send({ email: 'mary@foalts.org', password: 'password' })
      .expect(302)
      .expect('Location', '/login');
    setCookieInBrowser(response);

    // Redirect to the login page
    response = await request(app)
      .get('/login')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200);
    strictEqual(response.text.includes('Unknown email.'), true);
    setCookieInBrowser(response);

    // Refresh the login page
    response = await request(app)
      .get('/login')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200);
    strictEqual(response.text.includes('Unknown email.'), false);
    setCookieInBrowser(response);

    // Try to login with a wrong password
    response = await request(app)
      .post('/auth/login')
      .set('Cookie', writeCookie(cookieName, token))
      .send({ email: 'john@foalts.org', password: 'wrong_password' })
      .expect(302)
      .expect('Location', '/login');
    setCookieInBrowser(response);

    // Redirect to the login page
    response = await request(app)
      .get('/login')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200);
    strictEqual(response.text.includes('Invalid password.'), true);
    setCookieInBrowser(response);

    // Refresh the login page
    response = await request(app)
      .get('/login')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200);
    strictEqual(response.text.includes('Unknown email.'), false);
    setCookieInBrowser(response);

    // Login with a correct email
    response = await request(app)
      .post('/auth/login')
      .set('Cookie', writeCookie(cookieName, token))
      .send({ email: 'john@foalts.org', password: 'password' })
      .expect(302)
      .expect('Location', '/');
  });

  it('Step: Users can access routes once they are logged in.', async () => {
    response = await request(app)
      .get('/api/products')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200)
      .expect([]);

    response = await request(app)
      .get('/')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(200);
  });

  it('Step: Users can log out.', async () => {
    response = await request(app)
      .post('/auth/logout')
      .set('Cookie', writeCookie(cookieName, token))
      .expect(302)
      .expect('Location', '/login');
  });

  it('Step: Users cannot access routes once they are logged out.', async () => {
    response = await request(app)
      .get('/api/products')
      // .set('Cookie', writeCookie(cookieName, token))
      .expect(401);

    response = await request(app)
      .get('/')
      // .set('Cookie', writeCookie(cookieName, token))
      .expect(302)
      .expect('Location', '/login');
  });

});
