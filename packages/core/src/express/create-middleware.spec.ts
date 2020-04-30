// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// 3p
import * as express from 'express';
import {
  NextFunction,
  Request,
  Response
} from 'express-serve-static-core';
import { createRequest, createResponse } from 'node-mocks-http';
import * as request from 'supertest';

// FoalTS
import {
  Context,
  HttpResponse,
  HttpResponseBadRequest,
  HttpResponseCreated,
  HttpResponseOK,
  Route,
  ServiceManager
} from '../core';
import { createMiddleware } from './create-middleware';

describe('createMiddleware', () => {

  describe('should create a middleware that', () => {

    function route(fn: (...args: any) => any): Route {
      return {
        controller: { fn },
        hooks: [],
        httpMethod: 'GET',
        path: '',
        propertyKey: 'fn'
      };
    }

    it('should assign a "foal" object with a Context object to the Express request object.', async () => {
      let context: Context|undefined;

      const app = express()
        .use(createMiddleware(route(ctx => {
          context = ctx;
          return new HttpResponseOK();
        }), new ServiceManager()));

      await request(app)
        .get('/')
        .end();

      if (!context) {
        throw new Error('context should be defined');
      }

      strictEqual((context.request as any).foal.ctx, context);
    });

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

      await middleware(request, response, () => {});

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

      await middleware(request, response, () => {});

      strictEqual(str, 'abc');
      strictEqual(actualServiceManager, expectedServiceManager);
    });

    it('should call the sync and async post hook functions with the response'
        + ' after the controller method.', async () => {
      let str = '';
      const expectedServiceManager = new ServiceManager();
      const expectedReponse = new HttpResponseOK();

      let actualResponse: HttpResponse|undefined;

      const route: Route = {
        controller: { bar: (ctx: Context) => {
          ctx.state.str = 'c';
          return expectedReponse;
        }},
        hooks: [
          ctx => async () => { await 1; str = `${ctx.state.str}a`; },
          ctx => () => { ctx.state.str += 'b'; },
          () => response => {
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

      await middleware(request, response, () => {});

      strictEqual(str, 'cba');
      strictEqual(actualResponse, expectedReponse);
    });

    describe('when the controller method returns or resolves an instance of HttpResponseSuccess,'
      + ' HttpResponseClientError, HttpResponseServerError or HttpResponseRedirection.', () => {

        it('should send the response.', () => {
          const app = express();

          app.get('/success', createMiddleware(
            route(() => new HttpResponseCreated().setHeader('foo', 'bar')),
            new ServiceManager()
          ));

          return request(app)
            .get('/success')
            .expect(201)
            .expect('foo', 'bar');
        });

    });

    describe('when the controller method returns or resolves something that is not an instance of'
             + ' HttpResponse.', () => {

      it('should forward an Error to the next error-handling middleware.', done => {
        const app = express();
        app.get('/a', createMiddleware(route(() => ({})), new ServiceManager()));
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
      app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
