import { Config, CookieOptions, HttpResponse } from '@foal/core';
import { CSRF_DEFAULT_COOKIE_NAME, CSRF_DEFAULT_COOKIE_PATH } from './constants';

export function setCsrfCookie(response: HttpResponse, csrfToken: string): void {
  const cookieName = Config.get('settings.csrf.cookie.name', CSRF_DEFAULT_COOKIE_NAME);
  const options: CookieOptions = {
    domain: Config.get('settings.csrf.cookie.domain'),
    httpOnly: false,
    path: Config.get('settings.csrf.cookie.path', CSRF_DEFAULT_COOKIE_PATH),
    sameSite: Config.get('settings.csrf.cookie.sameSite'),
    secure: Config.get('settings.csrf.cookie.secure')
  };
  // Express does not support options.maxAge === undefined.
  const maxAge = Config.get<number|undefined>('settings.csrf.cookie.maxAge');
  if (maxAge) {
    options.maxAge = maxAge;
  }
  response.setCookie(cookieName, csrfToken, options);
}
