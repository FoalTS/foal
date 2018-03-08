export abstract class HttpResponse {
  public readonly isHttpResponse = true;

  public abstract statusCode: number;
  public abstract statusMessage: string;

  constructor(public content?: any) {}
}

export function isHttpResponse(obj): boolean {
  return obj instanceof HttpResponse || obj.isHttpResponse === true;
}

/* 2xx Success */

export abstract class HttpResponseSuccess extends HttpResponse {
  public readonly isHttpResponseSuccess = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseSuccess(obj): boolean {
  return obj instanceof HttpResponseSuccess || obj.isHttpResponseSuccess === true;
}

export class HttpResponseOK extends HttpResponseSuccess {
  public readonly isHttpResponseOK = true;
  public statusCode = 200;
  public statusMessage = 'OK';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseOK(obj): boolean {
  return obj instanceof HttpResponseOK || obj.isHttpResponseOK === true;
}

export class HttpResponseCreated extends HttpResponseSuccess {
  public readonly isHttpResponseCreated = true;
  public statusCode = 201;
  public statusMessage = 'CREATED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseCreated(obj): boolean {
  return obj instanceof HttpResponseCreated || obj.isHttpResponseCreated === true;
}

/* 3xx Redirection */

export abstract class HttpResponseRedirection extends HttpResponse {
  public readonly isHttpResponseRedirection = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseRedirection(obj): boolean {
  return obj instanceof HttpResponseRedirection || obj.isHttpResponseRedirection === true;
}

export class HttpResponseRedirect extends HttpResponseRedirection {
  public readonly isHttpResponseRedirect = true;
  public statusCode = 302;
  public statusMessage = 'FOUND';
  constructor(public path: string, content?: any) {
    super(content);
  }
}

export function isHttpResponseRedirect(obj): boolean {
  return obj instanceof HttpResponseRedirect || obj.isHttpResponseRedirect === true;
}

/* 4xx Client Error */

export abstract class HttpResponseClientError extends HttpResponse {
  public readonly isHttpResponseClientError = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseClientError(obj): boolean {
  return obj instanceof HttpResponseClientError || obj.isHttpResponseClientError === true;
}

export class HttpResponseBadRequest extends HttpResponseClientError {
  public readonly isHttpResponseBadRequest = true;
  public statusCode = 400;
  public statusMessage = 'BAD REQUEST';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseBadRequest(obj): boolean {
  return obj instanceof HttpResponseBadRequest || obj.isHttpResponseBadRequest === true;
}

export class HttpResponseUnauthorized extends HttpResponseClientError {
  public readonly isHttpResponseUnauthorized = true;
  public statusCode = 401;
  public statusMessage = 'UNAUTHORIZED';
  public headers = {
    'WWW-Authenticate': ''
  };
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseUnauthorized(obj): boolean {
  return obj instanceof HttpResponseUnauthorized || obj.isHttpResponseUnauthorized === true;
}

export class HttpResponseForbidden extends HttpResponseClientError {
  public readonly isHttpResponseForbidden = true;
  public statusCode = 403;
  public statusMessage = 'FORBIDDEN';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseForbidden(obj): boolean {
  return obj instanceof HttpResponseForbidden || obj.isHttpResponseForbidden === true;
}

export class HttpResponseNotFound extends HttpResponseClientError {
  public readonly isHttpResponseNotFound = true;
  public statusCode = 404;
  public statusMessage = 'NOT FOUND';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseNotFound(obj): boolean {
  return obj instanceof HttpResponseNotFound || obj.isHttpResponseNotFound === true;
}

export class HttpResponseMethodNotAllowed extends HttpResponseClientError {
  public readonly isHttpResponseMethodNotAllowed = true;
  public statusCode = 405;
  public statusMessage = 'METHOD NOT ALLOWED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseMethodNotAllowed(obj): boolean {
  return obj instanceof HttpResponseMethodNotAllowed || obj.isHttpResponseMethodNotAllowed === true;
}

export class HttpResponseConflict extends HttpResponseClientError {
  public readonly isHttpResponseConflict = true;
  public statusCode = 409;
  public statusMessage = 'CONFLICT';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseConflict(obj): boolean {
  return obj instanceof HttpResponseConflict || obj.isHttpResponseConflict === true;
}

/* 5xx Server Error */

export abstract class HttpResponseServerError extends HttpResponse {
  public readonly isHttpResponseServerError = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseServerError(obj): boolean {
  return obj instanceof HttpResponseServerError || obj.isHttpResponseServerError === true;
}

export class HttpResponseInternalServerError extends HttpResponseServerError {
  public readonly isHttpResponseInternalServerError = true;
  public statusCode = 500;
  public statusMessage = 'INTERNAL SERVER ERROR';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseInternalServerError(obj): boolean {
  return obj instanceof HttpResponseInternalServerError || obj.isHttpResponseInternalServerError === true;
}

export class HttpResponseNotImplemented extends HttpResponseServerError {
  public readonly isHttpResponseNotImplemented = true;
  public statusCode = 501;
  public statusMessage = 'NOT IMPLEMENTED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseNotImplemented(obj): boolean {
  return obj instanceof HttpResponseNotImplemented || obj.isHttpResponseNotImplemented === true;
}
