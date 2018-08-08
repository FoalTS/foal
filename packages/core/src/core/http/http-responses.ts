export abstract class HttpResponse {
  readonly isHttpResponse = true;

  headers: { [key: string]: string } = {};

  abstract statusCode: number;
  abstract statusMessage: string;

  constructor(public content?: any) {}
}

export function isHttpResponse(obj: any): obj is HttpResponse {
  return obj instanceof HttpResponse ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponse === true);
}

/* 2xx Success */

export abstract class HttpResponseSuccess extends HttpResponse {
  readonly isHttpResponseSuccess = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseSuccess(obj: any): obj is HttpResponseSuccess {
  return obj instanceof HttpResponseSuccess ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseSuccess === true);
}

export class HttpResponseOK extends HttpResponseSuccess {
  readonly isHttpResponseOK = true;
  statusCode = 200;
  statusMessage = 'OK';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseOK(obj: any): obj is HttpResponseOK {
  return obj instanceof HttpResponseOK ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseOK === true);
}

export class HttpResponseCreated extends HttpResponseSuccess {
  readonly isHttpResponseCreated = true;
  statusCode = 201;
  statusMessage = 'CREATED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseCreated(obj: any): obj is HttpResponseCreated {
  return obj instanceof HttpResponseCreated ||
  (typeof obj === 'object' && obj !== null && obj.isHttpResponseCreated === true);
}

export class HttpResponseNoContent extends HttpResponseSuccess {
  readonly isHttpResponseNoContent = true;
  statusCode = 204;
  statusMessage = 'NO CONTENT';
  constructor() {
    super();
  }
}

export function isHttpResponseNoContent(obj: any): obj is HttpResponseNoContent {
  return obj instanceof HttpResponseNoContent ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseNoContent === true);
}

/* 3xx Redirection */

export abstract class HttpResponseRedirection extends HttpResponse {
  readonly isHttpResponseRedirection = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseRedirection(obj: any): obj is HttpResponseRedirection {
  return obj instanceof HttpResponseRedirection ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseRedirection === true);
}

export class HttpResponseRedirect extends HttpResponseRedirection {
  readonly isHttpResponseRedirect = true;
  statusCode = 302;
  statusMessage = 'FOUND';
  constructor(public path: string, content?: any) {
    super(content);
  }
}

export function isHttpResponseRedirect(obj: any): obj is HttpResponseRedirect {
  return obj instanceof HttpResponseRedirect ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseRedirect === true);
}

/* 4xx Client Error */

export abstract class HttpResponseClientError extends HttpResponse {
  readonly isHttpResponseClientError = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseClientError(obj: any): obj is HttpResponseClientError {
  return obj instanceof HttpResponseClientError ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseClientError === true);
}

export class HttpResponseBadRequest extends HttpResponseClientError {
  readonly isHttpResponseBadRequest = true;
  statusCode = 400;
  statusMessage = 'BAD REQUEST';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseBadRequest(obj: any): obj is HttpResponseBadRequest {
  return obj instanceof HttpResponseBadRequest ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseBadRequest === true);
}

export class HttpResponseUnauthorized extends HttpResponseClientError {
  readonly isHttpResponseUnauthorized = true;
  statusCode = 401;
  statusMessage = 'UNAUTHORIZED';
  headers = {
    'WWW-Authenticate': ''
  };
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseUnauthorized(obj: any): obj is HttpResponseUnauthorized {
  return obj instanceof HttpResponseUnauthorized ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseUnauthorized === true);
}

export class HttpResponseForbidden extends HttpResponseClientError {
  readonly isHttpResponseForbidden = true;
  statusCode = 403;
  statusMessage = 'FORBIDDEN';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseForbidden(obj: any): obj is HttpResponseForbidden {
  return obj instanceof HttpResponseForbidden ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseForbidden === true);
}

export class HttpResponseNotFound extends HttpResponseClientError {
  readonly isHttpResponseNotFound = true;
  statusCode = 404;
  statusMessage = 'NOT FOUND';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseNotFound(obj: any): obj is HttpResponseNotFound {
  return obj instanceof HttpResponseNotFound ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseNotFound === true);
}

export class HttpResponseMethodNotAllowed extends HttpResponseClientError {
  readonly isHttpResponseMethodNotAllowed = true;
  statusCode = 405;
  statusMessage = 'METHOD NOT ALLOWED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseMethodNotAllowed(obj: any): obj is HttpResponseMethodNotAllowed {
  return obj instanceof HttpResponseMethodNotAllowed ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseMethodNotAllowed === true);
}

export class HttpResponseConflict extends HttpResponseClientError {
  readonly isHttpResponseConflict = true;
  statusCode = 409;
  statusMessage = 'CONFLICT';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseConflict(obj: any): obj is HttpResponseConflict {
  return obj instanceof HttpResponseConflict ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseConflict === true);
}

/* 5xx Server Error */

export abstract class HttpResponseServerError extends HttpResponse {
  readonly isHttpResponseServerError = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseServerError(obj: any): obj is HttpResponseServerError {
  return obj instanceof HttpResponseServerError ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseServerError === true);
}

export class HttpResponseInternalServerError extends HttpResponseServerError {
  readonly isHttpResponseInternalServerError = true;
  statusCode = 500;
  statusMessage = 'INTERNAL SERVER ERROR';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseInternalServerError(obj: any): obj is HttpResponseInternalServerError {
  return obj instanceof HttpResponseInternalServerError ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseInternalServerError === true);
}

export class HttpResponseNotImplemented extends HttpResponseServerError {
  readonly isHttpResponseNotImplemented = true;
  statusCode = 501;
  statusMessage = 'NOT IMPLEMENTED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseNotImplemented(obj: any): obj is HttpResponseNotImplemented {
  return obj instanceof HttpResponseNotImplemented ||
   (typeof obj === 'object' && obj !== null && obj.isHttpResponseNotImplemented === true);
}
