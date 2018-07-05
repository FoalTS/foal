import { expect } from 'chai';
import * as express from 'express';
import * as request from 'supertest';

import { App, Controller, HttpMethod, HttpResponseCreated } from '../core';
import { getMiddlewares } from './get-middlewares';

function route(httpMethod: HttpMethod, path: string, handler): Controller<'main'> {
  const controller = new Controller<'main'>();
  controller.addRoute('main', httpMethod, path, handler);
  return controller;
}

describe('getMiddlewares', () => {

  it('should return an array of three middlewares', () => {
    const actual = getMiddlewares(new App({}), { debug: false });
    expect(actual).to.be.an('array').and.to.have.lengthOf(3);
  });

  describe('which', () => {

    // The below items are more end-to-end tests than unit ones.

    it('should 201 on a successful "CREATED" request.', () => {
      const middlewares = getMiddlewares(new App({
        controllers: [
          route('GET', '/create', () => new HttpResponseCreated('Created!'))
        ]
      }), { debug: false });

      const app = express();
      app.use(middlewares);

      return request(app)
        .get('/create')
        .expect(201)
        .expect('Created!');
    });

    it('should 500 if an error is thrown in a controller of the app.', () => {
      const middlewares = getMiddlewares(new App({
        controllers: [
          route('GET', '/delete', () => {
            throw new Error();
          })
        ]
      }), { debug: false }, [], () => {});

      const app = express();
      app.use(middlewares);

      return request(app)
        .get('/delete')
        .expect(500);
    });

    it('should 404 on a wrong URL.', () => {
      const middlewares = getMiddlewares(new App({}), { debug: false });

      const app = express();
      app.use(middlewares);

      return request(app)
        .get('/foo')
        .expect(404);
    });

  });

});
