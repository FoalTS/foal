// 3p
import * as request from 'supertest';

import { Context, createApp, Get, HttpResponseInternalServerError } from '@foal/core';

describe('FoalTS should support custom error-handling', () => {

  it('to custom the error response (error thrown in a controller).', async () => {
    class AppController {
      @Get('/')
      index() {
        throw new Error('Hello world');
      }

      handleError(err: Error, ctx: Context) {
        return new HttpResponseInternalServerError({
          err: err.message,
          message: 'An error occured.',
          path: ctx.request.path,
        });
      }
    }

    const app = await createApp(AppController, {
      methods: {
        handleError: true
      }
    });

    return request(app)
      .get('/')
      .expect(500)
      .expect({
        err: 'Hello world',
        message: 'An error occured.',
        path: '/'
      });
  });

  it('to custom the error response (error thrown in a post middleware).', async () => {
    class AppController {
      @Get('/')
      index() {
        throw new Error('Hello world');
      }

      handleError(err: Error, ctx: Context) {
        return new HttpResponseInternalServerError({
          err: err.message,
          message: 'An error occured.',
          path: ctx.request.path,
        });
      }
    }

    const app = await createApp(AppController, {
      methods: {
        handleError: true
      },
      postMiddlewares: [
        (err: any, req: any, res: any, next: (err?: any) => any) => {
          next(new Error('Hi!'));
        }
      ]
    });

    return request(app)
      .get('/')
      .expect(500)
      .expect({
        err: 'Hi!',
        message: 'An error occured.',
        path: '/'
      });
  });

});
