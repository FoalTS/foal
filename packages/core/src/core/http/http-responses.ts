export abstract class HttpResponse {
  readonly isHttpResponse = true;

  abstract statusCode: number;
  abstract statusMessage: string;

  constructor(public content?: any) {}
}

export function isHttpResponse(obj: object): boolean {
  return obj instanceof HttpResponse || (obj as any).isHttpResponse === true;
}

/* 2xx Success */

export abstract class HttpResponseSuccess extends HttpResponse {
  readonly isHttpResponseSuccess = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseSuccess(obj: object): boolean {
  return obj instanceof HttpResponseSuccess || (obj as any).isHttpResponseSuccess === true;
}

export class HttpResponseOK extends HttpResponseSuccess {
  readonly isHttpResponseOK = true;
  statusCode = 200;
  statusMessage = 'OK';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseOK(obj: object): boolean {
  return obj instanceof HttpResponseOK || (obj as any).isHttpResponseOK === true;
}

export class HttpResponseCreated extends HttpResponseSuccess {
  readonly isHttpResponseCreated = true;
  statusCode = 201;
  statusMessage = 'CREATED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseCreated(obj: object): boolean {
  return obj instanceof HttpResponseCreated || (obj as any).isHttpResponseCreated === true;
}

export class HttpResponseNoContent extends HttpResponseSuccess {
  readonly isHttpResponseNoContent = true;
  statusCode = 204;
  statusMessage = 'NO CONTENT';
  constructor() {
    super();
  }
}

export function isHttpResponseNoContent(obj: object): boolean {
  return obj instanceof HttpResponseNoContent || (obj as any).isHttpResponseNoContent === true;
}

/* 3xx Redirection */

export abstract class HttpResponseRedirection extends HttpResponse {
  readonly isHttpResponseRedirection = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseRedirection(obj: object): boolean {
  return obj instanceof HttpResponseRedirection || (obj as any).isHttpResponseRedirection === true;
}

export class HttpResponseRedirect extends HttpResponseRedirection {
  readonly isHttpResponseRedirect = true;
  statusCode = 302;
  statusMessage = 'FOUND';
  constructor(public path: string, content?: any) {
    super(content);
  }
}

export function isHttpResponseRedirect(obj: object): boolean {
  return obj instanceof HttpResponseRedirect || (obj as any).isHttpResponseRedirect === true;
}

/* 4xx Client Error */

export abstract class HttpResponseClientError extends HttpResponse {
  readonly isHttpResponseClientError = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseClientError(obj: object): boolean {
  return obj instanceof HttpResponseClientError || (obj as any).isHttpResponseClientError === true;
}

export class HttpResponseBadRequest extends HttpResponseClientError {
  readonly isHttpResponseBadRequest = true;
  statusCode = 400;
  statusMessage = 'BAD REQUEST';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseBadRequest(obj: object): boolean {
  return obj instanceof HttpResponseBadRequest || (obj as any).isHttpResponseBadRequest === true;
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

export function isHttpResponseUnauthorized(obj: object): boolean {
  return obj instanceof HttpResponseUnauthorized || (obj as any).isHttpResponseUnauthorized === true;
}

export class HttpResponseForbidden extends HttpResponseClientError {
  readonly isHttpResponseForbidden = true;
  statusCode = 403;
  statusMessage = 'FORBIDDEN';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseForbidden(obj: object): boolean {
  return obj instanceof HttpResponseForbidden || (obj as any).isHttpResponseForbidden === true;
}

export class HttpResponseNotFound extends HttpResponseClientError {
  readonly isHttpResponseNotFound = true;
  statusCode = 404;
  statusMessage = 'NOT FOUND';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseNotFound(obj: object): boolean {
  return obj instanceof HttpResponseNotFound || (obj as any).isHttpResponseNotFound === true;
}

export class HttpResponseMethodNotAllowed extends HttpResponseClientError {
  readonly isHttpResponseMethodNotAllowed = true;
  statusCode = 405;
  statusMessage = 'METHOD NOT ALLOWED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseMethodNotAllowed(obj: object): boolean {
  return obj instanceof HttpResponseMethodNotAllowed || (obj as any).isHttpResponseMethodNotAllowed === true;
}

export class HttpResponseConflict extends HttpResponseClientError {
  readonly isHttpResponseConflict = true;
  statusCode = 409;
  statusMessage = 'CONFLICT';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseConflict(obj: object): boolean {
  return obj instanceof HttpResponseConflict || (obj as any).isHttpResponseConflict === true;
}

/* 5xx Server Error */

export abstract class HttpResponseServerError extends HttpResponse {
  readonly isHttpResponseServerError = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseServerError(obj: object): boolean {
  return obj instanceof HttpResponseServerError || (obj as any).isHttpResponseServerError === true;
}

export class HttpResponseInternalServerError extends HttpResponseServerError {
  readonly isHttpResponseInternalServerError = true;
  statusCode = 500;
  statusMessage = 'INTERNAL SERVER ERROR';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseInternalServerError(obj: object): boolean {
  return obj instanceof HttpResponseInternalServerError || (obj as any).isHttpResponseInternalServerError === true;
}

export class HttpResponseNotImplemented extends HttpResponseServerError {
  readonly isHttpResponseNotImplemented = true;
  statusCode = 501;
  statusMessage = 'NOT IMPLEMENTED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseNotImplemented(obj: object): boolean {
  return obj instanceof HttpResponseNotImplemented || (obj as any).isHttpResponseNotImplemented === true;
}
