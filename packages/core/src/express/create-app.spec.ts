// std
import { deepStrictEqual, strictEqual } from 'assert';
import { Buffer } from 'buffer';

// 3p
import * as express from 'express';
import * as request from 'supertest';

// FoalTS
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import {
  All,
  Config,
  Context,
  Delete,
  dependency,
  Get,
  Head,
  Hook,
  HttpResponseOK,
  OpenApi,
  Options,
  Patch,
  Post,
  Put,
  ServiceManager,
  Logger,
} from '../core';
import { createApp, getHttpLogParamsDefault, OPENAPI_SERVICE_ID, calculateRouteSpecificity, sortRoutes } from './create-app';
import { mock } from 'node:test';

describe('calculateRouteSpecificity', () => {
  it('should assign higher scores to static routes than dynamic routes.', () => {
    const staticScore = calculateRouteSpecificity('/api/users');
    const dynamicScore = calculateRouteSpecificity('/api/:id');

    strictEqual(staticScore > dynamicScore, true);
  });

  it('should assign higher scores to routes with more static segments.', () => {
    const threeStaticScore = calculateRouteSpecificity('/api/users/current');
    const twoStaticScore = calculateRouteSpecificity('/api/users');
    const oneStaticScore = calculateRouteSpecificity('/api');

    strictEqual(threeStaticScore > twoStaticScore, true);
    strictEqual(twoStaticScore > oneStaticScore, true);
  });

  it('should assign higher scores to static-heavy routes over dynamic-heavy routes.', () => {
    const staticPlusDynamicScore = calculateRouteSpecificity('/api/users/:userId');
    const twoParamsScore = calculateRouteSpecificity('/api/:resource/:id');

    strictEqual(staticPlusDynamicScore > twoParamsScore, true);
  });

  it('should handle routes with only dynamic segments.', () => {
    const oneDynamicScore = calculateRouteSpecificity('/:param');
    const twoDynamicScore = calculateRouteSpecificity('/:resource/:id');

    strictEqual(twoDynamicScore > oneDynamicScore, true);
  });

  it('should handle empty path segments correctly.', () => {
    const score1 = calculateRouteSpecificity('/api/users/');
    const score2 = calculateRouteSpecificity('/api/users');

    strictEqual(score1, score2);
  });
});

describe('sortRoutes', () => {
  it('should sort routes by specificity with most specific first.', () => {
    const routes = [
      { route: { path: '/api/:id' } },
      { route: { path: '/api/users/current' } },
      { route: { path: '/api/users/:userId' } },
      { route: { path: '/api/users' } },
    ];

    const sorted = sortRoutes([...routes]);

    strictEqual(sorted[0].route.path, '/api/users/current');
    strictEqual(sorted[1].route.path, '/api/users/:userId');
    strictEqual(sorted[2].route.path, '/api/users');
    strictEqual(sorted[3].route.path, '/api/:id');
  });

  it('should prioritize static routes over dynamic routes at the same depth.', () => {
    const routes = [
      { route: { path: '/mypath/:param' } },
      { route: { path: '/mypath/static' } },
    ];

    const sorted = sortRoutes([...routes]);

    strictEqual(sorted[0].route.path, '/mypath/static');
    strictEqual(sorted[1].route.path, '/mypath/:param');
  });

  it('should handle complex mixed routes.', () => {
    const routes = [
      { route: { path: '/:param' } },
      { route: { path: '/api/:resource/:id' } },
      { route: { path: '/api/users' } },
      { route: { path: '/api/users/:userId/posts/:postId' } },
      { route: { path: '/api/users/:userId' } },
      { route: { path: '/api/users/current/profile' } },
    ];

    const sorted = sortRoutes([...routes]);

    // Most specific (4 static) should be first
    strictEqual(sorted[0].route.path, '/api/users/current/profile');
    // Then 3 static + 2 dynamic (5 total segments)
    strictEqual(sorted[1].route.path, '/api/users/:userId/posts/:postId');
    // Then 2 static + 1 dynamic (3 total segments)
    strictEqual(sorted[2].route.path, '/api/users/:userId');
    // Then 2 static (2 total segments)
    strictEqual(sorted[3].route.path, '/api/users');
    // Then 1 static + 2 dynamic (3 total segments)
    strictEqual(sorted[4].route.path, '/api/:resource/:id');
    // Least specific (1 dynamic) should be last
    strictEqual(sorted[5].route.path, '/:param');
  });
});

describe('getHttpLogParamsDefault', () => {
  context('the request has NOT been aborted', () => {
    it('should return the request and response parameters.', () => {
      const tokens = {
        method: () => 'GET',
        url: () => '/foobar',
        status: () => '200',
        res: () => '0',
        'response-time': () => '0'
      };

      const actual = getHttpLogParamsDefault(tokens, {}, {});
      const expected = {
        method: 'GET',
        url: '/foobar',
        statusCode: 200,
        contentLength: '0',
        responseTime: 0
      };

      deepStrictEqual(actual, expected);
    });
  });

  context('the request has been aborted', () => {
    it('should return the request and response parameters.', () => {
      const tokens = {
        method: () => 'GET',
        url: () => '/foobar',
        status: () => undefined,
        res: () => undefined,
        'response-time': () => undefined
      };

      const actual = getHttpLogParamsDefault(tokens, {}, {});
      const expected = {
        method: 'GET',
        url: '/foobar',
        statusCode: null,
        contentLength: null,
        responseTime: null
      };

      deepStrictEqual(actual, expected);
    });
  });
})

describe('createApp', () => {

  before(() => {
    if (!existsSync('test-public')) {
      mkdirSync('test-public');
    }
    writeFileSync('test-public/hello-world.html', '<h1>Hello world!</h1>', 'utf8');
    Config.set('settings.staticPath', 'test-public');
  });

  after(() => {
    Config.remove('settings.staticPath');
    Config.remove('settings.debug');
    if (existsSync('test-public/hello-world.html')) {
      unlinkSync('test-public/hello-world.html');
    }
    if (existsSync('test-public')) {
      rmdirSync('test-public');
    }
  });

  afterEach(() => {
    mock.reset();
    Config.remove('settings.staticPathPrefix');
    Config.remove('settings.debug');
    Config.remove('settings.bodyParser.limit');
    Config.remove('settings.cookieParser.secret');
    Config.remove('settings.logger.logHttpRequests');
    Config.remove('settings.logger.format');
    Config.remove('settings.staticFiles.cacheControl');
  });

  const cookieSecret = 'strong-secret';
  const cookieUnsignedValue = 'barfoo';
  const cookieSignedValue = 's:barfoo.uTsjjvqRPbwnsdLHMg22+9HLBCoeAVFnTDZCyE83AhY';

  it('should include security headers in HTTP responses.', async () => {
    class AppController {
      @Get('/')
      index() {
        return new HttpResponseOK()
          .setHeader('X-Custom-Header', 'foobar');
      }
    }
    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect('X-Frame-Options', 'SAMEORIGIN')
      .expect('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      .expect('X-Custom-Header', 'foobar');
  });

  it('should not include the X-Powered-By: Express header in HTTP responses.', async () => {
    class AppController {
      @Get('/')
      index() {
        return new HttpResponseOK();
      }
    }
    const app = await createApp(AppController);

    await request(app)
      .get('/')
      .then(response => {
        if (response.header['x-powered-by']) {
          throw new Error('The header "X-Powered-By" should not exist.');
        }
      });
  });

  it('should serve static files (with the proper headers).', async () => {
    const app = await createApp(class { });
    await request(app)
      .get('/hello-world.html')
      .expect(200, '<h1>Hello world!</h1>')
      .expect('Content-type', 'text/html; charset=UTF-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect('cache-control', 'public, max-age=0');
  });

  it('should allow to pass the cacheControl option to the static middleware.', async () => {
    Config.set('settings.staticFiles.cacheControl', false);

    const app = await createApp(class { });
    await request(app)
      .get('/hello-world.html')
      .expect(200, '<h1>Hello world!</h1>')
      .then(response => {
        if (response.header['cache-control']) {
          throw new Error('The header "cache-control" should not exist.');
        }
      });
  });

  it('should support custom path prefix when serving static files.', async () => {
    Config.set('settings.staticPathPrefix', '/prefix');

    const app = await createApp(class { });
    await request(app)
      .get('/prefix/hello-world.html')
      .expect(200, '<h1>Hello world!</h1>')
      .expect('Content-type', 'text/html; charset=UTF-8');
  });

  it('should parse the cookies.', async () => {
    class AppController {
      @Get('/')
      index(ctx: Context) {
        return new HttpResponseOK(ctx.request.cookies);
      }
    }
    const app = await createApp(AppController);
    return request(app).get('/')
      .set('Cookie', ['nameOne=valueOne;nameTwo=valueTwo'])
      .expect(200)
      .expect({
        nameOne: 'valueOne',
        nameTwo: 'valueTwo',
      });
  });

  it('should not parse signed cookies if no cookie secret is provided in the config.', async () => {
    class AppController {
      @Get('/')
      index(ctx: Context) {
        return new HttpResponseOK({
          unsigned: ctx.request.cookies,
          signed: ctx.request.signedCookies,
        });
      }
    }

    const app = await createApp(AppController);
    return request(app).get('/')
      .set('Cookie', [`cookie1=${cookieSignedValue}`])
      .expect(200)
      .expect({
        unsigned: {
          cookie1: cookieSignedValue,
        },
        signed: {}
      });
  });

  it('should parse signed cookies if a cookie secret is provided in the config.', async () => {
    class AppController {
      @Get('/')
      index(ctx: Context) {
        return new HttpResponseOK({
          unsigned: ctx.request.cookies,
          signed: ctx.request.signedCookies,
        });
      }
    }

    Config.set('settings.cookieParser.secret', cookieSecret)

    const app = await createApp(AppController);
    return request(app).get('/')
      .set('Cookie', [`cookie1=${cookieSignedValue}`])
      .expect(200)
      .expect({
        unsigned: {},
        signed: {
          cookie1: cookieUnsignedValue,
        }
      });
  });

  it('should return 404 "Not Found" on requests that have no handlers.', async () => {
    const app = await createApp(class { });
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

  it(
    'should respond on DELETE, GET, PATCH, POST, PUT, HEAD, OPTIONS and "ALL" requests if a handler exists.',
    async () => {
      let actualGetContext: Context|undefined;

      class MyController {
        @Head('/foo')
        headSomething() {
          // A HEAD response does not have a body.
          return new HttpResponseOK()
            .setHeader('foo', 'bar');
        }
        @Get('/foo')
        getSomething(ctx: Context) {
          actualGetContext = ctx;
          return new HttpResponseOK('get');
        }
        @Post('/foo')
        postSomething() {
          return new HttpResponseOK('post');
        }
        @Patch('/foo')
        patchSomething() {
          return new HttpResponseOK('patch');
        }
        @Put('/foo')
        putSomething() {
          return new HttpResponseOK('put');
        }
        @Delete('/foo')
        deleteSomething() {
          return new HttpResponseOK('delete');
        }
        @Options('/foo')
        optionsSomething() {
          return new HttpResponseOK('options');
        }
        @All('/bar')
        allSomething() {
          return new HttpResponseOK('all');
        }
      }
      const app = await createApp(MyController);
      await Promise.all([
        request(app).get('/foo').expect('get'),
        request(app).post('/foo').expect('post'),
        request(app).patch('/foo').expect('patch'),
        request(app).put('/foo').expect('put'),
        request(app).delete('/foo').expect('delete'),
        request(app).head('/foo').expect(200).expect('foo', 'bar'),
        request(app).options('/foo').expect('options'),
        // All
        request(app).get('/bar').expect('all'),
        request(app).post('/bar').expect('all'),
      ]);

      strictEqual(actualGetContext?.controllerName, 'MyController');
      strictEqual(actualGetContext?.controllerMethodName, 'getSomething');
    }
  );

  it('should parse incoming request bodies (json)', async () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = await createApp(MyController);
    return request(app)
      .post('/foo')
      .send({ foo: 'bar' })
      .expect({ body: { foo: 'bar' } });
  });

  it('should parse incoming request bodies (urlencoded)', async () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = await createApp(MyController);
    return request(app)
      .post('/foo')
      .send('foo=bar')
      .expect({ body: { foo: 'bar' } });
  });

  it('should parse incoming request bodies (text/*)', async () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = await createApp(MyController);
    return request(app)
      .post('/foo')
      .type('text/plain')
      .send('Hello world!')
      .expect({ body: 'Hello world!' });
  });

  it('should parse incoming request bodies (application/graphql)', async () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = await createApp(MyController);
    return request(app)
      .post('/foo')
      .type('application/graphql')
      .send('{ me { name } }')
      .expect({ body: '{ me { name } }' });
  });

  it('should parse incoming request bodies (application/xml)', async () => {
    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = await createApp(MyController);

    const xml = `<?xml version="1.0" encoding="utf-8"?>
    <Request>
        <Login>login</Login>
        <Password>password</Password>
    </Request>`;

    return request(app)
      .post('/foo')
      .type('application/xml')
      .send(xml)
      .expect({ body: xml });
  });

  it('should accept higher or lower request body size if this is specified in the configuration.', async () => {
    Config.set('settings.bodyParser.limit', 10);

    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK();
      }
    }

    const app = await createApp(MyController);
    await Promise.all([
      // Text
      request(app)
        .post('/foo')
        .type('text/plain')
        .send(Buffer.alloc(10, 'a').toString('utf8'))
        .expect(200),
      request(app)
        .post('/foo')
        .type('text/plain')
        .send(Buffer.alloc(11, 'a').toString('utf8'))
        .expect(413), // 413 = Payload Too Large
      // JSON
      request(app)
        .post('/foo')
        .send({ e: 'a' })
        .expect(200),
      request(app)
        .post('/foo')
        .send({ e: 'aka' })
        .expect(413), // 413 = Payload Too Large
      // URL encoded
      request(app)
        .post('/foo')
        .send('foo=bar')
        .expect(200),
      request(app)
        .post('/foo')
        .send('foo=barrrrr')
        .expect(413), // 413 = Payload Too Large
    ]);
  });

  it('should use the optional options.expressInstance if one is given.', async () => {
    const expected = express();
    const actual = await createApp(class { }, {
      expressInstance: expected
    });

    strictEqual(actual, expected);
  });

  it('should use the optional preMiddlewares if they are given.', async () => {
    class AppController {
      @Get('/')
      get(ctx: Context) {
        return new HttpResponseOK(
          (ctx.request as any).foalMessage
        );
      }
    }

    const app = await createApp(AppController, {
      preMiddlewares: [
        (req: any, res: any, next: (err?: any) => any) => {
          req.foalMessage = 'Hello world!'; next();
        }
      ]
    });

    return request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');
  });

  it('should use the optional afterPreMiddlewares if they are given.', async () => {
    class AppController {
      @Get('/')
      get(ctx: Context) {
        return new HttpResponseOK(
          (ctx.request as any).foalMessage
        );
      }
    }

    const app = await createApp(AppController, {
      afterPreMiddlewares: [
        (req: any, res: any, next: (err?: any) => any) => {
          req.foalMessage = 'Hello world!'; next();
        }
      ]
    });
    return request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');
  });

  it('should execute the optional afterPreMiddlewares after Foal middlewares.', async () => {
    class AppController {
      @Get('/')
      get() {
        return new HttpResponseOK();
      }
    }

    let actualCookieValue = '';
    const app = await createApp(AppController, {
      afterPreMiddlewares: [
        (req: any, res: any, next: (err?: any) => any) => {
          actualCookieValue = req.cookies?.foo;
          next();
        }
      ]
    });

    await request(app)
      .get('/')
      .set('Cookie', ['foo=bar'])
      .expect(200);

    strictEqual(actualCookieValue, 'bar');
  });

  it('should use the optional postMiddlewares if they are given.', async () => {
    Config.set('settings.debug', true);

    class AppController {
      @Get('/a')
      getA(ctx: Context) {
        return new HttpResponseOK('a');
      }
    }

    const app = await createApp(AppController, {
      postMiddlewares: [
        express.Router().get('/a', (req: any, res: any) => res.send('a2')),
        express.Router().get('/b', (req: any, res: any) => res.send('b2')),
      ]
    });

    return Promise.all([
      request(app)
        .get('/a')
        .expect(200)
        .expect('a'),
      request(app)
        .get('/b')
        .expect(200)
        .expect('b2'),
    ]);
  });

  it('should make the serviceManager available from the express instance.', async () => {
    const app = await createApp(class { });

    strictEqual(typeof app.foal, 'object');
    strictEqual(app.foal.services instanceof ServiceManager, true);
  });

  it('should send a pretty error if the JSON in the request body is invalid.', async () => {
    class AppController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = await createApp(AppController);

    return request(app)
      .post('/foo')
      .type('application/json')
      .send('{ "foo": "bar", }')
      .expect(400)
      .then(response => {
        deepStrictEqual(response.body, {
          body: '{ \"foo\": \"bar\", }',
          message: 'Expected double-quoted property name in JSON at position 16 (line 1 column 17)'
        });
      });
  });

  it('should use the serviceManager if given.', async () => {
    class SomeService {
      test() { throw new Error('should not get called'); }
    }
    class MockService {
      test() { return 'bar'; }
    }
    class AppController {
      @dependency
      myService: SomeService;

      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK(this.myService.test());
      }
    }
    const serviceManager = new ServiceManager();
    serviceManager.set(SomeService, new MockService());

    const app = await createApp(AppController, {
      serviceManager
    });

    return await request(app)
      .post('/foo')
      .expect(200)
      .expect('bar');
  });

  it('should manually inject the OpenAPI service with a special ID string.', async () => {
    class AppController {}

    const serviceManager = new ServiceManager();

    await createApp(AppController, {
      serviceManager
    });

    strictEqual(serviceManager.get(OPENAPI_SERVICE_ID), serviceManager.get(OpenApi));
  });

  it('should call ServiceManager.boot.', async () => {
    let called = false;

    class Service {
      boot() {
        called = true;
      }
    }

    class AppController {
      @dependency
      service: Service;
    }

    await createApp(AppController);

    strictEqual(called, true);
  });

  it('should call AppController.init if it exists.', async () => {
    let called = false;

    class AppController {
      init() {
        called = true;
      }
    }

    await createApp(AppController);

    strictEqual(called, true);
  });

  it('should call AppController.init after ServiceManager.boot.', async () => {
    let str = '';

    class Service {
      boot() {
        str += 'a';
      }
    }

    class AppController {
      @dependency
      service: Service;

      init() {
        str += 'b';
      }
    }

    await createApp(AppController);

    strictEqual(str, 'ab');
  });

  it('should wait until the end of ServiceManager.boot execution before returning the express instance.', async () => {
    let called = false;

    class Service {
      async boot() {
        await 1;
        await 1;
        called = true;
      }
    }

    class AppController {
      @dependency
      service: Service;
    }

    await createApp(AppController);

    strictEqual(called, true);
  });

  it('should wait until the end of AppController.init execution before returning the express instance.', async () => {
    let called = false;

    class AppController {
      async init() {
        await 1;
        await 1;
        await 1;
        called = true;
      }
    }

    await createApp(AppController);

    strictEqual(called, true);
  });

  it('should throw any errors rejected in ServiceManager.boot.', async () => {
    class Service {
      boot() {
        return Promise.reject(new Error('Service initialization failed.'));
      }
    }

    class AppController {
      @dependency
      service: Service;
    }

    try {
      await createApp(AppController);
      throw new Error('An error should have been thrown');
    } catch (error: any) {
      strictEqual(error.message, 'Service initialization failed.');
    }
  });

  it('should throw any errors rejected in AppController.init.', async () => {
    class AppController {
      init() {
        return Promise.reject(new Error('Initialization failed.'));
      }
    }

    try {
      await createApp(AppController);
      throw new Error('An error should have been thrown');
    } catch (error: any) {
      strictEqual(error.message, 'Initialization failed.');
    }
  });

  context('given the configuration "settings.logger.logHttpRequests" is set to false', () => {
    it('should NOT log the request.', async () => {
      Config.set('settings.logger.logHttpRequests', false);

      class AppController {
        @Get('/a')
        getA(ctx: Context) {
          return new HttpResponseOK('a');
        }
      }

      const serviceManager = new ServiceManager();

      const logger = serviceManager.get(Logger);
      const loggerMock = mock.method(logger, 'info', () => {}).mock;

      const app = await createApp(AppController, {
        serviceManager
      });

      await request(app)
        .get('/a')
        .expect(200);

      strictEqual(loggerMock.callCount(), 0);
    });
  });

  context('given the configuration "settings.logger.logHttpRequests" is set to true', () => {
    it('should log the request with a detailed message and detail parameters.', async () => {
      Config.set('settings.logger.logHttpRequests', true);

      class AppController {
        @Get('/a')
        getA(ctx: Context) {
          return new HttpResponseOK('a');
        }
      }

      const serviceManager = new ServiceManager();

      const logger = serviceManager.get(Logger);
      const loggerMock = mock.method(logger, 'info', () => {}).mock;

      const app = await createApp(AppController, {
        serviceManager
      });

      await request(app)
        .get('/a?apiKey=a_secret_api_key')
        .expect(200);

      strictEqual(loggerMock.callCount(), 1);

      const message = loggerMock.calls[0].arguments[0];
      const params = loggerMock.calls[0].arguments[1];

      strictEqual(message, 'HTTP request - GET /a');
      strictEqual(typeof params?.responseTime, 'number')

      delete params?.responseTime;

      deepStrictEqual(params, {
        method: 'GET',
        url: '/a',
        statusCode: 200,
        contentLength: '1',
      });
    });

    it('should use the options.getHttpLogParams if provided', async () => {
      Config.set('settings.logger.logHttpRequests', true);

      class AppController {
        @Get('/a')
        getA(ctx: Context) {
          return new HttpResponseOK('a');
        }
      }

      const serviceManager = new ServiceManager();

      const logger = serviceManager.get(Logger);
      const loggerMock = mock.method(logger, 'info', () => {}).mock;

      const app = await createApp(AppController, {
        serviceManager,
        getHttpLogParams: (tokens: any, req: any, res: any) => ({
          method: tokens.method(req, res),
          url: tokens.url(req, res).split('?')[0],
          myCustomHeader: req.get('my-custom-header')
        }),
      });

      await request(app)
        .get('/a')
        .set('my-custom-header', 'my-custom-value')
        .expect(200);

      strictEqual(loggerMock.callCount(), 1);

      const message = loggerMock.calls[0].arguments[0];
      const params = loggerMock.calls[0].arguments[1];

      strictEqual(message, 'HTTP request - GET /a');

      deepStrictEqual(params, {
        method: 'GET',
        url: '/a',
        myCustomHeader: 'my-custom-value',
      });
    });
  });

  context('given the configuration "settings.logger.logHttpRequests" is not set', () => {
    it('should behave like the configuration is set to true.', async () => {
      class AppController {
        @Get('/a')
        getA(ctx: Context) {
          return new HttpResponseOK('a');
        }
      }

      const serviceManager = new ServiceManager();

      const logger = serviceManager.get(Logger);
      const loggerMock = mock.method(logger, 'info', () => {}).mock;

      const app = await createApp(AppController, {
        serviceManager
      });

      await request(app)
        .get('/a')
        .expect(200);

      strictEqual(loggerMock.callCount(), 1);
    });
  });

  it('should allow to add log context information.', async () => {
    Config.set('settings.logger.format', 'json');

    class AppController {
      @dependency
      logger: Logger;

      @Get('/')
      @Hook((ctx, services) => {
        const logger = services.get(Logger);
        logger.addLogContext({ foo: 'bar' });
      })
      getA(ctx: Context) {
        this.logger.info('Hello world');
        return new HttpResponseOK();
      }
    }

    const serviceManager = new ServiceManager();

    const consoleMock = mock.method(console, 'log', () => {}).mock;

    const app = await createApp(AppController, {
      serviceManager
    });

    await request(app)
      .get('/')
      .expect(200);

    const messages = consoleMock.calls.map(call => JSON.parse(call.arguments[0]));

    strictEqual(messages.some(message => message.foo === 'bar'), true);
  });

  context('given a "X-Request-ID" header is present in the request', () => {
    it('should add the request ID to the request object.', async () => {
      const requestId = 'a_request_id';

      class AppController {
        @Get('/')
        get(ctx: Context) {
          return new HttpResponseOK({
            requestId: ctx.request.id
          });
        }
      }

      const serviceManager = new ServiceManager();
      const app = await createApp(AppController, {
        serviceManager
      });

      await request(app)
        .get('/')
        .set('X-Request-ID', requestId)
        .expect(200)
        .expect({
          requestId,
        });
    });
  });

  context('given a "X-Request-ID" header is NOT present in the request', () => {
    it('should add a request ID to the request object.', async () => {
      class AppController {
        @Get('/')
        get(ctx: Context) {
          return new HttpResponseOK({
            requestId: ctx.request.id
          });
        }
      }

      const serviceManager = new ServiceManager();
      const app = await createApp(AppController, {
        serviceManager
      });

      await request(app)
        .get('/')
        .expect(200)
        .expect(response => {
          if (!response.body.requestId) {
            throw new Error('The request ID should exist.');
          }
        });
    });
  });

  it('should add the request ID to the log context.', async () => {
    class AppController {
      @Get('/')
      get(ctx: Context) {
        return new HttpResponseOK({
          requestId: ctx.request.id
        });
      }
    }

    const serviceManager = new ServiceManager();
    const logger = serviceManager.get(Logger);
    const loggerMock = mock.method(logger, 'addLogContext', () => {}).mock;

    const app = await createApp(AppController, {
      serviceManager
    });

    let requestId: string|undefined;
    await request(app)
      .get('/')
      .expect(200)
      .then(response => {
        requestId = response.body.requestId;
      })

    strictEqual(loggerMock.callCount(), 1);

    const args = loggerMock.calls[0].arguments;

    deepStrictEqual(args, [{ requestId }]);
  });

  it('should prioritize static routes over dynamic routes to prevent shadowing.', async () => {
    class AppController {
      @Get('/mypath/:param')
      dynamicRoute(ctx: Context) {
        return new HttpResponseOK({ type: 'dynamic', param: ctx.request.params.param });
      }

      @Get('/mypath/some-static-path')
      staticRoute() {
        return new HttpResponseOK({ type: 'static' });
      }

      @Get('/mypath/another-static')
      anotherStaticRoute() {
        return new HttpResponseOK({ type: 'another-static' });
      }
    }

    const app = await createApp(AppController);

    // Static route should match exactly
    await request(app)
      .get('/mypath/some-static-path')
      .expect(200)
      .expect({ type: 'static' });

    // Another static route should match exactly
    await request(app)
      .get('/mypath/another-static')
      .expect(200)
      .expect({ type: 'another-static' });

    // Dynamic route should match other paths
    await request(app)
      .get('/mypath/test')
      .expect(200)
      .expect({ type: 'dynamic', param: 'test' });
  });

  it('should prioritize more specific routes with multiple segments.', async () => {
    class AppController {
      @Get('/api/:id')
      dynamicOne(ctx: Context) {
        return new HttpResponseOK({ type: 'dynamic-one', id: ctx.request.params.id });
      }

      @Get('/api/users')
      staticUsers() {
        return new HttpResponseOK({ type: 'static-users' });
      }

      @Get('/api/users/:userId')
      dynamicUserId(ctx: Context) {
        return new HttpResponseOK({ type: 'dynamic-user', userId: ctx.request.params.userId });
      }

      @Get('/api/users/current')
      staticCurrent() {
        return new HttpResponseOK({ type: 'static-current' });
      }

      @Get('/api/:resource/:id')
      dynamicTwo(ctx: Context) {
        return new HttpResponseOK({
          type: 'dynamic-two',
          resource: ctx.request.params.resource,
          id: ctx.request.params.id
        });
      }
    }

    const app = await createApp(AppController);

    // Most specific static route should match
    await request(app)
      .get('/api/users/current')
      .expect(200)
      .expect({ type: 'static-current' });

    // Static route should match
    await request(app)
      .get('/api/users')
      .expect(200)
      .expect({ type: 'static-users' });

    // Dynamic route with one parameter should match
    await request(app)
      .get('/api/users/123')
      .expect(200)
      .expect({ type: 'dynamic-user', userId: '123' });

    // Dynamic route should match other paths
    await request(app)
      .get('/api/products')
      .expect(200)
      .expect({ type: 'dynamic-one', id: 'products' });

    // Dynamic route with two parameters should match
    await request(app)
      .get('/api/posts/456')
      .expect(200)
      .expect({ type: 'dynamic-two', resource: 'posts', id: '456' });
  });

  it('should prioritize static routes over dynamic routes across different controllers.', async () => {
    class SubController1 {
      @Get('/api/:id')
      dynamicRoute(ctx: Context) {
        return new HttpResponseOK({ type: 'dynamic-sub1', id: ctx.request.params.id });
      }
    }

    class SubController2 {
      @Get('/api/users')
      staticRoute() {
        return new HttpResponseOK({ type: 'static-sub2' });
      }
    }

    class AppController {
      subControllers = [SubController1, SubController2];

      @Get('/api/users/current')
      mainStaticRoute() {
        return new HttpResponseOK({ type: 'static-main' });
      }

      @Get('/api/:resource/:action')
      mainDynamicRoute(ctx: Context) {
        return new HttpResponseOK({
          type: 'dynamic-main',
          resource: ctx.request.params.resource,
          action: ctx.request.params.action
        });
      }
    }

    const app = await createApp(AppController);

    // Most specific static route from main controller should match
    await request(app)
      .get('/api/users/current')
      .expect(200)
      .expect({ type: 'static-main' });

    // Static route from SubController2 should match
    await request(app)
      .get('/api/users')
      .expect(200)
      .expect({ type: 'static-sub2' });

    // Dynamic route from SubController1 should match other single-segment paths
    await request(app)
      .get('/api/products')
      .expect(200)
      .expect({ type: 'dynamic-sub1', id: 'products' });

    // Dynamic route from main controller should match two-segment paths
    await request(app)
      .get('/api/posts/create')
      .expect(200)
      .expect({ type: 'dynamic-main', resource: 'posts', action: 'create' });
  });
});
