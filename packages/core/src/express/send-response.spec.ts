// std
import { deepStrictEqual, strictEqual } from 'assert';
import { Readable } from 'stream';

// 3p
import * as express from 'express';
import * as request from 'supertest';

// FoalTS
import {
  HttpResponse, HttpResponseBadRequest, HttpResponseCreated,
  HttpResponseInternalServerError, HttpResponseMovedPermanently,
  HttpResponseOK, HttpResponseRedirect
} from '../core';
import { sendResponse } from './send-response';

function execSendResponse(response: HttpResponse): request.Test {
  const app = express()
    .use((req: any, res: any) => sendResponse(response, res, { error: () => {} }));
  return request(app).get('/');
}

describe('sendResponse', () => {

  it('should send the response status.', () => {
    return Promise.all([
      execSendResponse(new HttpResponseCreated()).expect(201),
      execSendResponse(new HttpResponseBadRequest()).expect(400),
      execSendResponse(new HttpResponseInternalServerError()).expect(500),
    ]);
  });

  it('should send the response body (no stream).', () => {
    return Promise.all([
      execSendResponse(new HttpResponseOK('foo')).expect('foo'),
      execSendResponse(new HttpResponseOK({ message: 'bar' })).expect({ message: 'bar' }),
      execSendResponse(new HttpResponseOK(3)).expect('3'),
      execSendResponse(new HttpResponseOK()).then(response => {
        deepStrictEqual(response.body, {});
      }),
    ]);
  });

  it('should send the response body (stream).', () => {
    const stream = new Readable({
      read() {
        this.push('Stream ');
        this.push('content');
        this.push(null);
      }
    });
    return execSendResponse(new HttpResponseOK(stream, { stream: true }))
      .expect('Stream content');
  });

  it('should prevent the process from being killed if the response body (stream) emits an error.', () => {
    // Note: The "pipeline" function actually does more than that
    // and takes care of closing each stream if one is closed.
    const stream = new Readable({
      read() {
        this.push('Stream ');
        this.push('content');
        this.push(null);
      }
    });
    setTimeout(() => stream.emit('error', new Error('hello')), 1000);

    return execSendResponse(new HttpResponseOK(stream, { stream: true }))
      .expect('Stream content');
  });

  it('should send the headers.', () => {
    const successResponse = new HttpResponseCreated();
    successResponse.setHeader('X-CSRF-Token', 'aaa');
    const clientErrorResponse = new HttpResponseBadRequest();
    clientErrorResponse.setHeader('X-CSRF-Token', 'bbb');
    const serverErrorResponse = new HttpResponseInternalServerError();
    serverErrorResponse.setHeader('X-CSRF-Token', 'ccc');

    return Promise.all([
      execSendResponse(successResponse).expect('X-CSRF-Token', 'aaa'),
      execSendResponse(clientErrorResponse).expect('X-CSRF-Token', 'bbb'),
      execSendResponse(serverErrorResponse).expect('X-CSRF-Token', 'ccc'),
    ]);
  });

  it('should send the cookies.', () => {
    const successResponse = new HttpResponseCreated()
      .setCookie('cookie1', 'cookie1_value_a')
      .setCookie('cookie2', 'cookie2_value_a', { httpOnly: true });
    const clientErrorResponse = new HttpResponseBadRequest()
      .setCookie('cookie1', 'cookie1_value_b')
      .setCookie('cookie2', 'cookie2_value_b', { httpOnly: true });
    const serverErrorResponse = new HttpResponseInternalServerError()
      .setCookie('cookie1', 'cookie1_value_c')
      .setCookie('cookie2', 'cookie2_value_c', { maxAge: 60 });

    return Promise.all([
      execSendResponse(successResponse)
        .expect('Set-Cookie', 'cookie1=cookie1_value_a; Path=/,cookie2=cookie2_value_a; Path=/; HttpOnly'),
      execSendResponse(clientErrorResponse)
      .expect('Set-Cookie', 'cookie1=cookie1_value_b; Path=/,cookie2=cookie2_value_b; Path=/; HttpOnly'),
      execSendResponse(serverErrorResponse)
      .then(response => {
        const beginning = response.header['set-cookie'][1].split('; Expires')[0];
        strictEqual(beginning, 'cookie2=cookie2_value_c; Max-Age=60; Path=/');
      })
    ]);
  });

  it('should redirect the page with the correct status (301).', () => {
    return execSendResponse(new HttpResponseMovedPermanently('/b'))
      .expect('location', '/b')
      .expect(301);
  });

  it('should redirect the page with the correct status (302).', () => {
    return execSendResponse(new HttpResponseRedirect('/b'))
      .expect('location', '/b')
      .expect(302);
  });

  it('should redirect the page with the headers.', () => {
    const response = new HttpResponseRedirect('/b');
    response.setHeader('X-CSRF-Token', 'aaa');
    return execSendResponse(response)
      .expect('X-CSRF-Token', 'aaa');
  });

});
