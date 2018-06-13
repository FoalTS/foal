import { expect } from 'chai';
import * as express from 'express';
import * as request from 'supertest';

import {
  HttpResponseOK,
  Route,
  ServiceManager
} from '../core';
import { getExpressMiddleware } from './get-express-middleware';

describe(`getExpressMiddleware`, () => {

  // The below items are more end-to-end tests than unit ones.

  it('should get the response for the given route and send it back to the client if it is defined.', () => {
    const app = express();
    const route: Route = {
      handler: ctx => new HttpResponseOK('Success'),
      httpMethod: 'GET',
      path: '/',
      postHooks: [],
      preHooks: []
    };
    app.use(getExpressMiddleware(route, new ServiceManager(), []));

    return request(app)
      .get('/')
      .expect(200)
      .expect('Success');
  });

  it('should forward the error to the next express middleware if one is thrown or rejected.', () => {
    const err = Error('Fail');
    let forwardedError;

    const app = express();
    const route: Route = {
      handler: async ctx => { throw err; },
      httpMethod: 'GET',
      path: '/',
      postHooks: [],
      preHooks: []
    };
    app.use(getExpressMiddleware(route, new ServiceManager(), []));
    app.use((err, req, res, next) => {
      forwardedError = err;
      res.send('Caught');
    });

    return request(app)
      .get('/')
      .expect('Caught')
      .then(() => {
        expect(forwardedError).to.equal(err);
      });
  });

});
