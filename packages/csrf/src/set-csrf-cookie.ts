import { Config, CookieOptions, HttpResponse } from '@foal/core';
import { CSRF_DEFAULT_COOKIE_NAME, CSRF_DEFAULT_COOKIE_PATH } from './constants';

/**
 * Send the CSRF token in a cookie.
 *
 * @export
 * @param {HttpResponse} response - The HTTP response
 * @param {string} csrfToken - The CSRF token
 */
export function setCsrfCookie(response: HttpResponse, csrfToken: string): void {
  const cookieName = Config.get('settings.csrf.cookie.name', 'string', CSRF_DEFAULT_COOKIE_NAME);
  const options: CookieOptions = {
    domain: Config.get('settings.csrf.cookie.domain', 'string'),
    httpOnly: false,
    path: Config.get('settings.csrf.cookie.path', 'string', CSRF_DEFAULT_COOKIE_PATH),
    sameSite: Config.get('settings.csrf.cookie.sameSite', 'string') as 'strict'|'lax'|'none'|undefined,
    secure: Config.get('settings.csrf.cookie.secure', 'boolean')
  };
  // Express does not support options.maxAge === undefined.
  const maxAge = Config.get('settings.csrf.cookie.maxAge', 'number');
  if (maxAge) {
    options.maxAge = maxAge;
  }
  response.setCookie(cookieName, csrfToken, options);
}
