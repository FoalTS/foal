export interface CookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict'|'lax';
}

export abstract class HttpResponse {
  readonly isHttpResponse = true;

  abstract statusCode: number;
  abstract statusMessage: string;

  private cookies: { [key: string]: { value: string|undefined, options: CookieOptions } } = {};
  private headers: { [key: string]: string } = {};

  constructor(public body?: any) {}

  setHeader(name: string, value: string): void {
    this.headers[name] = value;
  }

  getHeader(name: string): string|undefined {
    return this.headers[name];
  }

  getHeaders(): { [key: string]: string } {
    return { ...this.headers };
  }

  setCookie(name: string, value: string, options: CookieOptions = {}): void {
    this.cookies[name] = { value, options };
  }

  getCookie(name: string): { value: string|undefined, options: CookieOptions } {
    if (!this.cookies[name]) {
      return { value: undefined, options: {} };
    }
    const { value, options } = this.cookies[name];
    return { value, options: { ...options } };
  }

  getCookies(): { [key: string]: { value: string|undefined, options: CookieOptions } } {
    const cookies: { [key: string]: { value: string|undefined, options: CookieOptions } } = {};
    // tslint:disable-next-line:forin
    for (const cookieName in this.cookies) {
      const { value, options } = this.cookies[cookieName];
      cookies[cookieName] = { value, options: { ...options } };
    }
    return cookies;
  }
}

export function isHttpResponse(obj: any): obj is HttpResponse {
  return obj instanceof HttpResponse ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponse === true);
}

/* 2xx Success */

export abstract class HttpResponseSuccess extends HttpResponse {
  readonly isHttpResponseSuccess = true;
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
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
  constructor(public path: string, body?: any) {
    super(body);
  }
}

export function isHttpResponseRedirect(obj: any): obj is HttpResponseRedirect {
  return obj instanceof HttpResponseRedirect ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseRedirect === true);
}

/* 4xx Client Error */

export abstract class HttpResponseClientError extends HttpResponse {
  readonly isHttpResponseClientError = true;
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
    this.setHeader('WWW-Authenticate', '');
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
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
  }
}

export function isHttpResponseConflict(obj: any): obj is HttpResponseConflict {
  return obj instanceof HttpResponseConflict ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseConflict === true);
}

/* 5xx Server Error */

export abstract class HttpResponseServerError extends HttpResponse {
  readonly isHttpResponseServerError = true;
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
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
  constructor(body?: any) {
    super(body);
  }
}

export function isHttpResponseNotImplemented(obj: any): obj is HttpResponseNotImplemented {
  return obj instanceof HttpResponseNotImplemented ||
   (typeof obj === 'object' && obj !== null && obj.isHttpResponseNotImplemented === true);
}
