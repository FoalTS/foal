export abstract class HttpResponse {
  public readonly isHttpResponse = true;

  public abstract statusCode: number;
  public abstract statusMessage: string;

  constructor(public content?: any) {}
}

export function isHttpResponse(obj: object): boolean {
  return obj instanceof HttpResponse || (obj as any).isHttpResponse === true;
}

/* 2xx Success */

export abstract class HttpResponseSuccess extends HttpResponse {
  public readonly isHttpResponseSuccess = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseSuccess(obj: object): boolean {
  return obj instanceof HttpResponseSuccess || (obj as any).isHttpResponseSuccess === true;
}

export class HttpResponseOK extends HttpResponseSuccess {
  public readonly isHttpResponseOK = true;
  public statusCode = 200;
  public statusMessage = 'OK';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseOK(obj: object): boolean {
  return obj instanceof HttpResponseOK || (obj as any).isHttpResponseOK === true;
}

export class HttpResponseCreated extends HttpResponseSuccess {
  public readonly isHttpResponseCreated = true;
  public statusCode = 201;
  public statusMessage = 'CREATED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseCreated(obj: object): boolean {
  return obj instanceof HttpResponseCreated || (obj as any).isHttpResponseCreated === true;
}

/* 3xx Redirection */

export abstract class HttpResponseRedirection extends HttpResponse {
  public readonly isHttpResponseRedirection = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseRedirection(obj: object): boolean {
  return obj instanceof HttpResponseRedirection || (obj as any).isHttpResponseRedirection === true;
}

export class HttpResponseRedirect extends HttpResponseRedirection {
  public readonly isHttpResponseRedirect = true;
  public statusCode = 302;
  public statusMessage = 'FOUND';
  constructor(public path: string, content?: any) {
    super(content);
  }
}

export function isHttpResponseRedirect(obj: object): boolean {
  return obj instanceof HttpResponseRedirect || (obj as any).isHttpResponseRedirect === true;
}

/* 4xx Client Error */

export abstract class HttpResponseClientError extends HttpResponse {
  public readonly isHttpResponseClientError = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseClientError(obj: object): boolean {
  return obj instanceof HttpResponseClientError || (obj as any).isHttpResponseClientError === true;
}

export class HttpResponseBadRequest extends HttpResponseClientError {
  public readonly isHttpResponseBadRequest = true;
  public statusCode = 400;
  public statusMessage = 'BAD REQUEST';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseBadRequest(obj: object): boolean {
  return obj instanceof HttpResponseBadRequest || (obj as any).isHttpResponseBadRequest === true;
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

export function isHttpResponseUnauthorized(obj: object): boolean {
  return obj instanceof HttpResponseUnauthorized || (obj as any).isHttpResponseUnauthorized === true;
}

export class HttpResponseForbidden extends HttpResponseClientError {
  public readonly isHttpResponseForbidden = true;
  public statusCode = 403;
  public statusMessage = 'FORBIDDEN';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseForbidden(obj: object): boolean {
  return obj instanceof HttpResponseForbidden || (obj as any).isHttpResponseForbidden === true;
}

export class HttpResponseNotFound extends HttpResponseClientError {
  public readonly isHttpResponseNotFound = true;
  public statusCode = 404;
  public statusMessage = 'NOT FOUND';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseNotFound(obj: object): boolean {
  return obj instanceof HttpResponseNotFound || (obj as any).isHttpResponseNotFound === true;
}

export class HttpResponseMethodNotAllowed extends HttpResponseClientError {
  public readonly isHttpResponseMethodNotAllowed = true;
  public statusCode = 405;
  public statusMessage = 'METHOD NOT ALLOWED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseMethodNotAllowed(obj: object): boolean {
  return obj instanceof HttpResponseMethodNotAllowed || (obj as any).isHttpResponseMethodNotAllowed === true;
}

export class HttpResponseConflict extends HttpResponseClientError {
  public readonly isHttpResponseConflict = true;
  public statusCode = 409;
  public statusMessage = 'CONFLICT';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseConflict(obj: object): boolean {
  return obj instanceof HttpResponseConflict || (obj as any).isHttpResponseConflict === true;
}

/* 5xx Server Error */

export abstract class HttpResponseServerError extends HttpResponse {
  public readonly isHttpResponseServerError = true;
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseServerError(obj: object): boolean {
  return obj instanceof HttpResponseServerError || (obj as any).isHttpResponseServerError === true;
}

export class HttpResponseInternalServerError extends HttpResponseServerError {
  public readonly isHttpResponseInternalServerError = true;
  public statusCode = 500;
  public statusMessage = 'INTERNAL SERVER ERROR';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseInternalServerError(obj: object): boolean {
  return obj instanceof HttpResponseInternalServerError || (obj as any).isHttpResponseInternalServerError === true;
}

export class HttpResponseNotImplemented extends HttpResponseServerError {
  public readonly isHttpResponseNotImplemented = true;
  public statusCode = 501;
  public statusMessage = 'NOT IMPLEMENTED';
  constructor(content?: any) {
    super(content);
  }
}

export function isHttpResponseNotImplemented(obj: object): boolean {
  return obj instanceof HttpResponseNotImplemented || (obj as any).isHttpResponseNotImplemented === true;
}
