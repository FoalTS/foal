// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// 3p
import * as express from 'express';
import { createRequest, createResponse } from 'node-mocks-http';
import { Readable } from 'stream';
import * as request from 'supertest';

// FoalTS
import {
  Context,
  HttpResponse,
  HttpResponseBadRequest,
  HttpResponseCreated,
  HttpResponseInternalServerError,
  HttpResponseMovedPermanently,
  HttpResponseOK,
  HttpResponseRedirect,
  Route,
  ServiceManager
} from '../core';
import { createMiddleware } from './create-middleware';

describe('createMiddleware', () => {

  describe('should create a middleware that', () => {

    function route(fn): Route {
      return {
        controller: { fn },
        hooks: [],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'fn'
      };
    }

    it('should call the controller method with a context created from the request.', async () => {
      let body = {};
      const route: Route = {
        controller: { bar: (ctx: Context) => {
          body = ctx.request.body;
          return new HttpResponseOK();
        }},
        hooks: [],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'bar'
      };
      const request = createRequest({ body: { foo: 'bar' } });
      const response = createResponse();

      const middleware = createMiddleware(route, new ServiceManager());

      await middleware(request, response);

      deepStrictEqual(body, request.body);
    });

    it('should call the sync and async hooks (with the ctx and the given ServiceManager)'
        + ' before the controller method.', async () => {
      let str = '';
      const expectedServiceManager = new ServiceManager();
      let actualServiceManager: ServiceManager|undefined;
      const route: Route = {
        controller: { bar: (ctx: Context) => {
          str = `${ctx.state.str}c`;
          return new HttpResponseOK();
        }},
        hooks: [
          async ctx => { await 1; ctx.state.str = 'a'; },
          ctx => ctx.state.str += 'b',
          (ctx, services) => { actualServiceManager = services; }
        ],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'bar'
      };
      const request = createRequest();
      const response = createResponse();

      const middleware = createMiddleware(route, expectedServiceManager);

      await middleware(request, response);

      strictEqual(str, 'abc');
      strictEqual(actualServiceManager, expectedServiceManager);
    });

    it('should call the sync and async post hook functions (with the ctx, the given ServiceManager and the response)'
        + ' after the controller method.', async () => {
      let str = '';
      const expectedServiceManager = new ServiceManager();
      const expectedReponse = new HttpResponseOK();

      let actualServiceManager: ServiceManager|undefined;
      let actualResponse: HttpResponse|undefined;

      const route: Route = {
        controller: { bar: (ctx: Context) => {
          ctx.state.str = 'c';
          return expectedReponse;
        }},
        hooks: [
          () => async ctx => { await 1; str = `${ctx.state.str}a`; },
          () => ctx => ctx.state.str += 'b',
          () => (ctx, services, response) => {
            actualServiceManager = services;
            actualResponse = response;
          }
        ],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'bar'
      };
      const request = createRequest();
      const response = createResponse();

      const middleware = createMiddleware(route, expectedServiceManager);

      await middleware(request, response);

      strictEqual(str, 'cba');
      strictEqual(actualServiceManager, expectedServiceManager);
      strictEqual(actualResponse, expectedReponse);
    });

    describe('when the controller method returns or resolves an instance of HttpResponseSuccess,'
      + ' HttpResponseClientError or HttpResponseServerError', () => {

        it('should send a response with the suitable status.', () => {
          const app = express();

          app.get('/success', createMiddleware(
            route(() => new HttpResponseCreated()),
            new ServiceManager()
          ));
          app.get('/client-error', createMiddleware(
            route(async () => new HttpResponseBadRequest()),
            new ServiceManager()
          ));
          app.get('/server-error', createMiddleware(
            route(() => new HttpResponseInternalServerError()),
            new ServiceManager()
          ));

          return Promise.all([
            request(app)
              .get('/success')
              .expect(201),
            request(app)
              .get('/client-error')
              .expect(400),
            request(app)
              .get('/server-error')
              .expect(500),
          ]);
        });

        it('should send a response with a suitable body depending on response.body.', () => {
          const app = express();

          app.get('/a', createMiddleware(
            route(() => new HttpResponseOK('foo')),
            new ServiceManager()
          ));
          app.get('/b', createMiddleware(
            route(async () => new HttpResponseOK({ message: 'bar' })),
            new ServiceManager()
          ));
          app.get('/c', createMiddleware(
            route(() => new HttpResponseOK(3)),
            new ServiceManager()
          ));
          app.get('/d', createMiddleware(
            route(() => new HttpResponseOK()),
            new ServiceManager()
          ));

          const stream = new Readable({
            read() {
              this.push('Stream ');
              this.push('content');
              this.push(null);
            }
          });

          app.get('/e', createMiddleware(
            route(() => new HttpResponseOK(stream, { stream: true })),
            new ServiceManager()
          ));

          return Promise.all([
            request(app)
              .get('/a')
              .expect('foo'),
            request(app)
              .get('/b')
              .expect({ message: 'bar' }),
            request(app)
              .get('/c')
              .expect('3'),
            request(app)
              .get('/d')
              .then(response => {
                deepStrictEqual(response.body, {});
              }),
            request(app)
              .get('/e')
              .expect('Stream content')
          ]);
        });

        it('should send a response with the suitable headers.', () => {
          const app = express();
          const successResponse = new HttpResponseCreated();
          successResponse.setHeader('X-CSRF-Token', 'aaa');
          const clientErrorResponse = new HttpResponseBadRequest();
          clientErrorResponse.setHeader('X-CSRF-Token', 'bbb');
          const serverErrorResponse = new HttpResponseInternalServerError();
          serverErrorResponse.setHeader('X-CSRF-Token', 'ccc');

          app.get('/success', createMiddleware(
            route(() => successResponse),
            new ServiceManager()
          ));
          app.get('/client-error', createMiddleware(
            route(async () => clientErrorResponse),
            new ServiceManager()
          ));
          app.get('/server-error', createMiddleware(
            route(() => serverErrorResponse),
            new ServiceManager()
          ));

          return Promise.all([
            request(app)
              .get('/success')
              .expect('X-CSRF-Token', 'aaa'),
            request(app)
              .get('/client-error')
              .expect('X-CSRF-Token', 'bbb'),
            request(app)
              .get('/server-error')
              .expect('X-CSRF-Token', 'ccc'),
          ]);
        });

        it('should send a response with the suitable cookies.', () => {
          const app = express();
          const successResponse = new HttpResponseCreated()
            .setCookie('cookie1', 'cookie1_value_a')
            .setCookie('cookie2', 'cookie2_value_a', { httpOnly: true });
          const clientErrorResponse = new HttpResponseBadRequest()
            .setCookie('cookie1', 'cookie1_value_b')
            .setCookie('cookie2', 'cookie2_value_b', { httpOnly: true });
          const serverErrorResponse = new HttpResponseInternalServerError()
            .setCookie('cookie1', 'cookie1_value_c')
            .setCookie('cookie2', 'cookie2_value_c', { maxAge: 60 });

          app.get('/success', createMiddleware(
            route(() => successResponse),
            new ServiceManager()
          ));
          app.get('/client-error', createMiddleware(
            route(async () => clientErrorResponse),
            new ServiceManager()
          ));
          app.get('/server-error', createMiddleware(
            route(() => serverErrorResponse),
            new ServiceManager()
          ));

          return Promise.all([
            request(app)
              .get('/success')
              .expect('Set-Cookie', 'cookie1=cookie1_value_a; Path=/,cookie2=cookie2_value_a; Path=/; HttpOnly'),
            request(app)
              .get('/client-error')
              .expect('Set-Cookie', 'cookie1=cookie1_value_b; Path=/,cookie2=cookie2_value_b; Path=/; HttpOnly'),
            request(app)
              .get('/server-error')
              .then(response => {
                const beginning = response.header['set-cookie'][1].split('; Expires')[0];
                strictEqual(beginning, 'cookie2=cookie2_value_c; Max-Age=60; Path=/');
              })
          ]);
        });

    });

    describe('when the controller method returns or resolves an instance of HttpResponseRedirection', () => {

      it('should redirect the page with the correct status (301).', () => {
        const app = express();
        app.get('/a', createMiddleware(route(() => new HttpResponseMovedPermanently('/b')), new ServiceManager()));
        app.get('/b', (req, res) => res.send('foo'));

        return request(app)
          .get('/a')
          .expect('location', '/b')
          .expect(301);
      });

      it('should redirect the page with the correct status (302).', () => {
        const app = express();
        app.get('/a', createMiddleware(route(() => new HttpResponseRedirect('/b')), new ServiceManager()));
        app.get('/b', (req, res) => res.send('foo'));

        return request(app)
          .get('/a')
          .expect('location', '/b')
          .expect(302);
      });

      it('should redirect the page with the suitable headers.', () => {
        const app = express();
        const response = new HttpResponseRedirect('/b');
        response.setHeader('X-CSRF-Token', 'aaa');
        app.get('/a', createMiddleware(route(() => response), new ServiceManager()));
        app.get('/b', (req, res) => res.send('foo'));

        return request(app)
          .get('/a')
          .expect('X-CSRF-Token', 'aaa');
      });

    });

    describe('when the controller method returns or resolves something that is not an instance of'
             + ' HttpResponse.', () => {

      it('should forward an Error to the next error-handling middleware.', done => {
        const app = express();
        app.get('/a', createMiddleware(route(() => ({})), new ServiceManager()));
        app.use((err, req, res, next) => {
          try {
            ok(err instanceof Error);
            strictEqual(err.message, 'The controller method "fn" should return an HttpResponse.');
            done();
          } catch (err) {
            done(err);
          }
        });

        request(app).get('/a').end((() => {}));
      });

    });

    it('should forward the error to the next error-handling middleware if one is thrown in a hook.', done => {
      const app = express();
      app.get('/a', createMiddleware({
        controller: { bar: () => new HttpResponseOK() },
        hooks: [
          () => { throw new Error('Error thrown in a hook.'); }
        ],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'bar'
      }, new ServiceManager()));
      app.use((err, req, res, next) => {
        try {
          ok(err instanceof Error);
          strictEqual(err.message, 'Error thrown in a hook.');
          done();
        } catch (err) {
          done(err);
        }
      });

      request(app).get('/a').end((() => {}));
    });

    it('should forward the error to the next error-handling middleware if one is thrown in a'
      + ' controller method.', done => {
        const app = express();
        app.get('/a', createMiddleware(
          route(() => { throw new Error('Error thrown in a controller method.'); }),
          new ServiceManager())
        );
        app.use((err, req, res, next) => {
          try {
            ok(err instanceof Error);
            strictEqual(err.message, 'Error thrown in a controller method.');
            done();
          } catch (err) {
            done(err);
          }
        });

        request(app).get('/a').end((() => {}));
    });

    it('should forward the error to the next error-handling middleware if one is rejected in a hook.', done => {
      const app = express();
      app.get('/a', createMiddleware({
        controller: { bar: () => new HttpResponseOK() },
        hooks: [
          async () => { throw new Error('Error rejected in a hook.'); }
        ],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'bar'
      }, new ServiceManager()));
      app.use((err, req, res, next) => {
        try {
          ok(err instanceof Error);
          strictEqual(err.message, 'Error rejected in a hook.');
          done();
        } catch (err) {
          done(err);
        }
      });

      request(app).get('/a').end((() => {}));
    });

    it('should forward the error to the next error-handling middleware if one is rejected in a'
      + ' controller method.', done => {
        const app = express();
        app.get('/a', createMiddleware(
          route(async () => { throw new Error('Error rejected in a controller method.'); }),
          new ServiceManager())
        );
        app.use((err, req, res, next) => {
          try {
            ok(err instanceof Error);
            strictEqual(err.message, 'Error rejected in a controller method.');
            done();
          } catch (err) {
            done(err);
          }
        });

        request(app).get('/a').end((() => {}));
    });

  });

  describe('when a hook returns or resolves an instance of HttpResponse', () => {

    it('should stop the execution of the remaining hooks and the controller method.', () => {
      const app = express();
      let str = '';
      app.get('/a', createMiddleware({
        controller: { bar: () => {
          str += 'c';
          return new HttpResponseOK();
        }},
        hooks: [
          () => { str += 'a'; },
          () => new HttpResponseBadRequest(),
          () => { str += 'b'; },
        ],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'bar'
      }, new ServiceManager()));

      return request(app)
        .get('/a')
        .then(() => {
          strictEqual(str, 'a');
        });
    });

    it('should use the returned object as response.', () => {
      const app = express();
      app.get('/a', createMiddleware({
        controller: { bar: () => new HttpResponseOK() },
        hooks: [
          () => new HttpResponseBadRequest(),
        ],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'bar'
      }, new ServiceManager()));

      return request(app)
        .get('/a')
        .expect(400);
    });

  });

});
