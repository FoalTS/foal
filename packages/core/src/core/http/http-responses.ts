import { Context } from './context';

/**
 * Cookie options of the HttpResponse.setCookie method.
 *
 * The value of maxAge is in seconds.
 *
 * @export
 * @interface CookieOptions
 */
export interface CookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict'|'lax'|'none';
  signed?: boolean;
}

/**
 * Represent an HTTP response. This class must be extended.
 * Instances of HttpResponse are returned in hooks and controller
 * methods.
 *
 * @export
 * @abstract
 * @class HttpResponse
 */
export abstract class HttpResponse<T = any> {
  /**
   * Property used internally by isHttpResponse.
   *
   * @memberof HttpResponse
   */
  readonly isHttpResponse = true;

  /**
   * Status code of the response.
   *
   * @abstract
   * @type {number}
   * @memberof HttpResponse
   */
  abstract readonly statusCode: number;
  /**
   * Status message of the response. It must follow the HTTP conventions
   * and be consistent with the statusCode property.
   *
   * @abstract
   * @type {string}
   * @memberof HttpResponse
   */
  abstract readonly statusMessage: string;
  /**
   * Specify if the body property is a stream.
   *
   * @type {boolean}
   * @memberof HttpResponse
   */
  readonly stream: boolean = false;

  body: T;

  private cookies: { [key: string]: { value: string|undefined, options: CookieOptions } } = {};
  private headers: { [key: string]: string } = {};

  /**
   * Create an instance of HttpResponse.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponse
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    if (typeof body !== 'undefined') {
      this.body = body;
    }
    this.stream = options.stream || false;
  }

  /**
   * Add or replace a header in the response.
   *
   * @param {string} name - The header name.
   * @param {string} value - The value name.
   * @returns {this}
   * @memberof HttpResponse
   */
  setHeader(name: string, value: string): this {
    this.headers[name] = value;
    return this;
  }

  /**
   * Read the value of a header added with setHeader.
   *
   * @param {string} name - The header name.
   * @returns {(string|undefined)} The header value or undefined if it
   * does not exist.
   * @memberof HttpResponse
   */
  getHeader(name: string): string|undefined {
    return this.headers[name];
  }

  /**
   * Read all the headers added with setHeader.
   *
   * @returns {{ [key: string]: string }} - The headers.
   * @memberof HttpResponse
   */
  getHeaders(): { [key: string]: string } {
    return { ...this.headers };
  }

  /**
   * Add or replace a cookie in the response.
   *
   * @param {string} name - The cookie name.
   * @param {string} value - The cookie value.
   * @param {CookieOptions} [options={}] - The cookie directives if any.
   * @returns {this}
   * @memberof HttpResponse
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): this {
    this.cookies[name] = { value, options };
    return this;
  }

  /**
   * Read the value and directives of a cookie added with setCookie.
   *
   * @param {string} name - The cookie name.
   * @returns {({ value: string|undefined, options: CookieOptions })} The cookie value and directives
   * or undefined and an empty object if the cookie does not exist.
   * @memberof HttpResponse
   */
  getCookie(name: string): { value: string|undefined, options: CookieOptions } {
    if (!this.cookies[name]) {
      return { value: undefined, options: {} };
    }
    const { value, options } = this.cookies[name];
    return { value, options: { ...options } };
  }

  /**
   * Read all the cookies added with setCookie.
   *
   * @returns {({ [key: string]: { value: string|undefined, options: CookieOptions } })}
   * The name, value and directives of the cookies.
   * @memberof HttpResponse
   */
  getCookies(): { [key: string]: { value: string|undefined, options: CookieOptions } } {
    const cookies: { [key: string]: { value: string|undefined, options: CookieOptions } } = {};
    for (const cookieName in this.cookies) {
      const { value, options } = this.cookies[cookieName];
      cookies[cookieName] = { value, options: { ...options } };
    }
    return cookies;
  }
}

/**
 * Check if an object is an instance of HttpResponse.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponse} - True if the error is an instance of HttpResponse. False otherwise.
 */
export function isHttpResponse(obj: any): obj is HttpResponse {
  return obj instanceof HttpResponse ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponse === true);
}

/* 2xx Success */

/**
 * Represent an HTTP response with a success status 2xx.
 *
 * @export
 * @abstract
 * @class HttpResponseSuccess
 * @extends {HttpResponse}
 */
export abstract class HttpResponseSuccess<T = any> extends HttpResponse<T> {
  /**
   * Property used internally by isHttpResponseSuccess.
   *
   * @memberof HttpResponseSuccess
   */
  readonly isHttpResponseSuccess = true;

  /**
   * Create an instance of HttpResponseSuccess.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseSuccess
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseSuccess.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseSuccess} - True if the error is an instance of HttpResponseSuccess. False otherwise.
 */
export function isHttpResponseSuccess(obj: any): obj is HttpResponseSuccess {
  return obj instanceof HttpResponseSuccess ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseSuccess === true);
}

/**
 * Represent an HTTP response with the status 200 - OK.
 *
 * @export
 * @class HttpResponseOK
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseOK<T = any> extends HttpResponseSuccess<T> {
  /**
   * Property used internally by isHttpResponseOK.
   *
   * @memberof HttpResponseOK
   */
  readonly isHttpResponseOK = true;
  readonly statusCode = 200;
  readonly statusMessage = 'OK';

  /**
   * Create an instance of HttpResponseOK.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseOK
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseOK.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseOK} - True if the error is an instance of HttpResponseOK. False otherwise.
 */
export function isHttpResponseOK(obj: any): obj is HttpResponseOK {
  return obj instanceof HttpResponseOK ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseOK === true);
}

/**
 * Represent an HTTP response with the status 201 - CREATED.
 *
 * @export
 * @class HttpResponseCreated
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseCreated<T = any> extends HttpResponseSuccess<T> {
  /**
   * Property used internally by isHttpResponseCreated.
   *
   * @memberof HttpResponseCreated
   */
  readonly isHttpResponseCreated = true;
  readonly statusCode = 201;
  readonly statusMessage = 'CREATED';

  /**
   * Create an instance of HttpResponseCreated.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseCreated
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseCreated.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseCreated} - True if the error is an instance of HttpResponseCreated. False otherwise.
 */
export function isHttpResponseCreated(obj: any): obj is HttpResponseCreated {
  return obj instanceof HttpResponseCreated ||
  (typeof obj === 'object' && obj !== null && obj.isHttpResponseCreated === true);
}

/**
 * Represent an HTTP response with the status 204 - NO CONTENT.
 *
 * @export
 * @class HttpResponseNoContent
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseNoContent extends HttpResponseSuccess {
  /**
   * Property used internally by is HttpResponseNoContent.
   *
   * @memberof HttpResponseNoContent
   */
  readonly isHttpResponseNoContent = true;
  readonly statusCode = 204;
  readonly statusMessage = 'NO CONTENT';

  /**
   * Create an instance of HttpResponseNoContent.
   * @memberof HttpResponseNoContent
   */
  constructor() {
    super();
  }
}

/**
 * Check if an object is an instance of HttpResponseNoContent.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseNoContent} - True if the error is an instance of HttpResponseNoContent. False otherwise.
 */
export function isHttpResponseNoContent(obj: any): obj is HttpResponseNoContent {
  return obj instanceof HttpResponseNoContent ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseNoContent === true);
}

/* 3xx Redirection */

/**
 * Represent an HTTP response with a redirection status 3xx.
 *
 * @export
 * @abstract
 * @class HttpResponseRedirection
 * @extends {HttpResponse}
 */
export abstract class HttpResponseRedirection<T = any> extends HttpResponse<T> {
  /**
   * Property used internally by isHttpResponseRedirection.
   *
   * @memberof HttpResponseRedirection
   */
  readonly isHttpResponseRedirection = true;

  /**
   * Create an instance of HttpResponseRedirection.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseRedirection
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseRedirection.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseRedirection} - True if the error is an instance of HttpResponseRedirection.
 * False otherwise.
 */
export function isHttpResponseRedirection(obj: any): obj is HttpResponseRedirection {
  return obj instanceof HttpResponseRedirection ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseRedirection === true);
}

/**
 * Represent an HTTP response with the status 301 - MOVED PERMANENTLY.
 *
 * @export
 * @class HttpResponseMovedPermanently
 * @extends {HttpResponseRedirection}
 */
export class HttpResponseMovedPermanently extends HttpResponseRedirection {
  /**
   * Property used internally by isHttpResponseMovedPermanently.
   *
   * @memberof isHttpResponseMovedPermanently
   */
  readonly isHttpResponseMovedPermanently = true;
  readonly statusCode = 301;
  readonly statusMessage = 'MOVED PERMANENTLY';

  /**
   * Create an instance of HttpResponseMovedPermanently.
   * @param {string} path - The redirection path.
   * @memberof HttpResponseMovedPermanently
   */
  constructor(public path: string) {
    super();
  }
}

/**
 * Check if an object is an instance of HttpResponseMovedPermanently.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseMovedPermanently} - True if the error is an
 * instance of HttpResponseMovedPermanently. False otherwise.
 */
export function isHttpResponseMovedPermanently(obj: any): obj is HttpResponseMovedPermanently {
  return obj instanceof HttpResponseMovedPermanently ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseMovedPermanently === true);
}

/**
 * Represent an HTTP response with the status 302 - FOUND.
 *
 * @export
 * @class HttpResponseRedirect
 * @extends {HttpResponseRedirection}
 */
export class HttpResponseRedirect<T = any> extends HttpResponseRedirection<T> {
  /**
   * Property used internally by isHttpResponseRedirect.
   *
   * @memberof HttpResponseRedirect
   */
  readonly isHttpResponseRedirect = true;
  readonly statusCode = 302;
  readonly statusMessage = 'FOUND';

  /**
   * Create an instance of HttpResponseRedirect.
   * @param {string} path - The redirection path.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseRedirect
   */
  constructor(public path: string, body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseRedirect.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseRedirect} - True if the error is an instance of HttpResponseRedirect. False otherwise.
 */
export function isHttpResponseRedirect(obj: any): obj is HttpResponseRedirect {
  return obj instanceof HttpResponseRedirect ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseRedirect === true);
}

/* 4xx Client Error */

/**
 * Represent an HTTP response with a client error status 4xx.
 *
 * @export
 * @abstract
 * @class HttpResponseClientError
 * @extends {HttpResponse}
 */
export abstract class HttpResponseClientError<T = any> extends HttpResponse<T> {
  /**
   * Property used internally by isHttpResponseClientError.
   *
   * @memberof HttpResponseClientError
   */
  readonly isHttpResponseClientError = true;

  /**
   * Create an instance of HttpResponseClientError.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseClientError
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseClientError.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseClientError} - True if the error is an instance of HttpResponseClientError.
 * False otherwise.
 */
export function isHttpResponseClientError(obj: any): obj is HttpResponseClientError {
  return obj instanceof HttpResponseClientError ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseClientError === true);
}

/**
 * Represent an HTTP response with the status 400 - BAD REQUEST.
 *
 * @export
 * @class HttpResponseBadRequest
 * @extends {HttpResponseClientError}
 */
export class HttpResponseBadRequest<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseBadRequest.
   *
   * @memberof HttpResponseBadRequest
   */
  readonly isHttpResponseBadRequest = true;
  readonly statusCode = 400;
  readonly statusMessage = 'BAD REQUEST';

  /**
   * Create an instance of HttpResponseBadRequest.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseBadRequest
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseBadRequest.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseBadRequest} - True if the error is an instance of HttpResponseBadRequest.
 * False otherwise.
 */
export function isHttpResponseBadRequest(obj: any): obj is HttpResponseBadRequest {
  return obj instanceof HttpResponseBadRequest ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseBadRequest === true);
}

/**
 * Represent an HTTP response with the status 401 - UNAUTHORIZED.
 *
 * @export
 * @class HttpResponseUnauthorized
 * @extends {HttpResponseClientError}
 */
export class HttpResponseUnauthorized<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseUnauthorized.
   *
   * @memberof HttpResponseUnauthorized
   */
  readonly isHttpResponseUnauthorized = true;
  readonly statusCode = 401;
  readonly statusMessage = 'UNAUTHORIZED';

  /**
   * Create an instance of HttpResponseUnauthorized.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseUnauthorized
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
    this.setHeader('WWW-Authenticate', '');
  }
}

/**
 * Check if an object is an instance of HttpResponseUnauthorized.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseUnauthorized} - True if the error is an instance of HttpResponseUnauthorized.
 * False otherwise.
 */
export function isHttpResponseUnauthorized(obj: any): obj is HttpResponseUnauthorized {
  return obj instanceof HttpResponseUnauthorized ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseUnauthorized === true);
}

/**
 * Represent an HTTP response with the status 403 - FORBIDDEN.
 *
 * @export
 * @class HttpResponseForbidden
 * @extends {HttpResponseClientError}
 */
export class HttpResponseForbidden<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseForbidden.
   *
   * @memberof HttpResponseForbidden
   */
  readonly isHttpResponseForbidden = true;
  readonly statusCode = 403;
  readonly statusMessage = 'FORBIDDEN';

  /**
   * Create an instance of HttpResponseForbidden.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseForbidden
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseForbidden.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseForbidden} - True if the error is an instance of HttpResponseForbidden. False otherwise.
 */
export function isHttpResponseForbidden(obj: any): obj is HttpResponseForbidden {
  return obj instanceof HttpResponseForbidden ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseForbidden === true);
}

/**
 * Represent an HTTP response with the status 404 - NOT FOUND.
 *
 * @export
 * @class HttpResponseNotFound
 * @extends {HttpResponseClientError}
 */
export class HttpResponseNotFound<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseNotFound.
   *
   * @memberof HttpResponseNotFound
   */
  readonly isHttpResponseNotFound = true;
  readonly statusCode = 404;
  readonly statusMessage = 'NOT FOUND';

  /**
   * Create an instance of HttpResponseNotFound.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseNotFound
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseNotFound.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseNotFound} - True if the error is an instance of HttpResponseNotFound. False otherwise.
 */
export function isHttpResponseNotFound(obj: any): obj is HttpResponseNotFound {
  return obj instanceof HttpResponseNotFound ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseNotFound === true);
}

/**
 * Represent an HTTP response with the status 405 - METHOD NOT ALLOWED.
 *
 * @export
 * @class HttpResponseMethodNotAllowed
 * @extends {HttpResponseClientError}
 */
export class HttpResponseMethodNotAllowed<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseMethodNotAllowed.
   *
   * @memberof HttpResponseMethodNotAllowed
   */
  readonly isHttpResponseMethodNotAllowed = true;
  readonly statusCode = 405;
  readonly statusMessage = 'METHOD NOT ALLOWED';

  /**
   * Create an instance of HttpResponseMethodNotAllowed.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseMethodNotAllowed
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseMethodNotAllowed.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseMethodNotAllowed} - True if the error is an instance of HttpResponseMethodNotAllowed.
 * False otherwise.
 */
export function isHttpResponseMethodNotAllowed(obj: any): obj is HttpResponseMethodNotAllowed {
  return obj instanceof HttpResponseMethodNotAllowed ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseMethodNotAllowed === true);
}

/**
 * Represent an HTTP response with the status 409 - CONFLICT.
 *
 * @export
 * @class HttpResponseConflict
 * @extends {HttpResponseClientError}
 */
export class HttpResponseConflict<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseConflict.
   *
   * @memberof HttpResponseConflict
   */
  readonly isHttpResponseConflict = true;
  readonly statusCode = 409;
  readonly statusMessage = 'CONFLICT';

  /**
   * Create an instance of HttpResponseConflict.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseConflict
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseConflict.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseConflict} - True if the error is an instance of HttpResponseConflict. False otherwise.
 */
export function isHttpResponseConflict(obj: any): obj is HttpResponseConflict {
  return obj instanceof HttpResponseConflict ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseConflict === true);
}

/**
 * Represent an HTTP response with the status 429 - TOO MANY REQUESTS.
 *
 * @export
 * @class HttpResponseTooManyRequests
 * @extends {HttpResponseClientError}
 */
export class HttpResponseTooManyRequests<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseTooManyRequests.
   *
   * @memberof HttpResponseTooManyRequests
   */
  readonly isHttpResponseTooManyRequests = true;
  readonly statusCode = 429;
  readonly statusMessage = 'TOO MANY REQUESTS';

  /**
   * Create an instance of HttpResponseTooManyRequests.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseTooManyRequests
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseTooManyRequests.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseTooManyRequests} - True if the error is an instance of HttpResponseTooManyRequests.
 * False otherwise.
 */
export function isHttpResponseTooManyRequests(obj: any): obj is HttpResponseTooManyRequests {
  return obj instanceof HttpResponseTooManyRequests ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseTooManyRequests === true);
}

/* 5xx Server Error */

/**
 * Represent an HTTP response with a server error status 5xx.
 *
 * @export
 * @abstract
 * @class HttpResponseServerError
 * @extends {HttpResponse}
 */
export abstract class HttpResponseServerError<T = any> extends HttpResponse<T> {
  /**
   * Property used internally by isHttpResponseServerError.
   *
   * @memberof HttpResponseServerError
   */
  readonly isHttpResponseServerError = true;
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseServerError.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseServerError} - True if the error is an instance of HttpResponseServerError.
 * False otherwise.
 */
export function isHttpResponseServerError(obj: any): obj is HttpResponseServerError {
  return obj instanceof HttpResponseServerError ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseServerError === true);
}

/**
 * Represent an HTTP response with the status 500 - INTERNAL SERVER ERROR.
 *
 * @export
 * @class HttpResponseInternalServerError
 * @extends {HttpResponseServerError}
 */
export class HttpResponseInternalServerError<T = any> extends HttpResponseServerError<T> {
  /**
   * Property used internally by isHttpResponseInternalServerError.
   *
   * @memberof HttpResponseInternalServerError
   */
  readonly isHttpResponseInternalServerError = true;
  readonly error?: Error;
  readonly ctx?: Context;
  readonly statusCode = 500;
  readonly statusMessage = 'INTERNAL SERVER ERROR';

  /**
   * Create an instance of HttpResponseInternalServerError.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseInternalServerError
   */
  constructor(body?: T, options: { stream?: boolean, error?: Error, ctx?: Context } = {}) {
    super(body, options);
    this.error = options.error;
    this.ctx = options.ctx;
  }
}

/**
 * Check if an object is an instance of HttpResponseInternalServerError.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseInternalServerError} - True if the error is an instance of
 * HttpResponseInternalServerError. False otherwise.
 */
export function isHttpResponseInternalServerError(obj: any): obj is HttpResponseInternalServerError {
  return obj instanceof HttpResponseInternalServerError ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseInternalServerError === true);
}

/**
 * Represent an HTTP response with the status 501 - NOT IMPLEMENTED.
 *
 * @export
 * @class HttpResponseNotImplemented
 * @extends {HttpResponseServerError}
 */
export class HttpResponseNotImplemented<T = any> extends HttpResponseServerError<T> {
  /**
   * Property used internally by isHttpResponseNotImplemented.
   *
   * @memberof HttpResponseNotImplemented
   */
  readonly isHttpResponseNotImplemented = true;
  readonly statusCode = 501;
  readonly statusMessage = 'NOT IMPLEMENTED';

  /**
   * Create an instance of HttpResponseNotImplemented.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseNotImplemented
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseNotImplemented.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseNotImplemented} - True if the error is an instance of HttpResponseNotImplemented.
 * False otherwise.
 */
export function isHttpResponseNotImplemented(obj: any): obj is HttpResponseNotImplemented {
  return obj instanceof HttpResponseNotImplemented ||
   (typeof obj === 'object' && obj !== null && obj.isHttpResponseNotImplemented === true);
}
