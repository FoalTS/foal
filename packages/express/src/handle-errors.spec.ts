import { InternalServerError, NotFoundError } from '@foal/core';
import { expect } from 'chai';
import * as express from 'express';
import * as request from 'supertest';

import { handleErrors } from './handle-errors';

describe('handleErrors(options?, logFn?)', () => {

  describe('should return an error-handling middleware which', () => {

    it('should log the error with the given log function if options.logs equals \'all\'.', () => {
      let called = false;
      const logFn = () => called = true;

      const middleware1 = handleErrors({ logs: 'all' }, logFn);

      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(middleware1);
      return request(app)
        .get('/')
        .then(res => {
          expect(called).to.equal(true);
        });
    });

    it('should log the error with the given log function if options.logs equals \'500\' '
      + 'and error.statusCode=undefined.', () => {
      let called = false;
      const logFn = () => called = true;

      const middleware1 = handleErrors({ logs: '500' }, logFn);

      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(middleware1);
      return request(app)
        .get('/')
        .then(res => {
          expect(called).to.equal(true);
        });
    });

    it('should log the error with the given log function if options.logs equals \'500\' '
      + 'and error.statusCode=500.', () => {
      let called = false;
      const logFn = () => called = true;

      const middleware1 = handleErrors({ logs: '500' }, logFn);

      const app = express();
      app.use((req, res, next) => { throw new InternalServerError(); });
      app.use(middleware1);
      return request(app)
        .get('/')
        .then(res => {
          expect(called).to.equal(true);
        });
    });

    it('should not log the error with the given log function if options.logs equals \'500\' '
      + 'and error.statusCode!=(500 & undefined).', () => {
      let called = false;
      const logFn = () => called = true;

      const middleware1 = handleErrors({ logs: '500' }, logFn);

      const app = express();
      app.use((req, res, next) => { throw new NotFoundError(); });
      app.use(middleware1);
      return request(app)
        .get('/')
        .then(res => {
          expect(called).to.equal(false);
        });
    });

    it('should not log the error with the given log function if options.logs equals \'none\'.', () => {
      let called = false;
      const logFn = () => called = true;

      const middleware1 = handleErrors({ logs: 'none' }, logFn);

      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(middleware1);
      return request(app)
        .get('/')
        .then(res => {
          expect(called).to.equal(false);
        });
    });

    it('should send the suitable headers if the error has a `headers` property.', () => {
      const app = express();
      app.use((req, res, next) => {
        throw { headers: { 'WWW-Authenticate': 'Basic' } };
      });
      app.use(handleErrors());
      return request(app)
        .get('/')
        .expect('WWW-Authenticate', 'Basic');
    });

    it('should send a status equal to 500 if the error has no `statusCode` property.', () => {
      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(handleErrors());
      return request(app)
        .get('/')
        .then(res => {
          expect(res.status).to.equal(500);
        });
    });

    it('should send a suitable status if the error has a `statusCode` property.', () => {
      const app = express();
      app.use((req, res, next) => { throw new NotFoundError(); });
      app.use(handleErrors());
      return request(app)
        .get('/')
        .then(res => {
          expect(res.status).to.equal(404);
        });
    });

    it('should send the suitable `statusCode`, `statusMessage` and `details` if the error has '
        + 'these properties.', () => {
      const app = express();
      const details = {
        message: 'details'
      };
      app.use((req, res, next) => { throw new NotFoundError(details); });
      app.use(handleErrors());
      return request(app)
        .get('/')
        .set('accept', 'application/json')
        .then(res => {
          expect(res.body.statusCode).to.equal(404);
          expect(res.body.statusMessage).to.equal('NOT FOUND');
          expect(res.body.details).to.deep.equal(details);
        });
    });

    it('should send statusCode=500 and statusMessage=`INTERNAL SERVER ERROR` if the error '
        + 'does not have these properties.', () => {
      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(handleErrors());
      return request(app)
        .get('/')
        .set('accept', 'application/json')
        .then(res => {
          expect(res.body.statusCode).to.equal(500);
          expect(res.body.statusMessage).to.equal('INTERNAL SERVER ERROR');
        });
    });

    it('should send the stack if options.sendStack is true.', () => {
      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(handleErrors({ sendStack: true }));
      return request(app)
        .get('/')
        .set('accept', 'application/json')
        .then(res => {
          expect(res.body.stack).to.be.an('string');
        });
    });

    it('should not send the stack if options.sendStack is false.', () => {
      const app = express();
      app.use((req, res, next) => { throw new Error(); });
      app.use(handleErrors({ sendStack: false }));
      return request(app)
        .get('/')
        .then(res => {
          expect(res.body.stack).to.equal(undefined);
        });
    });

    it('should return an html page with the previous information if the request accepts html.', () => {
      const app = express();
      const details = {
        message: 'details'
      };
      app.use((req, res, next) => { throw new NotFoundError(details); });
      app.use(handleErrors({ sendStack: false }));
      return request(app)
        .get('/')
        // This is the default header when requesting a page on Chrome.
        .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
        .then(res => {
          expect(res.text).to.equal(
            '<html>'
            + '<head>'
            +  '<title>404 - NOT FOUND</title>'
            + '</head>'
            + '<body>'
            +  '<h1>404 - NOT FOUND</h1>'
            +  '<h2>Details:</h2>'
            +  '<pre>{\n "message": "details"\n}</pre>'
            + '</body>'
            + '</html>');
        });
    });

  });

});
