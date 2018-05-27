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
  HttpResponseNoContent,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
  HttpResponseRedirect,
  HttpResponseRedirection,
  HttpResponseServerError,
  HttpResponseSuccess,
  HttpResponseUnauthorized,
  isHttpResponse,
  isHttpResponseBadRequest,
  isHttpResponseClientError,
  isHttpResponseConflict,
  isHttpResponseCreated,
  isHttpResponseForbidden,
  isHttpResponseInternalServerError,
  isHttpResponseMethodNotAllowed,
  isHttpResponseNoContent,
  isHttpResponseNotFound,
  isHttpResponseNotImplemented,
  isHttpResponseOK,
  isHttpResponseRedirect,
  isHttpResponseRedirection,
  isHttpResponseServerError,
  isHttpResponseSuccess,
  isHttpResponseUnauthorized
} from './http-responses';

describe('isHttpResponse', () => {

  it('should return true if the given object is an instance of HttpResponse.', () => {
    const err = new HttpResponseCreated();
    expect(isHttpResponse(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponse property equal to true.', () => {
    const err = { isHttpResponse: true };
    expect(isHttpResponse(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponse and if it '
      + 'has no property isHttpResponse.', () => {
    const err = {};
    expect(isHttpResponse(err)).to.equal(false);
  });

});

describe('isHttpResponseSuccess', () => {

  it('should return true if the given object is an instance of HttpResponseSuccess.', () => {
    const err = new HttpResponseCreated();
    expect(isHttpResponseSuccess(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseSuccess property equal to true.', () => {
    const err = { isHttpResponseSuccess: true };
    expect(isHttpResponseSuccess(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseSuccess and if it '
      + 'has no property isHttpResponseSuccess.', () => {
    const err = {};
    expect(isHttpResponseSuccess(err)).to.equal(false);
  });

});

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

describe('isHttpResponseOK', () => {

  it('should return true if the given object is an instance of HttpResponseOK.', () => {
    const err = new HttpResponseOK();
    expect(isHttpResponseOK(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseOK property equal to true.', () => {
    const err = { isHttpResponseOK: true };
    expect(isHttpResponseOK(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseOK and if it '
      + 'has no property isHttpResponseOK.', () => {
    const err = {};
    expect(isHttpResponseOK(err)).to.equal(false);
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

describe('isHttpResponseCreated', () => {

  it('should return true if the given object is an instance of HttpResponseCreated.', () => {
    const err = new HttpResponseCreated();
    expect(isHttpResponseCreated(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseCreated property equal to true.', () => {
    const err = { isHttpResponseCreated: true };
    expect(isHttpResponseCreated(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseCreated and if it '
      + 'has no property isHttpResponseCreated.', () => {
    const err = {};
    expect(isHttpResponseCreated(err)).to.equal(false);
  });

});

describe('HttpResponseNoContent', () => {

  it('should inherit from HttpResponseSuccess and HttpResponse', () => {
    const httpResponse = new HttpResponseNoContent();
    expect(httpResponse).to.be.an.instanceOf(HttpResponse);
    expect(httpResponse).to.be.an.instanceOf(HttpResponseSuccess);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseNoContent();
    expect(httpResponse.statusCode).to.equal(204);
    expect(httpResponse.statusMessage).to.equal('NO CONTENT');
  });

});

describe('isHttpResponseNoContent', () => {

  it('should return true if the given object is an instance of HttpResponseNoContent.', () => {
    const err = new HttpResponseNoContent();
    expect(isHttpResponseNoContent(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseNoContent property equal to true.', () => {
    const err = { isHttpResponseNoContent: true };
    expect(isHttpResponseNoContent(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseNoContent and if it '
      + 'has no property isHttpResponseNoContent.', () => {
    const err = {};
    expect(isHttpResponseNoContent(err)).to.equal(false);
  });

});

describe('isHttpResponseRedirection', () => {

  it('should return true if the given object is an instance of HttpResponseRedirection.', () => {
    const err = new HttpResponseRedirect('/foo');
    expect(isHttpResponseRedirection(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseRedirection property equal to true.', () => {
    const err = { isHttpResponseRedirection: true };
    expect(isHttpResponseRedirection(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseRedirection and if it '
      + 'has no property isHttpResponseRedirection.', () => {
    const err = {};
    expect(isHttpResponseRedirection(err)).to.equal(false);
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

describe('isHttpResponseRedirect', () => {

  it('should return true if the given object is an instance of HttpResponseRedirect.', () => {
    const err = new HttpResponseRedirect('/foo');
    expect(isHttpResponseRedirect(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseRedirect property equal to true.', () => {
    const err = { isHttpResponseRedirect: true };
    expect(isHttpResponseRedirect(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseRedirect and if it '
      + 'has no property isHttpResponseRedirect.', () => {
    const err = {};
    expect(isHttpResponseRedirect(err)).to.equal(false);
  });

});

describe('isHttpResponseClientError', () => {

  it('should return true if the given object is an instance of HttpResponseClientError.', () => {
    const err = new HttpResponseBadRequest();
    expect(isHttpResponseClientError(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseClientError property equal to true.', () => {
    const err = { isHttpResponseClientError: true };
    expect(isHttpResponseClientError(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseClientError and if it '
      + 'has no property isHttpResponseClientError.', () => {
    const err = {};
    expect(isHttpResponseClientError(err)).to.equal(false);
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

describe('isHttpResponseBadRequest', () => {

  it('should return true if the given object is an instance of HttpResponseBadRequest.', () => {
    const err = new HttpResponseBadRequest();
    expect(isHttpResponseBadRequest(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseBadRequest property equal to true.', () => {
    const err = { isHttpResponseBadRequest: true };
    expect(isHttpResponseBadRequest(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseBadRequest and if it '
      + 'has no property isHttpResponseBadRequest.', () => {
    const err = {};
    expect(isHttpResponseBadRequest(err)).to.equal(false);
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

describe('isHttpResponseUnauthorized', () => {

  it('should return true if the given object is an instance of HttpResponseUnauthorized.', () => {
    const err = new HttpResponseUnauthorized();
    expect(isHttpResponseUnauthorized(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseUnauthorized property equal to true.', () => {
    const err = { isHttpResponseUnauthorized: true };
    expect(isHttpResponseUnauthorized(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseUnauthorized and if it '
      + 'has no property isHttpResponseUnauthorized.', () => {
    const err = {};
    expect(isHttpResponseUnauthorized(err)).to.equal(false);
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

describe('isHttpResponseForbidden', () => {

  it('should return true if the given object is an instance of HttpResponseForbidden.', () => {
    const err = new HttpResponseForbidden();
    expect(isHttpResponseForbidden(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseForbidden property equal to true.', () => {
    const err = { isHttpResponseForbidden: true };
    expect(isHttpResponseForbidden(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseForbidden and if it '
      + 'has no property isHttpResponseForbidden.', () => {
    const err = {};
    expect(isHttpResponseForbidden(err)).to.equal(false);
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

describe('isHttpResponseNotFound', () => {

  it('should return true if the given object is an instance of HttpResponseNotFound.', () => {
    const err = new HttpResponseNotFound();
    expect(isHttpResponseNotFound(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseNotFound property equal to true.', () => {
    const err = { isHttpResponseNotFound: true };
    expect(isHttpResponseNotFound(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseNotFound and if it '
      + 'has no property isHttpResponseNotFound.', () => {
    const err = {};
    expect(isHttpResponseNotFound(err)).to.equal(false);
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

describe('isHttpResponseMethodNotAllowed', () => {

  it('should return true if the given object is an instance of HttpResponseMethodNotAllowed.', () => {
    const err = new HttpResponseMethodNotAllowed();
    expect(isHttpResponseMethodNotAllowed(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseMethodNotAllowed property equal to true.', () => {
    const err = { isHttpResponseMethodNotAllowed: true };
    expect(isHttpResponseMethodNotAllowed(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseMethodNotAllowed and if it '
      + 'has no property isHttpResponseMethodNotAllowed.', () => {
    const err = {};
    expect(isHttpResponseMethodNotAllowed(err)).to.equal(false);
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

describe('isHttpResponseConflict', () => {

  it('should return true if the given object is an instance of HttpResponseConflict.', () => {
    const err = new HttpResponseConflict();
    expect(isHttpResponseConflict(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseConflict property equal to true.', () => {
    const err = { isHttpResponseConflict: true };
    expect(isHttpResponseConflict(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseConflict and if it '
      + 'has no property isHttpResponseConflict.', () => {
    const err = {};
    expect(isHttpResponseConflict(err)).to.equal(false);
  });

});

describe('isHttpResponseServerError', () => {

  it('should return true if the given object is an instance of HttpResponseServerError.', () => {
    const err = new HttpResponseInternalServerError();
    expect(isHttpResponseServerError(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseServerError property equal to true.', () => {
    const err = { isHttpResponseServerError: true };
    expect(isHttpResponseServerError(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseServerError and if it '
      + 'has no property isHttpResponseServerError.', () => {
    const err = {};
    expect(isHttpResponseServerError(err)).to.equal(false);
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

describe('isHttpResponseInternalServerError', () => {

  it('should return true if the given object is an instance of HttpResponseInternalServerError.', () => {
    const err = new HttpResponseInternalServerError();
    expect(isHttpResponseInternalServerError(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseInternalServerError property equal to true.', () => {
    const err = { isHttpResponseInternalServerError: true };
    expect(isHttpResponseInternalServerError(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseInternalServerError and if it '
      + 'has no property isHttpResponseInternalServerError.', () => {
    const err = {};
    expect(isHttpResponseInternalServerError(err)).to.equal(false);
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

describe('isHttpResponseNotImplemented', () => {

  it('should return true if the given object is an instance of HttpResponseNotImplemented.', () => {
    const err = new HttpResponseNotImplemented();
    expect(isHttpResponseNotImplemented(err)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseNotImplemented property equal to true.', () => {
    const err = { isHttpResponseNotImplemented: true };
    expect(isHttpResponseNotImplemented(err)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseNotImplemented and if it '
      + 'has no property isHttpResponseNotImplemented.', () => {
    const err = {};
    expect(isHttpResponseNotImplemented(err)).to.equal(false);
  });

});
