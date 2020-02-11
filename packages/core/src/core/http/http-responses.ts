// std
import { createReadStream, exists, stat } from 'fs';
import { basename, join } from 'path';
import { promisify } from 'util';

// 3p
import { getType } from 'mime';

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
}

/**
 * Reprensent an HTTP response. This class must be extended.
 * Instances of HttpResponse are returned in hooks and controller
 * methods.
 *
 * @export
 * @abstract
 * @class HttpResponse
 */
export abstract class HttpResponse {
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
  abstract statusCode: number;
  /**
   * Status message of the response. It must follow the HTTP conventions
   * and be consistent with the statusCode property.
   *
   * @abstract
   * @type {string}
   * @memberof HttpResponse
   */
  abstract statusMessage: string;
  /**
   * Specify if the body property is a stream.
   *
   * @type {boolean}
   * @memberof HttpResponse
   */
  readonly stream: boolean = false;

  private cookies: { [key: string]: { value: string|undefined, options: CookieOptions } } = {};
  private headers: { [key: string]: string } = {};

  /**
   * Create an instance of HttpResponse.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponse
   */
  constructor(public body?: any, options: { stream?: boolean } = {}) {
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
    // tslint:disable-next-line:forin
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
export abstract class HttpResponseSuccess extends HttpResponse {
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
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseOK extends HttpResponseSuccess {
  /**
   * Property used internally by isHttpResponOK.
   *
   * @memberof HttpResponseOK
   */
  readonly isHttpResponseOK = true;
  statusCode = 200;
  statusMessage = 'OK';

  /**
   * Create an instance of HttpResponseOK.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseOK
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
 * Create an HttpResponseOK whose content is the specified file. If returned in a controller,
 * the server sends the file in streaming.
 *
 * @param {Object} options - The options used to create the HttpResponseOK.
 * @param {string} options.directory - Directory where the file is located.
 * @param {string} options.file - Name of the file with its extension. If a path is given,
 * only the basename is kept.
 * @param {boolean} [options.forceDownload=false] - Indicate if the browser should download
 * the file directly without trying to display it in the window.
 * @param {filename} [options.string=options.file] - Default name used by the browser when
 * saving the file to the disk.
 * @deprecated
 * @returns {Promise<HttpResponseOK>}
 */
export async function createHttpResponseFile(options:
  { directory: string, file: string, forceDownload?: boolean, filename?: string }
): Promise<HttpResponseOK> {
  const file = basename(options.file);
  const filePath = join(options.directory, file);
  if (!await new Promise(resolve => exists(filePath, resolve))) {
    throw new Error(`The file "${filePath}" does not exist.`);
  }

  const stats = await promisify(stat)(filePath);
  if (stats.isDirectory()) {
    throw new Error(`The directory "${filePath}" is not a file.`);
  }

  const stream = createReadStream(filePath);
  const response = new HttpResponseOK(stream, { stream: true });

  const mimeType = getType(options.file);
  if (mimeType) {
    response.setHeader('Content-Type', mimeType);
  }
  response
    .setHeader('Content-Length', stats.size.toString())
    .setHeader(
      'Content-Disposition',
      (options.forceDownload ? 'attachement' : 'inline')
      + `; filename="${options.filename || file}"`
    );

  return response;
}

/**
 * Represent an HTTP response with the status 201 - CREATED.
 *
 * @export
 * @class HttpResponseCreated
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseCreated extends HttpResponseSuccess {
  /**
   * Property used internally by isHttpResponseCreated.
   *
   * @memberof HttpResponseCreated
   */
  readonly isHttpResponseCreated = true;
  statusCode = 201;
  statusMessage = 'CREATED';

  /**
   * Create an instance of HttpResponseCreated.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseCreated
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
  statusCode = 204;
  statusMessage = 'NO CONTENT';

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
export abstract class HttpResponseRedirection extends HttpResponse {
  /**
   * Property used internally by isHttpResponseRediction.
   *
   * @memberof HttpResponseRedirection
   */
  readonly isHttpResponseRedirection = true;

  /**
   * Create an instance of HttpResponseRedirection.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseRedirection
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseRedirect extends HttpResponseRedirection {
  /**
   * Property used internally by isHttpResponseRedirect.
   *
   * @memberof HttpResponseRedirect
   */
  readonly isHttpResponseRedirect = true;
  statusCode = 302;
  statusMessage = 'FOUND';

  /**
   * Create an instance of HttpResponseRedirect.
   * @param {string} path - The redirection path.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseRedirect
   */
  constructor(public path: string, body?: any, options: { stream?: boolean } = {}) {
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
export abstract class HttpResponseClientError extends HttpResponse {
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
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseBadRequest extends HttpResponseClientError {
  /**
   * Property used internally by isHttpResponseBadRequest.
   *
   * @memberof HttpResponseBadRequest
   */
  readonly isHttpResponseBadRequest = true;
  statusCode = 400;
  statusMessage = 'BAD REQUEST';

  /**
   * Create an instance of HttpResponseBadRequest.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseBadRequest
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseUnauthorized extends HttpResponseClientError {
  /**
   * Property used internally by isHttpResponseUnauthorized.
   *
   * @memberof HttpResponseUnauthorized
   */
  readonly isHttpResponseUnauthorized = true;
  statusCode = 401;
  statusMessage = 'UNAUTHORIZED';

  /**
   * Create an instance of HttpResponseUnauthorized.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseUnauthorized
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseForbidden extends HttpResponseClientError {
  /**
   * Property used internally by isHttpResponseForbidden.
   *
   * @memberof HttpResponseForbidden
   */
  readonly isHttpResponseForbidden = true;
  statusCode = 403;
  statusMessage = 'FORBIDDEN';

  /**
   * Create an instance of HttpResponseForbidden.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseForbidden
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseNotFound extends HttpResponseClientError {
  /**
   * Property used internally by isHttpResponseNotFound.
   *
   * @memberof HttpResponseNotFound
   */
  readonly isHttpResponseNotFound = true;
  statusCode = 404;
  statusMessage = 'NOT FOUND';

  /**
   * Create an instance of HttpResponseNotFound.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseNotFound
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseMethodNotAllowed extends HttpResponseClientError {
  /**
   * Property used internally by isHttpResponseMethodNotAllowed.
   *
   * @memberof HttpResponseMethodNotAllowed
   */
  readonly isHttpResponseMethodNotAllowed = true;
  statusCode = 405;
  statusMessage = 'METHOD NOT ALLOWED';

  /**
   * Create an instance of HttpResponseMethodNotAllowed.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseMethodNotAllowed
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseConflict extends HttpResponseClientError {
  /**
   * Property used internally by isHttpResponseConflict.
   *
   * @memberof HttpResponseConflict
   */
  readonly isHttpResponseConflict = true;
  statusCode = 409;
  statusMessage = 'CONFLICT';

  /**
   * Create an instance of HttpResponseConflict.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseConflict
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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

/* 5xx Server Error */

/**
 * Represent an HTTP response with a server error status 5xx.
 *
 * @export
 * @abstract
 * @class HttpResponseServerError
 * @extends {HttpResponse}
 */
export abstract class HttpResponseServerError extends HttpResponse {
  /**
   * Property used internally by isHttpResponseServerError.
   *
   * @memberof HttpResponseServerError
   */
  readonly isHttpResponseServerError = true;
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
export class HttpResponseInternalServerError extends HttpResponseServerError {
  /**
   * Property used internally by isHttpResponseInternalServerError.
   *
   * @memberof HttpResponseInternalServerError
   */
  readonly isHttpResponseInternalServerError = true;
  statusCode = 500;
  statusMessage = 'INTERNAL SERVER ERROR';

  /**
   * Create an instance of HttpResponseInternalServerError.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseInternalServerError
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
    super(body, options);
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
export class HttpResponseNotImplemented extends HttpResponseServerError {
  /**
   * Property used internally by isHttpResponseNotImplemented.
   *
   * @memberof HttpResponseNotImplemented
   */
  readonly isHttpResponseNotImplemented = true;
  statusCode = 501;
  statusMessage = 'NOT IMPLEMENTED';

  /**
   * Create an instance of HttpResponseNotImplemented.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseNotImplemented
   */
  constructor(body?: any, options: { stream?: boolean } = {}) {
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
