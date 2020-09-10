// std
import { strictEqual } from 'assert';
import { Buffer } from 'buffer';

// 3p
import * as express from 'express';
import * as request from 'supertest';

// FoalTS
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import {
  Config, Context, Delete, dependency, Get, Head, HttpResponseOK, OpenApi, Options, Patch, Post, Put, ServiceManager
} from '../core';
import { createApp, OPENAPI_SERVICE_ID } from './create-app';

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
    Config.remove('settings.staticPathPrefix');
    Config.remove('settings.debug');
    Config.remove('settings.bodyParser.limit');
  });

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
      .expect('X-Content-Type-Options', 'nosniff');
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
      // The type of the second parameter of `set` is incorrect.
      .set('Cookie', ['nameOne=valueOne;nameTwo=valueTwo'] as any)
      .expect(200)
      .expect({
        nameOne: 'valueOne',
        nameTwo: 'valueTwo',
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

  it('should respond on DELETE, GET, PATCH, POST, PUT, HEAD and OPTIONS requests if a handler exists.', async () => {
    class MyController {
      @Head('/foo')
      head() {
        // A HEAD response does not have a body.
        return new HttpResponseOK()
          .setHeader('foo', 'bar');
      }
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
      @Options('/foo')
      options() {
        return new HttpResponseOK('options');
      }
    }
    const app = await createApp(MyController);
    return Promise.all([
      request(app).get('/foo').expect('get'),
      request(app).post('/foo').expect('post'),
      request(app).patch('/foo').expect('patch'),
      request(app).put('/foo').expect('put'),
      request(app).delete('/foo').expect('delete'),
      request(app).head('/foo').expect(200).expect('foo', 'bar'),
      request(app).options('/foo').expect('options'),
    ]);
  });

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

  it('should use the optional postMiddlewares if they are given (in good time).', async () => {
    Config.set('settings.debug', true);

    class AppController {
      @Get('/a')
      getA(ctx: Context) {
        return new HttpResponseOK('a');
      }
      @Get('/c')
      getC(ctx: Context) {
        throw new Error('This is an error');
      }
    }

    const app = await createApp(AppController, {
      postMiddlewares: [
        express.Router().get('/a', (req: any, res: any) => res.send('a2')),
        express.Router().get('/b', (req: any, res: any) => res.send('b2')),
        (err: any, req: any, res: any, next: any) => {
          err.message += '!!!';
          next(err);
        }
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
      request(app)
        .get('/c')
        .expect(500)
        .then(response => {
          strictEqual(
            response.text.includes('This is an error!!!'),
            true
          );
        })
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
      .expect({
        body: '{ \"foo\": \"bar\", }',
        message: 'Unexpected token } in JSON at position 16'
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
    } catch (error) {
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
    } catch (error) {
      strictEqual(error.message, 'Initialization failed.');
    }
  });

});
