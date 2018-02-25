import { expect } from 'chai';

import {
  HttpResponse,
  HttpResponseBadRequest,
  HttpResponseClientError,
  HttpResponseConflict,
  HttpResponseCreated,
  HttpResponseForbidden,
  HttpResponseInternalServerError,
  HttpResponseMethodNotAllowed,
  HttpResponseNotImplemented,
  HttpResponseNotFound,
  HttpResponseOK,
  HttpResponseRedirect,
  HttpResponseRedirection,
  HttpResponseServerError,
  HttpResponseSuccess,
  HttpResponseUnauthorized,
} from './http-responses';
import { Class } from '../interfaces';


describe('HttpResponseOK', () => {

  it('should inherit from HttpResponseSuccess and HttpResponse', () => {
    const httpResponse = new HttpResponseOK();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseSuccess);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseOK();
    expect(httpResponse.statusCode).to.equal(200);
    expect(httpResponse.statusMessage).to.equal('OK');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseOK();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseOK(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseCreated', () => {

  it('should inherit from HttpResponseSuccess and HttpResponse', () => {
    const httpResponse = new HttpResponseCreated();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseSuccess);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseCreated();
    expect(httpResponse.statusCode).to.equal(201);
    expect(httpResponse.statusMessage).to.equal('CREATED');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseCreated();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseCreated(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseRedirect', () => {

  it('should inherit from HttpResponseRedirection and HttpResponse', () => {
    const httpResponse = new HttpResponseRedirect('/foo');
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseRedirection);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseRedirect('/foo');
    expect(httpResponse.statusCode).to.equal(302);
    expect(httpResponse.statusMessage).to.equal('FOUND');
  });

  it('should accept a mandatory path and an optional content.', () => {
    let httpResponse = new HttpResponseRedirect('/foo');
    expect(httpResponse.path).to.equal('/foo');
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseRedirect('/foo', content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseBadRequest', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseBadRequest();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseBadRequest();
    expect(httpResponse.statusCode).to.equal(400);
    expect(httpResponse.statusMessage).to.equal('BAD REQUEST');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseBadRequest();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseBadRequest(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseUnauthorized', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseUnauthorized();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseUnauthorized();
    expect(httpResponse.statusCode).to.equal(401);
    expect(httpResponse.statusMessage).to.equal('UNAUTHORIZED');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseUnauthorized();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseUnauthorized(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseForbidden', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseForbidden();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseForbidden();
    expect(httpResponse.statusCode).to.equal(403);
    expect(httpResponse.statusMessage).to.equal('FORBIDDEN');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseForbidden();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseForbidden(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseNotFound', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseNotFound();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseNotFound();
    expect(httpResponse.statusCode).to.equal(404);
    expect(httpResponse.statusMessage).to.equal('NOT FOUND');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseNotFound();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseNotFound(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseMethodNotAllowed', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseMethodNotAllowed();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseMethodNotAllowed();
    expect(httpResponse.statusCode).to.equal(405);
    expect(httpResponse.statusMessage).to.equal('METHOD NOT ALLOWED');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseMethodNotAllowed();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseMethodNotAllowed(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseConflict', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseConflict();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseConflict();
    expect(httpResponse.statusCode).to.equal(409);
    expect(httpResponse.statusMessage).to.equal('CONFLICT');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseConflict();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseConflict(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseInternalServerError', () => {

  it('should inherit from HttpResponseServerError and HttpResponse', () => {
    const httpResponse = new HttpResponseInternalServerError();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseServerError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseInternalServerError();
    expect(httpResponse.statusCode).to.equal(500);
    expect(httpResponse.statusMessage).to.equal('INTERNAL SERVER ERROR');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseInternalServerError();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseInternalServerError(content);
    expect(httpResponse.content).to.equal(content);
  });

});

describe('HttpResponseNotImplemented', () => {

  it('should inherit from HttpResponseServerError and HttpResponse', () => {
    const httpResponse = new HttpResponseNotImplemented();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseServerError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseNotImplemented();
    expect(httpResponse.statusCode).to.equal(501);
    expect(httpResponse.statusMessage).to.equal('NOT IMPLEMENTED');
  });

  it('should accept an optional content.', () => {
    let httpResponse = new HttpResponseNotImplemented();
    expect(httpResponse.content).to.equal(undefined);

    const content = { foo: 'bar' };
    httpResponse = new HttpResponseNotImplemented(content);
    expect(httpResponse.content).to.equal(content);
  });

});
