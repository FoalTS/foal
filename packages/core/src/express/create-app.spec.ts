// std
import { strictEqual } from 'assert';

// 3p
import * as express from 'express';
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

  it('should use the optional express instance if one is given.', () => {
    const expected = express();
    const actual = createApp(class {}, expected);

    strictEqual(actual, expected);
  });

});
