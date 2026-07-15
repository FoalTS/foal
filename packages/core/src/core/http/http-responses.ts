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

/* 1xx Informational */

/**
 * Represent an HTTP response with an informational status 1xx.
 *
 * @export
 * @abstract
 * @class HttpResponseInformational
 * @extends {HttpResponse}
 */
export abstract class HttpResponseInformational<T = any> extends HttpResponse<T> {
  /**
   * Property used internally by isHttpResponseInformational.
   *
   * @memberof HttpResponseInformational
   */
  readonly isHttpResponseInformational = true;

  /**
   * Create an instance of HttpResponseInformational.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseInformational
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseInformational.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseInformational} - True if the error is an instance of HttpResponseInformational.
 * False otherwise.
 */
export function isHttpResponseInformational(obj: any): obj is HttpResponseInformational {
  return obj instanceof HttpResponseInformational ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseInformational === true);
}

/**
 * Represent an HTTP response with the status 100 - CONTINUE.
 *
 * @export
 * @class HttpResponseContinue
 * @extends {HttpResponseInformational}
 */
export class HttpResponseContinue extends HttpResponseInformational {
  /**
   * Property used internally by isHttpResponseContinue.
   *
   * @memberof HttpResponseContinue
   */
  readonly isHttpResponseContinue = true;
  readonly statusCode = 100;
  readonly statusMessage = 'CONTINUE';

  /**
   * Create an instance of HttpResponseContinue.
   * @memberof HttpResponseContinue
   */
  constructor() {
    super();
  }
}

/**
 * Check if an object is an instance of HttpResponseContinue.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseContinue} - True if the error is an instance of HttpResponseContinue. False otherwise.
 */
export function isHttpResponseContinue(obj: any): obj is HttpResponseContinue {
  return obj instanceof HttpResponseContinue ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseContinue === true);
}

/**
 * Represent an HTTP response with the status 101 - SWITCHING PROTOCOLS.
 *
 * @export
 * @class HttpResponseSwitchingProtocols
 * @extends {HttpResponseInformational}
 */
export class HttpResponseSwitchingProtocols extends HttpResponseInformational {
  /**
   * Property used internally by isHttpResponseSwitchingProtocols.
   *
   * @memberof HttpResponseSwitchingProtocols
   */
  readonly isHttpResponseSwitchingProtocols = true;
  readonly statusCode = 101;
  readonly statusMessage = 'SWITCHING PROTOCOLS';

  /**
   * Create an instance of HttpResponseSwitchingProtocols.
   * @memberof HttpResponseSwitchingProtocols
   */
  constructor() {
    super();
  }
}

/**
 * Check if an object is an instance of HttpResponseSwitchingProtocols.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseSwitchingProtocols} - True if the error is an instance of
 * HttpResponseSwitchingProtocols. False otherwise.
 */
export function isHttpResponseSwitchingProtocols(obj: any): obj is HttpResponseSwitchingProtocols {
  return obj instanceof HttpResponseSwitchingProtocols ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseSwitchingProtocols === true);
}

/**
 * Represent an HTTP response with the status 102 - PROCESSING.
 *
 * @export
 * @class HttpResponseProcessing
 * @extends {HttpResponseInformational}
 */
export class HttpResponseProcessing extends HttpResponseInformational {
  /**
   * Property used internally by isHttpResponseProcessing.
   *
   * @memberof HttpResponseProcessing
   */
  readonly isHttpResponseProcessing = true;
  readonly statusCode = 102;
  readonly statusMessage = 'PROCESSING';

  /**
   * Create an instance of HttpResponseProcessing.
   * @memberof HttpResponseProcessing
   */
  constructor() {
    super();
  }
}

/**
 * Check if an object is an instance of HttpResponseProcessing.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseProcessing} - True if the error is an instance of HttpResponseProcessing.
 * False otherwise.
 */
export function isHttpResponseProcessing(obj: any): obj is HttpResponseProcessing {
  return obj instanceof HttpResponseProcessing ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseProcessing === true);
}

/**
 * Represent an HTTP response with the status 103 - EARLY HINTS.
 *
 * @export
 * @class HttpResponseEarlyHints
 * @extends {HttpResponseInformational}
 */
export class HttpResponseEarlyHints extends HttpResponseInformational {
  /**
   * Property used internally by isHttpResponseEarlyHints.
   *
   * @memberof HttpResponseEarlyHints
   */
  readonly isHttpResponseEarlyHints = true;
  readonly statusCode = 103;
  readonly statusMessage = 'EARLY HINTS';

  /**
   * Create an instance of HttpResponseEarlyHints.
   * @memberof HttpResponseEarlyHints
   */
  constructor() {
    super();
  }
}

/**
 * Check if an object is an instance of HttpResponseEarlyHints.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseEarlyHints} - True if the error is an instance of HttpResponseEarlyHints.
 * False otherwise.
 */
export function isHttpResponseEarlyHints(obj: any): obj is HttpResponseEarlyHints {
  return obj instanceof HttpResponseEarlyHints ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseEarlyHints === true);
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
 * Represent an HTTP response with the status 203 - NON-AUTHORITATIVE INFORMATION.
 *
 * @export
 * @class HttpResponseNonAuthoritativeInformation
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseNonAuthoritativeInformation<T = any> extends HttpResponseSuccess<T> {
  /**
   * Property used internally by isHttpResponseNonAuthoritativeInformation.
   *
   * @memberof HttpResponseNonAuthoritativeInformation
   */
  readonly isHttpResponseNonAuthoritativeInformation = true;
  readonly statusCode = 203;
  readonly statusMessage = 'NON-AUTHORITATIVE INFORMATION';

  /**
   * Create an instance of HttpResponseNonAuthoritativeInformation.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseNonAuthoritativeInformation
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseNonAuthoritativeInformation.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseNonAuthoritativeInformation} - True if the error is an instance of
 * HttpResponseNonAuthoritativeInformation. False otherwise.
 */
export function isHttpResponseNonAuthoritativeInformation(obj: any): obj is HttpResponseNonAuthoritativeInformation {
  return obj instanceof HttpResponseNonAuthoritativeInformation ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseNonAuthoritativeInformation === true);
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

/**
 * Represent an HTTP response with the status 205 - RESET CONTENT.
 *
 * @export
 * @class HttpResponseResetContent
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseResetContent extends HttpResponseSuccess {
  /**
   * Property used internally by isHttpResponseResetContent.
   *
   * @memberof HttpResponseResetContent
   */
  readonly isHttpResponseResetContent = true;
  readonly statusCode = 205;
  readonly statusMessage = 'RESET CONTENT';

  /**
   * Create an instance of HttpResponseResetContent.
   * @memberof HttpResponseResetContent
   */
  constructor() {
    super();
  }
}

/**
 * Check if an object is an instance of HttpResponseResetContent.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseResetContent} - True if the error is an instance of HttpResponseResetContent.
 * False otherwise.
 */
export function isHttpResponseResetContent(obj: any): obj is HttpResponseResetContent {
  return obj instanceof HttpResponseResetContent ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseResetContent === true);
}

/**
 * Represent an HTTP response with the status 206 - PARTIAL CONTENT.
 *
 * @export
 * @class HttpResponsePartialContent
 * @extends {HttpResponseSuccess}
 */
export class HttpResponsePartialContent<T = any> extends HttpResponseSuccess<T> {
  /**
   * Property used internally by isHttpResponsePartialContent.
   *
   * @memberof HttpResponsePartialContent
   */
  readonly isHttpResponsePartialContent = true;
  readonly statusCode = 206;
  readonly statusMessage = 'PARTIAL CONTENT';

  /**
   * Create an instance of HttpResponsePartialContent.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponsePartialContent
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponsePartialContent.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponsePartialContent} - True if the error is an instance of HttpResponsePartialContent.
 * False otherwise.
 */
export function isHttpResponsePartialContent(obj: any): obj is HttpResponsePartialContent {
  return obj instanceof HttpResponsePartialContent ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponsePartialContent === true);
}

/**
 * Represent an HTTP response with the status 207 - MULTI-STATUS.
 *
 * @export
 * @class HttpResponseMultiStatus
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseMultiStatus<T = any> extends HttpResponseSuccess<T> {
  /**
   * Property used internally by isHttpResponseMultiStatus.
   *
   * @memberof HttpResponseMultiStatus
   */
  readonly isHttpResponseMultiStatus = true;
  readonly statusCode = 207;
  readonly statusMessage = 'MULTI-STATUS';

  /**
   * Create an instance of HttpResponseMultiStatus.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseMultiStatus
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseMultiStatus.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseMultiStatus} - True if the error is an instance of HttpResponseMultiStatus.
 * False otherwise.
 */
export function isHttpResponseMultiStatus(obj: any): obj is HttpResponseMultiStatus {
  return obj instanceof HttpResponseMultiStatus ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseMultiStatus === true);
}

/**
 * Represent an HTTP response with the status 208 - ALREADY REPORTED.
 *
 * @export
 * @class HttpResponseAlreadyReported
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseAlreadyReported<T = any> extends HttpResponseSuccess<T> {
  /**
   * Property used internally by isHttpResponseAlreadyReported.
   *
   * @memberof HttpResponseAlreadyReported
   */
  readonly isHttpResponseAlreadyReported = true;
  readonly statusCode = 208;
  readonly statusMessage = 'ALREADY REPORTED';

  /**
   * Create an instance of HttpResponseAlreadyReported.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseAlreadyReported
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseAlreadyReported.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseAlreadyReported} - True if the error is an instance of HttpResponseAlreadyReported.
 * False otherwise.
 */
export function isHttpResponseAlreadyReported(obj: any): obj is HttpResponseAlreadyReported {
  return obj instanceof HttpResponseAlreadyReported ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseAlreadyReported === true);
}

/**
 * Represent an HTTP response with the status 226 - IM USED.
 *
 * @export
 * @class HttpResponseIMUsed
 * @extends {HttpResponseSuccess}
 */
export class HttpResponseIMUsed<T = any> extends HttpResponseSuccess<T> {
  /**
   * Property used internally by isHttpResponseIMUsed.
   *
   * @memberof HttpResponseIMUsed
   */
  readonly isHttpResponseIMUsed = true;
  readonly statusCode = 226;
  readonly statusMessage = 'IM USED';

  /**
   * Create an instance of HttpResponseIMUsed.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseIMUsed
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseIMUsed.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseIMUsed} - True if the error is an instance of HttpResponseIMUsed.
 * False otherwise.
 */
export function isHttpResponseIMUsed(obj: any): obj is HttpResponseIMUsed {
  return obj instanceof HttpResponseIMUsed ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseIMUsed === true);
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
 * Represent an HTTP response with the status 300 - MULTIPLE CHOICES.
 *
 * @export
 * @class HttpResponseMultipleChoices
 * @extends {HttpResponseRedirection}
 */
export class HttpResponseMultipleChoices<T = any> extends HttpResponseRedirection<T> {
  /**
   * Property used internally by isHttpResponseMultipleChoices.
   *
   * @memberof HttpResponseMultipleChoices
   */
  readonly isHttpResponseMultipleChoices = true;
  readonly statusCode = 300;
  readonly statusMessage = 'MULTIPLE CHOICES';

  /**
   * Create an instance of HttpResponseMultipleChoices.
   * @param {string} path - The redirection path.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseMultipleChoices
   */
  constructor(public path: string, body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseMultipleChoices.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseMultipleChoices} - True if the error is an
 * instance of HttpResponseMultipleChoices. False otherwise.
 */
export function isHttpResponseMultipleChoices(obj: any): obj is HttpResponseMultipleChoices {
  return obj instanceof HttpResponseMultipleChoices ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseMultipleChoices === true);
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

/**
 * Represent an HTTP response with the status 303 - SEE OTHER.
 *
 * @export
 * @class HttpResponseSeeOther
 * @extends {HttpResponseRedirection}
 */
export class HttpResponseSeeOther<T = any> extends HttpResponseRedirection<T> {
  /**
   * Property used internally by isHttpResponseSeeOther.
   *
   * @memberof HttpResponseSeeOther
   */
  readonly isHttpResponseSeeOther = true;
  readonly statusCode = 303;
  readonly statusMessage = 'SEE OTHER';

  /**
   * Create an instance of HttpResponseSeeOther.
   * @param {string} path - The redirection path.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseSeeOther
   */
  constructor(public path: string, body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseSeeOther.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseSeeOther} - True if the error is an instance of HttpResponseSeeOther.
 * False otherwise.
 */
export function isHttpResponseSeeOther(obj: any): obj is HttpResponseSeeOther {
  return obj instanceof HttpResponseSeeOther ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseSeeOther === true);
}

/**
 * Represent an HTTP response with the status 304 - NOT MODIFIED.
 *
 * @export
 * @class HttpResponseNotModified
 * @extends {HttpResponseRedirection}
 */
export class HttpResponseNotModified extends HttpResponseRedirection {
  /**
   * Property used internally by isHttpResponseNotModified.
   *
   * @memberof HttpResponseNotModified
   */
  readonly isHttpResponseNotModified = true;
  readonly statusCode = 304;
  readonly statusMessage = 'NOT MODIFIED';

  /**
   * Create an instance of HttpResponseNotModified.
   * @memberof HttpResponseNotModified
   */
  constructor() {
    super();
  }
}

/**
 * Check if an object is an instance of HttpResponseNotModified.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseNotModified} - True if the error is an instance of HttpResponseNotModified.
 * False otherwise.
 */
export function isHttpResponseNotModified(obj: any): obj is HttpResponseNotModified {
  return obj instanceof HttpResponseNotModified ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseNotModified === true);
}

/**
 * Represent an HTTP response with the status 307 - TEMPORARY REDIRECT.
 *
 * @export
 * @class HttpResponseTemporaryRedirect
 * @extends {HttpResponseRedirection}
 */
export class HttpResponseTemporaryRedirect<T = any> extends HttpResponseRedirection<T> {
  /**
   * Property used internally by isHttpResponseTemporaryRedirect.
   *
   * @memberof HttpResponseTemporaryRedirect
   */
  readonly isHttpResponseTemporaryRedirect = true;
  readonly statusCode = 307;
  readonly statusMessage = 'TEMPORARY REDIRECT';

  /**
   * Create an instance of HttpResponseTemporaryRedirect.
   * @param {string} path - The redirection path.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseTemporaryRedirect
   */
  constructor(public path: string, body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseTemporaryRedirect.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseTemporaryRedirect} - True if the error is an instance of
 * HttpResponseTemporaryRedirect. False otherwise.
 */
export function isHttpResponseTemporaryRedirect(obj: any): obj is HttpResponseTemporaryRedirect {
  return obj instanceof HttpResponseTemporaryRedirect ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseTemporaryRedirect === true);
}

/**
 * Represent an HTTP response with the status 308 - PERMANENT REDIRECT.
 *
 * @export
 * @class HttpResponsePermanentRedirect
 * @extends {HttpResponseRedirection}
 */
export class HttpResponsePermanentRedirect<T = any> extends HttpResponseRedirection<T> {
  /**
   * Property used internally by isHttpResponsePermanentRedirect.
   *
   * @memberof HttpResponsePermanentRedirect
   */
  readonly isHttpResponsePermanentRedirect = true;
  readonly statusCode = 308;
  readonly statusMessage = 'PERMANENT REDIRECT';

  /**
   * Create an instance of HttpResponsePermanentRedirect.
   * @param {string} path - The redirection path.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponsePermanentRedirect
   */
  constructor(public path: string, body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponsePermanentRedirect.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponsePermanentRedirect} - True if the error is an instance of
 * HttpResponsePermanentRedirect. False otherwise.
 */
export function isHttpResponsePermanentRedirect(obj: any): obj is HttpResponsePermanentRedirect {
  return obj instanceof HttpResponsePermanentRedirect ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponsePermanentRedirect === true);
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
 * Represent an HTTP response with the status 402 - PAYMENT REQUIRED.
 *
 * @export
 * @class HttpResponsePaymentRequired
 * @extends {HttpResponseClientError}
 */
export class HttpResponsePaymentRequired<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponsePaymentRequired.
   *
   * @memberof HttpResponsePaymentRequired
   */
  readonly isHttpResponsePaymentRequired = true;
  readonly statusCode = 402;
  readonly statusMessage = 'PAYMENT REQUIRED';

  /**
   * Create an instance of HttpResponsePaymentRequired.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponsePaymentRequired
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponsePaymentRequired.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponsePaymentRequired} - True if the error is an instance of HttpResponsePaymentRequired.
 * False otherwise.
 */
export function isHttpResponsePaymentRequired(obj: any): obj is HttpResponsePaymentRequired {
  return obj instanceof HttpResponsePaymentRequired ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponsePaymentRequired === true);
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
 * Represent an HTTP response with the status 406 - NOT ACCEPTABLE.
 *
 * @export
 * @class HttpResponseNotAcceptable
 * @extends {HttpResponseClientError}
 */
export class HttpResponseNotAcceptable<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseNotAcceptable.
   *
   * @memberof HttpResponseNotAcceptable
   */
  readonly isHttpResponseNotAcceptable = true;
  readonly statusCode = 406;
  readonly statusMessage = 'NOT ACCEPTABLE';

  /**
   * Create an instance of HttpResponseNotAcceptable.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseNotAcceptable
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseNotAcceptable.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseNotAcceptable} - True if the error is an instance of HttpResponseNotAcceptable.
 * False otherwise.
 */
export function isHttpResponseNotAcceptable(obj: any): obj is HttpResponseNotAcceptable {
  return obj instanceof HttpResponseNotAcceptable ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseNotAcceptable === true);
}

/**
 * Represent an HTTP response with the status 407 - PROXY AUTHENTICATION REQUIRED.
 *
 * @export
 * @class HttpResponseProxyAuthenticationRequired
 * @extends {HttpResponseClientError}
 */
export class HttpResponseProxyAuthenticationRequired<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseProxyAuthenticationRequired.
   *
   * @memberof HttpResponseProxyAuthenticationRequired
   */
  readonly isHttpResponseProxyAuthenticationRequired = true;
  readonly statusCode = 407;
  readonly statusMessage = 'PROXY AUTHENTICATION REQUIRED';

  /**
   * Create an instance of HttpResponseProxyAuthenticationRequired.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseProxyAuthenticationRequired
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
    this.setHeader('Proxy-Authenticate', '');
  }
}

/**
 * Check if an object is an instance of HttpResponseProxyAuthenticationRequired.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseProxyAuthenticationRequired} - True if the error is an instance of
 * HttpResponseProxyAuthenticationRequired. False otherwise.
 */
export function isHttpResponseProxyAuthenticationRequired(obj: any): obj is HttpResponseProxyAuthenticationRequired {
  return obj instanceof HttpResponseProxyAuthenticationRequired ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseProxyAuthenticationRequired === true);
}

/**
 * Represent an HTTP response with the status 408 - REQUEST TIMEOUT.
 *
 * @export
 * @class HttpResponseRequestTimeout
 * @extends {HttpResponseClientError}
 */
export class HttpResponseRequestTimeout<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseRequestTimeout.
   *
   * @memberof HttpResponseRequestTimeout
   */
  readonly isHttpResponseRequestTimeout = true;
  readonly statusCode = 408;
  readonly statusMessage = 'REQUEST TIMEOUT';

  /**
   * Create an instance of HttpResponseRequestTimeout.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseRequestTimeout
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseRequestTimeout.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseRequestTimeout} - True if the error is an instance of HttpResponseRequestTimeout.
 * False otherwise.
 */
export function isHttpResponseRequestTimeout(obj: any): obj is HttpResponseRequestTimeout {
  return obj instanceof HttpResponseRequestTimeout ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseRequestTimeout === true);
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
 * Represent an HTTP response with the status 410 - GONE.
 *
 * @export
 * @class HttpResponseGone
 * @extends {HttpResponseClientError}
 */
export class HttpResponseGone<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseGone.
   *
   * @memberof HttpResponseGone
   */
  readonly isHttpResponseGone = true;
  readonly statusCode = 410;
  readonly statusMessage = 'GONE';

  /**
   * Create an instance of HttpResponseGone.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseGone
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseGone.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseGone} - True if the error is an instance of HttpResponseGone. False otherwise.
 */
export function isHttpResponseGone(obj: any): obj is HttpResponseGone {
  return obj instanceof HttpResponseGone ||
    (typeof obj === 'object' && obj !== null && obj.isHttpResponseGone === true);
}

/**
 * Represent an HTTP response with the status 422 - UNPROCESSABLE CONTENT.
 *
 * @export
 * @class HttpResponseUnprocessableContent
 * @extends {HttpResponseClientError}
 */
export class HttpResponseUnprocessableContent<T = any> extends HttpResponseClientError<T> {
  /**
   * Property used internally by isHttpResponseUnprocessableContent.
   *
   * @memberof HttpResponseUnprocessableContent
   */
  readonly isHttpResponseUnprocessableContent = true;
  readonly statusCode = 422;
  readonly statusMessage = 'UNPROCESSABLE CONTENT';

  /**
   * Create an instance of HttpResponseUnprocessableContent.
   * @param {*} [body] - Optional body of the response.
   * @memberof HttpResponseUnprocessableContent
   */
  constructor(body?: T, options: { stream?: boolean } = {}) {
    super(body, options);
  }
}

/**
 * Check if an object is an instance of HttpResponseUnprocessableContent.
 *
 * This function is a help when you have several packages using @foal/core.
 * Npm can install the package several times, which leads to duplicate class
 * definitions. If this is the case, the keyword `instanceof` may return false
 * while the object is an instance of the class. This function fixes this
 * problem.
 *
 * @export
 * @param {*} obj - The object to check.
 * @returns {obj is HttpResponseUnprocessableContent} - True if the error is an instance of HttpResponseUnprocessableContent.
 * False otherwise.
 */
export function isHttpResponseUnprocessableContent(obj: any): obj is HttpResponseUnprocessableContent {
  return obj instanceof HttpResponseUnprocessableContent ||
   (typeof obj === 'object' && obj !== null && obj.isHttpResponseUnprocessableContent === true);
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
