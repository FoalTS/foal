import * as express from 'express';
import * as request from 'supertest';

import {
  HttpResponseBadRequest,
  HttpResponseCreated,
  HttpResponseInternalServerError,
  HttpResponseOK,
  HttpResponseRedirect
} from '../../core';
import { sendResponse } from './send-response';

describe('sendResponse', () => {

  describe('when the response is an instance of HttpResponseSuccess, HttpResponseClientError '
           + ' or HttpResponseServerError', () => {

    it('should send a response with a suitable status.', () => {
      const app = express();
      app.get('/success', (req, res) => sendResponse(res, new HttpResponseCreated()));
      app.get('/client-error', (req, res) => sendResponse(res, new HttpResponseBadRequest()));
      app.get('/server-error', (req, res) => sendResponse(res, new HttpResponseInternalServerError()));

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

    it('should send a response with a suitable body if response.content is defined.', () => {
      const app = express();
      app.get('/a', (req, res) => sendResponse(res, new HttpResponseOK('foo')));
      app.get('/b', (req, res) => sendResponse(res, new HttpResponseOK({ message: 'bar' })));
      app.get('/c', (req, res) => sendResponse(res, new HttpResponseOK(3)));
      app.get('/d', (req, res) => sendResponse(res, new HttpResponseOK()));

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
      ]);
    });

  });

  describe('when the response is an instance of HttpResponseRedirection', () => {

    it('should redirect the page with the correct status.', () => {
      const app = express();
      app.get('/a', (req, res) => sendResponse(res, new HttpResponseRedirect('/b')));
      app.get('/b', (req, res) => res.send('foo'));

      return request(app)
        .get('/a')
        .expect('location', '/b')
        .expect(302);
    });

  });

});
