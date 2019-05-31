// std
import { ok, strictEqual } from 'assert';
import { promisify } from 'util';

// 3p
import * as express from 'express';
import { MemoryStore } from 'express-session';
import * as request from 'supertest';

// FoalTS
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { Context, Delete, Get, Head, HttpResponseOK, Options, Patch, Post, Put } from '../core';
import { createApp } from './create-app';

describe('createApp', () => {

  before(() => {
    if (!existsSync('test-public')) {
      mkdirSync('test-public');
    }
    writeFileSync('test-public/hello-world.html', '<h1>Hello world!</h1>', 'utf8');
    process.env.SETTINGS_STATIC_URL = 'test-public';
  });

  after(() => {
    delete process.env.SETTINGS_STATIC_URL;
    if (existsSync('test-public/hello-world.html')) {
      unlinkSync('test-public/hello-world.html');
    }
    if (existsSync('test-public')) {
      rmdirSync('test-public');
    }
  });

  afterEach(() => {
    delete process.env.SETTINGS_CSRF;
    delete process.env.SETTINGS_CSRF_OPTIONS_COOKIE;
    delete process.env.SETTINGS_STATIC_PATH_PREFIX;
  });

  it('should include security headers in HTTP responses.', async () => {
    class AppController {
      @Get('/')
      index() {
        const response = new HttpResponseOK();
        response.setHeader('X-Custom-Header', 'foobar');
        return response;
      }
    }
    const app = createApp(AppController);

    await request(app)
      .get('/')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect('X-DNS-Prefetch-Control', 'off')
      .expect('X-Download-Options', 'noopen')
      .expect('X-Frame-Options', 'SAMEORIGIN')
      .expect('X-XSS-Protection', '1; mode=block')
      .expect('Strict-Transport-Security', 'max-age=15552000; includeSubDomains')
      .expect('X-Custom-Header', 'foobar');
  });

  it('should not include the X-Powered-By: Express header in HTTP responses.', async () => {
    class AppController {
      @Get('/')
      index() {
        return new HttpResponseOK();
      }
    }
    const app = createApp(AppController);

    await request(app)
      .get('/')
      .then(response => {
        if (response.header['x-powered-by']) {
          throw new Error('The header "X-Powered-By" should not exist.');
        }
      });
  });

  it('should serve static files (with the proper headers).', async () => {
    const app = createApp(class {});
    await request(app)
      .get('/hello-world.html')
      .expect(200, '<h1>Hello world!</h1>')
      .expect('Content-type', 'text/html; charset=UTF-8')
      .expect('X-Content-Type-Options', 'nosniff');
  });

  it('should support custom path prefix when serving static files.', async () => {
    process.env.SETTINGS_STATIC_PATH_PREFIX = '/prefix';

    const app = createApp(class {});
    await request(app)
      .get('/prefix/hello-world.html')
      .expect(200, '<h1>Hello world!</h1>')
      .expect('Content-type', 'text/html; charset=UTF-8');
  });

  it('should return a 403 "Bad csrf token" on POST/PATCH/PUT/DELETE requests with bad'
      + ' csrf token.', () => {
    process.env.SETTINGS_CSRF = 'true';
    const app = createApp(class {});
    return Promise.all([
      request(app).post('/').expect(403).expect('Bad csrf token.'),
      request(app).patch('/').expect(403).expect('Bad csrf token.'),
      request(app).put('/').expect(403).expect('Bad csrf token.'),
      request(app).delete('/').expect(403).expect('Bad csrf token.'),
    ]);
  });

  it('should not return a 403 "Bad csrf token" on POST/PATCH/PUT/DELETE requests with correct'
      + ' csrf token.', async () => {
    process.env.SETTINGS_CSRF = 'true';
    class AppController {
      @Get('/')
      index(ctx: Context) {
        return new HttpResponseOK(ctx.request.csrfToken());
      }
    }
    const app = createApp(AppController);

    let csrfToken = '';
    let sessionCookie = '';
    await request(app).get('/').then(response => {
      csrfToken = response.text;
      for (const line of response.header['set-cookie']) {
        if (line.includes('connect.sid')) {
          sessionCookie = line;
          break;
        }
      }
    });

    return request(app)
      .post('/')
      .set('Cookie', sessionCookie)
      .set('csrf-token', csrfToken)
      .expect(404);
  });

  it('should return a 403 "Bad csrf token" on POST/PATCH/PUT/DELETE requests with bad'
      + ' csrf token (cookie=true).', async () => {
    process.env.SETTINGS_CSRF = 'true';
    process.env.SETTINGS_CSRF_OPTIONS_COOKIE = 'true';

    class AppController {
      @Get('/foo')
      foo(ctx: Context) {
        const response = new HttpResponseOK();
        response.setCookie('csrf-token', ctx.request.csrfToken());
        return response;
      }
    }

    const app = createApp(AppController);
    await Promise.all([
      request(app).post('/').expect(403).expect('Bad csrf token.'),
      request(app).patch('/').expect(403).expect('Bad csrf token.'),
      request(app).put('/').expect(403).expect('Bad csrf token.'),
      request(app).delete('/').expect(403).expect('Bad csrf token.'),
    ]);

    let csrfSecret = '';
    let csrfHash = '';
    await request(app)
      .get('/foo')
      .expect(200)
      .then(data => {
        ok(Array.isArray(data.header['set-cookie']));
        for (const line of data.header['set-cookie']) {
          const [ name, key ] = line.split('=');
          switch (name) {
            case 'csrf-token':
              csrfHash = key.split(';')[0];
              break;
            case '_csrf':
              csrfSecret = key.split(';')[0];
              break;
            case 'connect.sid':
              throw new Error('Session cookie should not exist when using double submit cookie technique.');
            default:
              break;
          }
        }
      });

    await Promise.all([
      request(app).post('/')
        .set('Cookie', [`_csrf=${csrfSecret}`])
        .expect(403),
      request(app).post('/')
        .set('csrf-token', csrfHash)
        .expect(403),
      request(app).post('/')
        .set('Cookie', [`_csrf=${csrfSecret}`])
        .set('csrf-token', csrfHash)
        .expect(404)
    ]);
  });

  it('should define the function req.csrfToken even if csrf is set to false in Config.', () => {
    process.env.SETTINGS_CSRF = 'false';
    class AppController {
      @Post('/')
      index(ctx: Context) {
        return new HttpResponseOK(ctx.request.csrfToken());
      }
    }
    const app = createApp(AppController);
    return Promise.all([
      request(app).post('/').expect(200).expect('CSRF protection disabled.'),
    ]);
  });

  it('should parse the cookies.', () => {
    class AppController {
      @Get('/')
      index(ctx: Context) {
        return new HttpResponseOK(ctx.request.cookies);
      }
    }
    const app = createApp(AppController);
    return request(app).get('/')
      // The type of the second parameter of `set` is incorrect.
      .set('Cookie', ['nameOne=valueOne;nameTwo=valueTwo'] as any)
      .expect(200)
      .expect({
        nameOne: 'valueOne',
        nameTwo: 'valueTwo',
      });
  });

  it('should return 404 "Not Found" on requests that have no handlers.', () => {
    const app = createApp(class {});
    return Promise.all([
      request(app).get('/foo').expect(404),
      request(app).post('/foo').expect(404),
      request(app).patch('/foo').expect(404),
      request(app).put('/foo').expect(404),
      request(app).delete('/foo').expect(404),
      request(app).head('/foo').expect(404),
      request(app).options('/foo').expect(404),
    ]);
  });

  it('should respond on DELETE, GET, PATCH, POST, PUT, HEAD and OPTIONS requests if a handler exists.', () => {
    class MyController {
      @Get('/foo')
      get() {
        return new HttpResponseOK('get');
      }
      @Post('/foo')
      post() {
        return new HttpResponseOK('post');
      }
      @Patch('/foo')
      patch() {
        return new HttpResponseOK('patch');
      }
      @Put('/foo')
      put() {
        return new HttpResponseOK('put');
      }
      @Delete('/foo')
      delete() {
        return new HttpResponseOK('delete');
      }
      @Head('/foo')
      head() {
        // A HEAD response does not have a body.
        return new HttpResponseOK();
      }
      @Options('/foo')
      options() {
        return new HttpResponseOK('options');
      }
    }
    const app = createApp(MyController);
    return Promise.all([
      request(app).get('/foo').expect('get'),
      request(app).post('/foo').expect('post'),
      request(app).patch('/foo').expect('patch'),
      request(app).put('/foo').expect('put'),
      request(app).delete('/foo').expect('delete'),
      request(app).head('/foo').expect(200),
      request(app).options('/foo').expect('options'),
    ]);
  });

  it('should parse incoming request bodies (json)', () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = createApp(MyController);
    return request(app)
      .post('/foo')
      .send({ foo: 'bar' })
      .expect({ body: { foo: 'bar' } });
  });

  it('should parse incoming request bodies (urlencoded)', () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = createApp(MyController);
    return request(app)
      .post('/foo')
      .send('foo=bar')
      .expect({ body: { foo: 'bar' } });
  });

  it('should parse incoming request bodies (text/*)', () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = createApp(MyController);
    return request(app)
      .post('/foo')
      .type('text/plain')
      .send('Hello world!')
      .expect({ body: 'Hello world!' });
  });

  it('should parse incoming request bodies (application/graphql)', () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = createApp(MyController);
    return request(app)
      .post('/foo')
      .type('application/graphql')
      .send('{ me { name } }')
      .expect({ body: '{ me { name } }' });
  });

  it('should have sessions.', () => {
    class MyController {
      @Get('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ session: !!ctx.request.session });
      }
    }
    const app = createApp(MyController);
    return request(app)
      .get('/foo')
      .expect({ session: true });
  });

  it('should accept a custom session store.', async () => {
    const store = new MemoryStore();
    class AppController {
      @Get('/foo')
      foo(ctx: Context) {
        ctx.request.session.bar = 'foobar';
        return new HttpResponseOK();
      }
    }

    const app = createApp(AppController, {
      store: session => {
        strictEqual(typeof session, 'function');
        return store;
      }
    });

    let sessions = await promisify(store.all.bind(store))();
    strictEqual(Object.keys(sessions).length, 0);

    await  request(app).get('/foo');

    sessions = await promisify(store.all.bind(store))();
    strictEqual(Object.keys(sessions).length, 1);
  });

  it('should use the optional express instance if one is given.', () => {
    const expected = express();
    const actual = createApp(class {}, {}, expected);

    strictEqual(actual, expected);
  });

});

// function httpMethodTest(httpMethod: HttpMethod) {
//   describe(`when route.httpMethod === "${httpMethod}", route.path === "/foo/bar" and the route returns `
//             + 'an HttpResponseOK(\'Success\')', () => {

//     let app;

//     beforeEach(() => {
//       app = express();
//       const foalApp = {
//         controllers: [
//           route(httpMethod, '/foo/bar', ctx => new HttpResponseOK('Success'))
//         ]
//       };
//       app.use(getAppRouter(foalApp));
//       app.use((req, res) => res.sendStatus(404));
//     });

//     it(`should respond to ${httpMethod} /foo/bar by 200 "Success".`, () => {
//       switch (httpMethod) {
//         case 'GET':
//           return request(app).get('/foo/bar').expect(200).expect('Success');
//         case 'PATCH':
//           return request(app).patch('/foo/bar').expect(200).expect('Success');
//         case 'PUT':
//           return request(app).put('/foo/bar').expect(200).expect('Success');
//         case 'POST':
//           return request(app).post('/foo/bar').expect(200).expect('Success');
//         case 'DELETE':
//           return request(app).delete('/foo/bar').expect(200).expect('Success');
//       }
//     });

//     it(`should respond to ${httpMethod} /foo/bar/ by 200 "Success".`, () => {
//       switch (httpMethod) {
//         case 'GET':
//           return request(app).get('/foo/bar').expect(200).expect('Success');
//         case 'PATCH':
//           return request(app).patch('/foo/bar').expect(200).expect('Success');
//         case 'PUT':
//           return request(app).put('/foo/bar').expect(200).expect('Success');
//         case 'POST':
//           return request(app).post('/foo/bar').expect(200).expect('Success');
//         case 'DELETE':
//           return request(app).delete('/foo/bar').expect(200).expect('Success');
//       }
//     });

//     it(`should not respond to ${httpMethod} /foo.`, () => {
//       switch (httpMethod) {
//         case 'GET':
//           return request(app).get('/foo').expect(404);
//         case 'PATCH':
//           return request(app).patch('/foo').expect(404);
//         case 'PUT':
//           return request(app).put('/foo').expect(404);
//         case 'POST':
//           return request(app).post('/foo').expect(404);
//         case 'DELETE':
//           return request(app).delete('/foo').expect(404);
//       }
//     });

//     it(`should not respond to ${httpMethod} /foo/bar/4.`, () => {
//       switch (httpMethod) {
//         case 'GET':
//           return request(app).get('/foo/bar/4').expect(404);
//         case 'PATCH':
//           return request(app).patch('/foo/bar/4').expect(404);
//         case 'PUT':
//           return request(app).put('/foo/bar/4').expect(404);
//         case 'POST':
//           return request(app).post('/foo/bar/4').expect(404);
//         case 'DELETE':
//           return request(app).delete('/foo/bar/4').expect(404);
//       }
//     });

//     it(`should not respond to [Method !== "${httpMethod}"] /foo/bar.`, () => {
//       const promises: any = [];
//       if (httpMethod !== 'GET') { promises.push(request(app).get('/foo/bar').expect(404)); }
//       if (httpMethod !== 'PATCH') { promises.push(request(app).patch('/foo/bar').expect(404)); }
//       if (httpMethod !== 'PUT') { promises.push(request(app).put('/foo/bar').expect(404)); }
//       if (httpMethod !== 'POST') { promises.push(request(app).post('/foo/bar').expect(404)); }
//       if (httpMethod !== 'DELETE') { promises.push(request(app).delete('/foo/bar').expect(404)); }
//       return Promise.all(promises);
//     });

//   });
// }

// xdescribe('getAppRouter', () => {

//   // The below items are more end-to-end tests than unit ones.

//   httpMethodTest('DELETE');

//   httpMethodTest('GET');

//   httpMethodTest('PATCH');

//   httpMethodTest('POST');

//   httpMethodTest('PUT');

//   describe('for each route of each controller of the given app', () => {

//     describe('when route.httpMethod === "GET", route.path === "/foo/:id/bar/:id2" and the route returns '
//              + 'an HttpResponseOK(\'Success\')', () => {

//       let app;

//       beforeEach(() => {
//         app = express();
//         const foalApp = {
//           controllers: [
//             route('GET', '/foo/:id/bar/:id2', ctx => new HttpResponseOK('Success'))
//           ]
//         };
//         app.use(getAppRouter(foalApp));
//         app.use((req, res) => res.sendStatus(404));
//       });

//       it('should respond to GET /foo/12/bar/13 by 200 "Success".', () => {
//         return request(app)
//           .get('/foo/12/bar/13')
//           .expect(200)
//           .expect('Success');
//       });

//       it('should not respond to GET /foo/12/bar/.', () => {
//         return request(app)
//           .get('/foo/12/bar/')
//           .expect(404);
//       });

//     });

//   });

// });
