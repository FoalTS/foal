// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';
import { Context } from './context';

// FoalTS
import {
  HttpResponse,
  HttpResponseBadRequest,
  HttpResponseClientError,
  HttpResponseConflict,
  HttpResponseCreated,
  HttpResponseForbidden,
  HttpResponseInternalServerError,
  HttpResponseMethodNotAllowed,
  HttpResponseMovedPermanently,
  HttpResponseNoContent,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
  HttpResponseRedirect,
  HttpResponseRedirection,
  HttpResponseServerError,
  HttpResponseSuccess,
  HttpResponseTooManyRequests,
  HttpResponseUnauthorized,
  isHttpResponse,
  isHttpResponseBadRequest,
  isHttpResponseClientError,
  isHttpResponseConflict,
  isHttpResponseCreated,
  isHttpResponseForbidden,
  isHttpResponseInternalServerError,
  isHttpResponseMethodNotAllowed,
  isHttpResponseMovedPermanently,
  isHttpResponseNoContent,
  isHttpResponseNotFound,
  isHttpResponseNotImplemented,
  isHttpResponseOK,
  isHttpResponseRedirect,
  isHttpResponseRedirection,
  isHttpResponseServerError,
  isHttpResponseSuccess,
  isHttpResponseTooManyRequests,
  isHttpResponseUnauthorized
} from './http-responses';

describe('HttpResponse', () => {

  class ConcreteClass extends HttpResponse {
    statusMessage = 'foo';
    statusCode = 0;
  }
  let response: ConcreteClass;

  beforeEach(() => response = new ConcreteClass());

  it('when setHeader is called should return the HttpResponse instance.', () => {
    strictEqual(response.setHeader('my_header', 'header_value'), response);
  });

  it('when setHeader and getHeader are called should set and get custom headers.', () => {
    response.setHeader('my_header', 'header_value');
    strictEqual(response.getHeader('my_header'), 'header_value');
    strictEqual(response.getHeader('my_header2'), undefined);
  });

  it('when getHeaders is called should return a copy of the headers.', () => {
    response.setHeader('my_header1', 'header_value1');
    response.setHeader('my_header2', 'header_value2');
    const actual1 = response.getHeaders();
    const actual2 = response.getHeaders();
    deepStrictEqual(actual1, {
      my_header1: 'header_value1',
      my_header2: 'header_value2'
    });
    notStrictEqual(actual1, actual2);
  });

  it('when setCookie is called should return the HttpResponse instance.', () => {
    strictEqual(response.setCookie('my_header', 'header_value'), response);
  });

  it('when setCookie and getCookie are called should set and get custom cookies.', () => {
    response.setCookie('my_cookie', 'cookie_value');
    const options = { domain: 'foalts.org' };
    response.setCookie('my_cookie2', 'cookie_value2', options);

    const cookie = response.getCookie('my_cookie');
    strictEqual(cookie.value, 'cookie_value');
    deepStrictEqual(cookie.options, {});

    const cookie2  = response.getCookie('my_cookie2');
    strictEqual(cookie2.value, 'cookie_value2');
    deepStrictEqual(cookie2.options, options);
    notStrictEqual(cookie2.options, options);

    const cookie3  = response.getCookie('my_cookie3');
    strictEqual(cookie3.value, undefined);
    deepStrictEqual(cookie3.options, {});
  });

  it('when getCookies is called should return a deep copy of the cookies.', () => {
    response.setCookie('my_cookie1', 'cookie_value1');
    const options = { domain: 'foalts.org' };
    response.setCookie('my_cookie2', 'cookie_value2', options);

    const actual1 = response.getCookies();
    const actual2 = response.getCookies();
    deepStrictEqual(actual1, {
      my_cookie1: { value: 'cookie_value1', options: {} },
      my_cookie2: { value: 'cookie_value2', options }
    });
    notStrictEqual(actual1, actual2);
    notStrictEqual(actual1.my_cookie1, actual2.my_cookie1);
    notStrictEqual(actual1.my_cookie2.options, actual2.my_cookie2.options);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponse<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponse', () => {

  it('should return true if the given object is an instance of HttpResponse.', () => {
    const response = new HttpResponseCreated();
    strictEqual(isHttpResponse(response), true);
  });

  it('should return true if the given object has an isHttpResponse property equal to true.', () => {
    const response = { isHttpResponse: true };
    strictEqual(isHttpResponse(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponse and if it '
      + 'has no property isHttpResponse.', () => {
    const response = {};
    strictEqual(isHttpResponse(response), false);
    strictEqual(isHttpResponse(undefined), false);
    strictEqual(isHttpResponse(null), false);
  });

});

describe('isHttpResponseSuccess', () => {

  it('should return true if the given object is an instance of HttpResponseSuccess.', () => {
    const response = new HttpResponseCreated();
    strictEqual(isHttpResponseSuccess(response), true);
  });

  it('should return true if the given object has an isHttpResponseSuccess property equal to true.', () => {
    const response = { isHttpResponseSuccess: true };
    strictEqual(isHttpResponseSuccess(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseSuccess and if it '
      + 'has no property isHttpResponseSuccess.', () => {
    const response = {};
    strictEqual(isHttpResponseSuccess(response), false);
    strictEqual(isHttpResponseSuccess(undefined), false);
    strictEqual(isHttpResponseSuccess(null), false);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponse<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('HttpResponseOK', () => {

  it('should inherit from HttpResponseSuccess and HttpResponse', () => {
    const httpResponse = new HttpResponseOK();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseSuccess);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseOK();
    strictEqual(httpResponse.statusCode, 200);
    strictEqual(httpResponse.statusMessage, 'OK');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseOK();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseOK(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseOK();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseOK({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseOK<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseOK', () => {

  it('should return true if the given object is an instance of HttpResponseOK.', () => {
    const response = new HttpResponseOK();
    strictEqual(isHttpResponseOK(response), true);
  });

  it('should return true if the given object has an isHttpResponseOK property equal to true.', () => {
    const response = { isHttpResponseOK: true };
    strictEqual(isHttpResponseOK(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseOK and if it '
      + 'has no property isHttpResponseOK.', () => {
    const response = {};
    strictEqual(isHttpResponseOK(response), false);
    strictEqual(isHttpResponseOK(undefined), false);
    strictEqual(isHttpResponseOK(null), false);
  });

});

describe('HttpResponseCreated', () => {

  it('should inherit from HttpResponseSuccess and HttpResponse', () => {
    const httpResponse = new HttpResponseCreated();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseSuccess);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseCreated();
    strictEqual(httpResponse.statusCode, 201);
    strictEqual(httpResponse.statusMessage, 'CREATED');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseCreated();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseCreated(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseCreated();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseCreated({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseCreated<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseCreated', () => {

  it('should return true if the given object is an instance of HttpResponseCreated.', () => {
    const response = new HttpResponseCreated();
    strictEqual(isHttpResponseCreated(response), true);
  });

  it('should return true if the given object has an isHttpResponseCreated property equal to true.', () => {
    const response = { isHttpResponseCreated: true };
    strictEqual(isHttpResponseCreated(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseCreated and if it '
      + 'has no property isHttpResponseCreated.', () => {
    const response = {};
    strictEqual(isHttpResponseCreated(response), false);
    strictEqual(isHttpResponseCreated(undefined), false);
    strictEqual(isHttpResponseCreated(null), false);
  });

});

describe('HttpResponseNoContent', () => {

  it('should inherit from HttpResponseSuccess and HttpResponse', () => {
    const httpResponse = new HttpResponseNoContent();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseSuccess);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseNoContent();
    strictEqual(httpResponse.statusCode, 204);
    strictEqual(httpResponse.statusMessage, 'NO CONTENT');
  });

});

describe('isHttpResponseNoContent', () => {

  it('should return true if the given object is an instance of HttpResponseNoContent.', () => {
    const response = new HttpResponseNoContent();
    strictEqual(isHttpResponseNoContent(response), true);
  });

  it('should return true if the given object has an isHttpResponseNoContent property equal to true.', () => {
    const response = { isHttpResponseNoContent: true };
    strictEqual(isHttpResponseNoContent(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseNoContent and if it '
      + 'has no property isHttpResponseNoContent.', () => {
    const response = {};
    strictEqual(isHttpResponseNoContent(response), false);
    strictEqual(isHttpResponseNoContent(undefined), false);
    strictEqual(isHttpResponseNoContent(null), false);
  });

});

describe('isHttpResponseRedirection', () => {

  it('should return true if the given object is an instance of HttpResponseRedirection.', () => {
    const response = new HttpResponseRedirect('/foo');
    strictEqual(isHttpResponseRedirection(response), true);
  });

  it('should return true if the given object has an isHttpResponseRedirection property equal to true.', () => {
    const response = { isHttpResponseRedirection: true };
    strictEqual(isHttpResponseRedirection(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseRedirection and if it '
      + 'has no property isHttpResponseRedirection.', () => {
    const response = {};
    strictEqual(isHttpResponseRedirection(response), false);
    strictEqual(isHttpResponseRedirection(undefined), false);
    strictEqual(isHttpResponseRedirection(null), false);
  });

});

describe('HttpResponseMovedPermanently', () => {

  it('should inherit from HttpResponseRedirection and HttpResponse', () => {
    const httpResponse = new HttpResponseMovedPermanently('/foo');
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseRedirection);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseMovedPermanently('/foo');
    strictEqual(httpResponse.statusCode, 301);
    strictEqual(httpResponse.statusMessage, 'MOVED PERMANENTLY');
  });

  it('should accept a mandatory path.', () => {
    const httpResponse = new HttpResponseMovedPermanently('/foo');
    strictEqual(httpResponse.path, '/foo');
    strictEqual(httpResponse.body, undefined);
  });

});

describe('isHttpResponseMovedPermanently', () => {

  it('should return true if the given object is an instance of HttpResponseMovedPermanently.', () => {
    const response = new HttpResponseMovedPermanently('/foo');
    strictEqual(isHttpResponseMovedPermanently(response), true);
  });

  it('should return true if the given object has an isHttpResponseMovedPermanently property equal to true.', () => {
    const response = { isHttpResponseMovedPermanently: true };
    strictEqual(isHttpResponseMovedPermanently(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseMovedPermanently and if it '
      + 'has no property isHttpResponseMovedPermanently.', () => {
    const response = {};
    strictEqual(isHttpResponseMovedPermanently(response), false);
    strictEqual(isHttpResponseMovedPermanently(undefined), false);
    strictEqual(isHttpResponseMovedPermanently(null), false);
  });

});

describe('HttpResponseRedirect', () => {

  it('should inherit from HttpResponseRedirection and HttpResponse', () => {
    const httpResponse = new HttpResponseRedirect('/foo');
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseRedirection);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseRedirect('/foo');
    strictEqual(httpResponse.statusCode, 302);
    strictEqual(httpResponse.statusMessage, 'FOUND');
  });

  it('should accept a mandatory path and an optional body.', () => {
    let httpResponse = new HttpResponseRedirect('/foo');
    strictEqual(httpResponse.path, '/foo');
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseRedirect('/foo', body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseRedirect('/foo');
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseRedirect('/foo', {}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseRedirect<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseRedirect', () => {

  it('should return true if the given object is an instance of HttpResponseRedirect.', () => {
    const response = new HttpResponseRedirect('/foo');
    strictEqual(isHttpResponseRedirect(response), true);
  });

  it('should return true if the given object has an isHttpResponseRedirect property equal to true.', () => {
    const response = { isHttpResponseRedirect: true };
    strictEqual(isHttpResponseRedirect(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseRedirect and if it '
      + 'has no property isHttpResponseRedirect.', () => {
    const response = {};
    strictEqual(isHttpResponseRedirect(response), false);
    strictEqual(isHttpResponseRedirect(undefined), false);
    strictEqual(isHttpResponseRedirect(null), false);
  });

});

describe('isHttpResponseClientError', () => {

  it('should return true if the given object is an instance of HttpResponseClientError.', () => {
    const response = new HttpResponseBadRequest();
    strictEqual(isHttpResponseClientError(response), true);
  });

  it('should return true if the given object has an isHttpResponseClientError property equal to true.', () => {
    const response = { isHttpResponseClientError: true };
    strictEqual(isHttpResponseClientError(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseClientError and if it '
      + 'has no property isHttpResponseClientError.', () => {
    const response = {};
    strictEqual(isHttpResponseClientError(response), false);
    strictEqual(isHttpResponseClientError(undefined), false);
    strictEqual(isHttpResponseClientError(null), false);
  });

});

describe('HttpResponseBadRequest', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseBadRequest();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseBadRequest();
    strictEqual(httpResponse.statusCode, 400);
    strictEqual(httpResponse.statusMessage, 'BAD REQUEST');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseBadRequest();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseBadRequest(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseBadRequest();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseBadRequest({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseBadRequest<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseBadRequest', () => {

  it('should return true if the given object is an instance of HttpResponseBadRequest.', () => {
    const response = new HttpResponseBadRequest();
    strictEqual(isHttpResponseBadRequest(response), true);
  });

  it('should return true if the given object has an isHttpResponseBadRequest property equal to true.', () => {
    const response = { isHttpResponseBadRequest: true };
    strictEqual(isHttpResponseBadRequest(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseBadRequest and if it '
      + 'has no property isHttpResponseBadRequest.', () => {
    const response = {};
    strictEqual(isHttpResponseBadRequest(response), false);
    strictEqual(isHttpResponseBadRequest(undefined), false);
    strictEqual(isHttpResponseBadRequest(null), false);
  });

});

describe('HttpResponseUnauthorized', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseUnauthorized();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseUnauthorized();
    strictEqual(httpResponse.statusCode, 401);
    strictEqual(httpResponse.statusMessage, 'UNAUTHORIZED');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseUnauthorized();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseUnauthorized(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseUnauthorized();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseUnauthorized({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseUnauthorized<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseUnauthorized', () => {

  it('should return true if the given object is an instance of HttpResponseUnauthorized.', () => {
    const response = new HttpResponseUnauthorized();
    strictEqual(isHttpResponseUnauthorized(response), true);
  });

  it('should return true if the given object has an isHttpResponseUnauthorized property equal to true.', () => {
    const response = { isHttpResponseUnauthorized: true };
    strictEqual(isHttpResponseUnauthorized(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseUnauthorized and if it '
      + 'has no property isHttpResponseUnauthorized.', () => {
    const response = {};
    strictEqual(isHttpResponseUnauthorized(response), false);
    strictEqual(isHttpResponseUnauthorized(undefined), false);
    strictEqual(isHttpResponseUnauthorized(null), false);
  });

});

describe('HttpResponseForbidden', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseForbidden();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseForbidden();
    strictEqual(httpResponse.statusCode, 403);
    strictEqual(httpResponse.statusMessage, 'FORBIDDEN');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseForbidden();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseForbidden(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseForbidden();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseForbidden({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseForbidden<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseForbidden', () => {

  it('should return true if the given object is an instance of HttpResponseForbidden.', () => {
    const response = new HttpResponseForbidden();
    strictEqual(isHttpResponseForbidden(response), true);
  });

  it('should return true if the given object has an isHttpResponseForbidden property equal to true.', () => {
    const response = { isHttpResponseForbidden: true };
    strictEqual(isHttpResponseForbidden(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseForbidden and if it '
      + 'has no property isHttpResponseForbidden.', () => {
    const response = {};
    strictEqual(isHttpResponseForbidden(response), false);
    strictEqual(isHttpResponseForbidden(undefined), false);
    strictEqual(isHttpResponseForbidden(null), false);
  });

});

describe('HttpResponseNotFound', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseNotFound();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseNotFound();
    strictEqual(httpResponse.statusCode, 404);
    strictEqual(httpResponse.statusMessage, 'NOT FOUND');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseNotFound();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseNotFound(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseNotFound();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseNotFound({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseNotFound<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseNotFound', () => {

  it('should return true if the given object is an instance of HttpResponseNotFound.', () => {
    const response = new HttpResponseNotFound();
    strictEqual(isHttpResponseNotFound(response), true);
  });

  it('should return true if the given object has an isHttpResponseNotFound property equal to true.', () => {
    const response = { isHttpResponseNotFound: true };
    strictEqual(isHttpResponseNotFound(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseNotFound and if it '
      + 'has no property isHttpResponseNotFound.', () => {
    const response = {};
    strictEqual(isHttpResponseNotFound(response), false);
    strictEqual(isHttpResponseNotFound(undefined), false);
    strictEqual(isHttpResponseNotFound(null), false);
  });

});

describe('HttpResponseMethodNotAllowed', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseMethodNotAllowed();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseMethodNotAllowed();
    strictEqual(httpResponse.statusCode, 405);
    strictEqual(httpResponse.statusMessage, 'METHOD NOT ALLOWED');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseMethodNotAllowed();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseMethodNotAllowed(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseMethodNotAllowed();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseMethodNotAllowed({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseMethodNotAllowed<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseMethodNotAllowed', () => {

  it('should return true if the given object is an instance of HttpResponseMethodNotAllowed.', () => {
    const response = new HttpResponseMethodNotAllowed();
    strictEqual(isHttpResponseMethodNotAllowed(response), true);
  });

  it('should return true if the given object has an isHttpResponseMethodNotAllowed property equal to true.', () => {
    const response = { isHttpResponseMethodNotAllowed: true };
    strictEqual(isHttpResponseMethodNotAllowed(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseMethodNotAllowed and if it '
      + 'has no property isHttpResponseMethodNotAllowed.', () => {
    const response = {};
    strictEqual(isHttpResponseMethodNotAllowed(response), false);
    strictEqual(isHttpResponseMethodNotAllowed(undefined), false);
    strictEqual(isHttpResponseMethodNotAllowed(null), false);
  });

});

describe('HttpResponseConflict', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseConflict();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseConflict();
    strictEqual(httpResponse.statusCode, 409);
    strictEqual(httpResponse.statusMessage, 'CONFLICT');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseConflict();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseConflict(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseConflict();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseConflict({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseConflict<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseConflict', () => {

  it('should return true if the given object is an instance of HttpResponseConflict.', () => {
    const response = new HttpResponseConflict();
    strictEqual(isHttpResponseConflict(response), true);
  });

  it('should return true if the given object has an isHttpResponseConflict property equal to true.', () => {
    const response = { isHttpResponseConflict: true };
    strictEqual(isHttpResponseConflict(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseConflict and if it '
      + 'has no property isHttpResponseConflict.', () => {
    const response = {};
    strictEqual(isHttpResponseConflict(response), false);
    strictEqual(isHttpResponseConflict(undefined), false);
    strictEqual(isHttpResponseConflict(null), false);
  });

});

describe('HttpResponseTooManyRequests', () => {

  it('should inherit from HttpResponseClientError and HttpResponse', () => {
    const httpResponse = new HttpResponseTooManyRequests();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseClientError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseTooManyRequests();
    strictEqual(httpResponse.statusCode, 429);
    strictEqual(httpResponse.statusMessage, 'TOO MANY REQUESTS');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseTooManyRequests();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseTooManyRequests(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseTooManyRequests();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseTooManyRequests({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseTooManyRequests<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseTooManyRequests', () => {

  it('should return true if the given object is an instance of HttpResponseTooManyRequests.', () => {
    const response = new HttpResponseTooManyRequests();
    strictEqual(isHttpResponseTooManyRequests(response), true);
  });

  it('should return true if the given object has an isHttpResponseTooManyRequests property equal to true.', () => {
    const response = { isHttpResponseTooManyRequests: true };
    strictEqual(isHttpResponseTooManyRequests(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseTooManyRequests and if it '
      + 'has no property isHttpResponseTooManyRequests.', () => {
    const response = {};
    strictEqual(isHttpResponseTooManyRequests(response), false);
    strictEqual(isHttpResponseTooManyRequests(undefined), false);
    strictEqual(isHttpResponseTooManyRequests(null), false);
  });

});

describe('isHttpResponseServerError', () => {

  it('should return true if the given object is an instance of HttpResponseServerError.', () => {
    const response = new HttpResponseInternalServerError();
    strictEqual(isHttpResponseServerError(response), true);
  });

  it('should return true if the given object has an isHttpResponseServerError property equal to true.', () => {
    const response = { isHttpResponseServerError: true };
    strictEqual(isHttpResponseServerError(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseServerError and if it '
      + 'has no property isHttpResponseServerError.', () => {
    const response = {};
    strictEqual(isHttpResponseServerError(response), false);
    strictEqual(isHttpResponseServerError(undefined), false);
    strictEqual(isHttpResponseServerError(null), false);
  });

});

describe('HttpResponseInternalServerError', () => {

  it('should inherit from HttpResponseServerError and HttpResponse', () => {
    const httpResponse = new HttpResponseInternalServerError();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseServerError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseInternalServerError();
    strictEqual(httpResponse.statusCode, 500);
    strictEqual(httpResponse.statusMessage, 'INTERNAL SERVER ERROR');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseInternalServerError();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseInternalServerError(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseInternalServerError();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseInternalServerError({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should accept an optional "error" option.', () => {
    let httpResponse = new HttpResponseInternalServerError();
    strictEqual(httpResponse.error, undefined);

    const error = new Error('A random error.');
    httpResponse = new HttpResponseInternalServerError({}, { error });
    strictEqual(httpResponse.error, error);
  });

  it('should accept an optional "ctx" option.', () => {
    let httpResponse = new HttpResponseInternalServerError();
    strictEqual(httpResponse.ctx, undefined);

    const ctx = new Context({});
    httpResponse = new HttpResponseInternalServerError({}, { ctx });
    strictEqual(httpResponse.ctx, ctx);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseInternalServerError<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseInternalServerError', () => {

  it('should return true if the given object is an instance of HttpResponseInternalServerError.', () => {
    const response = new HttpResponseInternalServerError();
    strictEqual(isHttpResponseInternalServerError(response), true);
  });

  it('should return true if the given object has an isHttpResponseInternalServerError property equal to true.', () => {
    const response = { isHttpResponseInternalServerError: true };
    strictEqual(isHttpResponseInternalServerError(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseInternalServerError and if it '
      + 'has no property isHttpResponseInternalServerError.', () => {
    const response = {};
    strictEqual(isHttpResponseInternalServerError(response), false);
    strictEqual(isHttpResponseInternalServerError(undefined), false);
    strictEqual(isHttpResponseInternalServerError(null), false);
  });

});

describe('HttpResponseNotImplemented', () => {

  it('should inherit from HttpResponseServerError and HttpResponse', () => {
    const httpResponse = new HttpResponseNotImplemented();
    ok(httpResponse instanceof HttpResponse);
    ok(httpResponse instanceof HttpResponseServerError);
  });

  it('should have the correct status.', () => {
    const httpResponse = new HttpResponseNotImplemented();
    strictEqual(httpResponse.statusCode, 501);
    strictEqual(httpResponse.statusMessage, 'NOT IMPLEMENTED');
  });

  it('should accept an optional body.', () => {
    let httpResponse = new HttpResponseNotImplemented();
    strictEqual(httpResponse.body, undefined);

    const body = { foo: 'bar' };
    httpResponse = new HttpResponseNotImplemented(body);
    strictEqual(httpResponse.body, body);
  });

  it('should accept optional options.', () => {
    let httpResponse = new HttpResponseNotImplemented();
    strictEqual(httpResponse.stream, false);

    httpResponse = new HttpResponseNotImplemented({}, { stream: true });
    strictEqual(httpResponse.stream, true);
  });

  it('should allow specifying the required type for the body', () => {
    type NumberResponse = HttpResponseNotImplemented<number>
    type BodyOnlyAcceptsNumbers = NumberResponse['body'] extends number ? true : never
    const isTrue: BodyOnlyAcceptsNumbers = true
    strictEqual(isTrue, true)
  });

});

describe('isHttpResponseNotImplemented', () => {

  it('should return true if the given object is an instance of HttpResponseNotImplemented.', () => {
    const response = new HttpResponseNotImplemented();
    strictEqual(isHttpResponseNotImplemented(response), true);
  });

  it('should return true if the given object has an isHttpResponseNotImplemented property equal to true.', () => {
    const response = { isHttpResponseNotImplemented: true };
    strictEqual(isHttpResponseNotImplemented(response), true);
  });

  it('should return false if the given object is not an instance of HttpResponseNotImplemented and if it '
      + 'has no property isHttpResponseNotImplemented.', () => {
    const response = {};
    strictEqual(isHttpResponseNotImplemented(response), false);
    strictEqual(isHttpResponseNotImplemented(undefined), false);
    strictEqual(isHttpResponseNotImplemented(null), false);
  });

});
