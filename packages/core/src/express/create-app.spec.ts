// std
import { strictEqual } from 'assert';
import { Buffer } from 'buffer';

// 3p
import * as express from 'express';
import * as request from 'supertest';

// FoalTS
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { Context, Delete, Get, Head, HttpResponseOK, Options, Patch, Post, Put, ServiceManager } from '../core';
import { createAndInitApp, createApp } from './create-app';

describe('createApp', () => {

  before(() => {
    if (!existsSync('test-public')) {
      mkdirSync('test-public');
    }
    writeFileSync('test-public/hello-world.html', '<h1>Hello world!</h1>', 'utf8');
    process.env.SETTINGS_STATIC_PATH = 'test-public';
  });

  after(() => {
    delete process.env.SETTINGS_STATIC_PATH;
    if (existsSync('test-public/hello-world.html')) {
      unlinkSync('test-public/hello-world.html');
    }
    if (existsSync('test-public')) {
      rmdirSync('test-public');
    }
  });

  afterEach(() => {
    delete process.env.SETTINGS_STATIC_PATH_PREFIX;
    delete process.env.SETTING_DEBUG;
    delete process.env.SETTINGS_BODY_PARSER_LIMIT;
  });

  it('should include security headers in HTTP responses.', async () => {
    class AppController {
      @Get('/')
      index() {
        return new HttpResponseOK()
          .setHeader('X-Custom-Header', 'foobar');
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
    const app = createApp(MyController);
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

  it('should accept higher or lower request body size if this is specified in the configuration.', async () => {
    process.env.SETTINGS_BODY_PARSER_LIMIT = '10';

    class MyController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK();
      }
    }

    const app = createApp(MyController);
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

  it('should use the optional express instance if one is given.', () => {
    const expected = express();
    const actual = createApp(class {}, expected);

    strictEqual(actual, expected);
  });

  it('should use the optional options.expressInstance if one is given.', () => {
    const expected = express();
    const actual = createApp(class {}, {
      expressInstance: expected
    });

    strictEqual(actual, expected);
  });

  it('should use the optional preMiddlewares if they are given.', () => {
    class AppController {
      @Get('/')
      get(ctx: Context) {
        return new HttpResponseOK(
          (ctx.request as any).foalMessage
        );
      }
    }

    const app = createApp(AppController, {
      preMiddlewares: [
        (req, res, next) => { req.foalMessage = 'Hello world!'; next(); }
      ]
    });

    return request(app)
      .get('/')
      .expect(200)
      .expect('Hello world!');
  });

  it('should use the optional postMiddlewares if they are given (in good time).', () => {
    process.env.SETTINGS_DEBUG = 'true';

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

    const app = createApp(AppController, {
      postMiddlewares: [
        express.Router().get('/a', (req, res) => res.send('a2')),
        express.Router().get('/b', (req, res) => res.send('b2')),
        (err, req, res, next) => {
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

  it('should make the serviceManager available from the express instance.', () => {
    const app = createApp(class {});

    strictEqual(typeof app.foal, 'object');
    strictEqual(app.foal.services instanceof ServiceManager, true);
  });

  it('should send a pretty error if the JSON in the request body is invalid.', () => {
    class AppController {
      @Post('/foo')
      post(ctx: Context) {
        return new HttpResponseOK({ body: ctx.request.body });
      }
    }
    const app = createApp(AppController);

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

});

describe('createAndInitApp', () => {

  it('should call createApp and return asynchronously its express instance.', async () => {
    class AppController {
      @Get('/ping')
      ping() {
        return new HttpResponseOK('pong');
      }
    }

    const app = await createAndInitApp(AppController, {
      postMiddlewares: [
        express.Router().get('/ping2', (req, res) => res.send('pong'))
      ]
    });

    await request(app)
      .get('/ping')
      .expect('pong');

    await request(app)
      .get('/ping2')
      .expect('pong');
  });

  it('should call AppController.init if it exists.', () => {
    let called = false;

    class AppController {
      init() {
        called = true;
      }
    }

    createAndInitApp(AppController);

    strictEqual(called, true);
  });

  it('should wait until the end of AppController.init execution before returning the express instance.', async () => {
    let called = false;

    class AppController {
      async init() {
        await 1;
        await 1;
        called = true;
      }
    }

    await createAndInitApp(AppController);

    strictEqual(called, true);
  });

  it('should throw any errors rejected in AppController.init.', async () => {
    class AppController {
      init() {
        return Promise.reject(new Error('Initialization failed.'));
      }
    }

    try {
      await createAndInitApp(AppController);
      throw new Error('An error should have been thrown');
    } catch (error) {
      strictEqual(error.message, 'Initialization failed.');
    }
  });

});
