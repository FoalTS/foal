// std
import { strictEqual } from 'assert';
import { promisify } from 'util';

// 3p
import * as express from 'express';
import { MemoryStore } from 'express-session';
import * as request from 'supertest';

// FoalTS
import { Context, Delete, Get, Head, HttpResponseOK, Options, Patch, Post, Put } from '../core';
import { createApp } from './create-app';

describe('createApp', () => {

  it('should return a 403 "Bad csrf token" on POST/PATCH/PUT/DELETE requests with bad'
      + ' csrf token.', () => {
    process.env.SETTINGS_CSRF = 'true';
    const app = createApp(class {});
    const promise = Promise.all([
      request(app).post('/').expect(403).expect('Bad csrf token.'),
      request(app).patch('/').expect(403).expect('Bad csrf token.'),
      request(app).put('/').expect(403).expect('Bad csrf token.'),
      request(app).delete('/').expect(403).expect('Bad csrf token.'),
    ]);
    process.env.SETTINGS_CSRF = 'false'; // Not great: assumption about the default param here.
    return promise;
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
    const promise = Promise.all([
      request(app).post('/').expect(200).expect('CSRF protection disabled.'),
    ]);
    process.env.SETTINGS_CSRF = 'false'; // Not great: assumption about the default param here.
    return promise;
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
    const app = createApp(class {}, {
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
