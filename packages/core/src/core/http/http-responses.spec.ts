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

describe('HttpResponse', () => {

  it('should have a headers properties.', () => {
    class ConcreteClass extends HttpResponse {
      statusMessage = 'foo';
      statusCode = 0;
    }
    const response = new ConcreteClass();
    expect(response.headers).to.deep.equal({});
  });

});

describe('isHttpResponse', () => {

  it('should return true if the given object is an instance of HttpResponse.', () => {
    const response = new HttpResponseCreated();
    expect(isHttpResponse(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponse property equal to true.', () => {
    const response = { isHttpResponse: true };
    expect(isHttpResponse(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponse and if it '
      + 'has no property isHttpResponse.', () => {
    const response = {};
    expect(isHttpResponse(response)).to.equal(false);
    expect(isHttpResponse(undefined)).to.equal(false);
    expect(isHttpResponse(null)).to.equal(false);
  });

});

describe('isHttpResponseSuccess', () => {

  it('should return true if the given object is an instance of HttpResponseSuccess.', () => {
    const response = new HttpResponseCreated();
    expect(isHttpResponseSuccess(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseSuccess property equal to true.', () => {
    const response = { isHttpResponseSuccess: true };
    expect(isHttpResponseSuccess(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseSuccess and if it '
      + 'has no property isHttpResponseSuccess.', () => {
    const response = {};
    expect(isHttpResponseSuccess(response)).to.equal(false);
    expect(isHttpResponseSuccess(undefined)).to.equal(false);
    expect(isHttpResponseSuccess(null)).to.equal(false);
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
    const response = new HttpResponseOK();
    expect(isHttpResponseOK(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseOK property equal to true.', () => {
    const response = { isHttpResponseOK: true };
    expect(isHttpResponseOK(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseOK and if it '
      + 'has no property isHttpResponseOK.', () => {
    const response = {};
    expect(isHttpResponseOK(response)).to.equal(false);
    expect(isHttpResponseOK(undefined)).to.equal(false);
    expect(isHttpResponseOK(null)).to.equal(false);
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
    const response = new HttpResponseCreated();
    expect(isHttpResponseCreated(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseCreated property equal to true.', () => {
    const response = { isHttpResponseCreated: true };
    expect(isHttpResponseCreated(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseCreated and if it '
      + 'has no property isHttpResponseCreated.', () => {
    const response = {};
    expect(isHttpResponseCreated(response)).to.equal(false);
    expect(isHttpResponseCreated(undefined)).to.equal(false);
    expect(isHttpResponseCreated(null)).to.equal(false);
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
    const response = new HttpResponseNoContent();
    expect(isHttpResponseNoContent(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseNoContent property equal to true.', () => {
    const response = { isHttpResponseNoContent: true };
    expect(isHttpResponseNoContent(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseNoContent and if it '
      + 'has no property isHttpResponseNoContent.', () => {
    const response = {};
    expect(isHttpResponseNoContent(response)).to.equal(false);
    expect(isHttpResponseNoContent(undefined)).to.equal(false);
    expect(isHttpResponseNoContent(null)).to.equal(false);
  });

});

describe('isHttpResponseRedirection', () => {

  it('should return true if the given object is an instance of HttpResponseRedirection.', () => {
    const response = new HttpResponseRedirect('/foo');
    expect(isHttpResponseRedirection(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseRedirection property equal to true.', () => {
    const response = { isHttpResponseRedirection: true };
    expect(isHttpResponseRedirection(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseRedirection and if it '
      + 'has no property isHttpResponseRedirection.', () => {
    const response = {};
    expect(isHttpResponseRedirection(response)).to.equal(false);
    expect(isHttpResponseRedirection(undefined)).to.equal(false);
    expect(isHttpResponseRedirection(null)).to.equal(false);
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
    const response = new HttpResponseRedirect('/foo');
    expect(isHttpResponseRedirect(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseRedirect property equal to true.', () => {
    const response = { isHttpResponseRedirect: true };
    expect(isHttpResponseRedirect(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseRedirect and if it '
      + 'has no property isHttpResponseRedirect.', () => {
    const response = {};
    expect(isHttpResponseRedirect(response)).to.equal(false);
    expect(isHttpResponseRedirect(undefined)).to.equal(false);
    expect(isHttpResponseRedirect(null)).to.equal(false);
  });

});

describe('isHttpResponseClientError', () => {

  it('should return true if the given object is an instance of HttpResponseClientError.', () => {
    const response = new HttpResponseBadRequest();
    expect(isHttpResponseClientError(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseClientError property equal to true.', () => {
    const response = { isHttpResponseClientError: true };
    expect(isHttpResponseClientError(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseClientError and if it '
      + 'has no property isHttpResponseClientError.', () => {
    const response = {};
    expect(isHttpResponseClientError(response)).to.equal(false);
    expect(isHttpResponseClientError(undefined)).to.equal(false);
    expect(isHttpResponseClientError(null)).to.equal(false);
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
    const response = new HttpResponseBadRequest();
    expect(isHttpResponseBadRequest(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseBadRequest property equal to true.', () => {
    const response = { isHttpResponseBadRequest: true };
    expect(isHttpResponseBadRequest(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseBadRequest and if it '
      + 'has no property isHttpResponseBadRequest.', () => {
    const response = {};
    expect(isHttpResponseBadRequest(response)).to.equal(false);
    expect(isHttpResponseBadRequest(undefined)).to.equal(false);
    expect(isHttpResponseBadRequest(null)).to.equal(false);
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
    const response = new HttpResponseUnauthorized();
    expect(isHttpResponseUnauthorized(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseUnauthorized property equal to true.', () => {
    const response = { isHttpResponseUnauthorized: true };
    expect(isHttpResponseUnauthorized(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseUnauthorized and if it '
      + 'has no property isHttpResponseUnauthorized.', () => {
    const response = {};
    expect(isHttpResponseUnauthorized(response)).to.equal(false);
    expect(isHttpResponseUnauthorized(undefined)).to.equal(false);
    expect(isHttpResponseUnauthorized(null)).to.equal(false);
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
    const response = new HttpResponseForbidden();
    expect(isHttpResponseForbidden(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseForbidden property equal to true.', () => {
    const response = { isHttpResponseForbidden: true };
    expect(isHttpResponseForbidden(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseForbidden and if it '
      + 'has no property isHttpResponseForbidden.', () => {
    const response = {};
    expect(isHttpResponseForbidden(response)).to.equal(false);
    expect(isHttpResponseForbidden(undefined)).to.equal(false);
    expect(isHttpResponseForbidden(null)).to.equal(false);
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
    const response = new HttpResponseNotFound();
    expect(isHttpResponseNotFound(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseNotFound property equal to true.', () => {
    const response = { isHttpResponseNotFound: true };
    expect(isHttpResponseNotFound(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseNotFound and if it '
      + 'has no property isHttpResponseNotFound.', () => {
    const response = {};
    expect(isHttpResponseNotFound(response)).to.equal(false);
    expect(isHttpResponseNotFound(undefined)).to.equal(false);
    expect(isHttpResponseNotFound(null)).to.equal(false);
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
    const response = new HttpResponseMethodNotAllowed();
    expect(isHttpResponseMethodNotAllowed(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseMethodNotAllowed property equal to true.', () => {
    const response = { isHttpResponseMethodNotAllowed: true };
    expect(isHttpResponseMethodNotAllowed(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseMethodNotAllowed and if it '
      + 'has no property isHttpResponseMethodNotAllowed.', () => {
    const response = {};
    expect(isHttpResponseMethodNotAllowed(response)).to.equal(false);
    expect(isHttpResponseMethodNotAllowed(undefined)).to.equal(false);
    expect(isHttpResponseMethodNotAllowed(null)).to.equal(false);
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
    const response = new HttpResponseConflict();
    expect(isHttpResponseConflict(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseConflict property equal to true.', () => {
    const response = { isHttpResponseConflict: true };
    expect(isHttpResponseConflict(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseConflict and if it '
      + 'has no property isHttpResponseConflict.', () => {
    const response = {};
    expect(isHttpResponseConflict(response)).to.equal(false);
    expect(isHttpResponseConflict(undefined)).to.equal(false);
    expect(isHttpResponseConflict(null)).to.equal(false);
  });

});

describe('isHttpResponseServerError', () => {

  it('should return true if the given object is an instance of HttpResponseServerError.', () => {
    const response = new HttpResponseInternalServerError();
    expect(isHttpResponseServerError(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseServerError property equal to true.', () => {
    const response = { isHttpResponseServerError: true };
    expect(isHttpResponseServerError(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseServerError and if it '
      + 'has no property isHttpResponseServerError.', () => {
    const response = {};
    expect(isHttpResponseServerError(response)).to.equal(false);
    expect(isHttpResponseServerError(undefined)).to.equal(false);
    expect(isHttpResponseServerError(null)).to.equal(false);
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
    const response = new HttpResponseInternalServerError();
    expect(isHttpResponseInternalServerError(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseInternalServerError property equal to true.', () => {
    const response = { isHttpResponseInternalServerError: true };
    expect(isHttpResponseInternalServerError(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseInternalServerError and if it '
      + 'has no property isHttpResponseInternalServerError.', () => {
    const response = {};
    expect(isHttpResponseInternalServerError(response)).to.equal(false);
    expect(isHttpResponseInternalServerError(undefined)).to.equal(false);
    expect(isHttpResponseInternalServerError(null)).to.equal(false);
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
    const response = new HttpResponseNotImplemented();
    expect(isHttpResponseNotImplemented(response)).to.equal(true);
  });

  it('should return true if the given object has an isHttpResponseNotImplemented property equal to true.', () => {
    const response = { isHttpResponseNotImplemented: true };
    expect(isHttpResponseNotImplemented(response)).to.equal(true);
  });

  it('should return false if the given object is not an instance of HttpResponseNotImplemented and if it '
      + 'has no property isHttpResponseNotImplemented.', () => {
    const response = {};
    expect(isHttpResponseNotImplemented(response)).to.equal(false);
    expect(isHttpResponseNotImplemented(undefined)).to.equal(false);
    expect(isHttpResponseNotImplemented(null)).to.equal(false);
  });

});
