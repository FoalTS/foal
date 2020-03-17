// FoalTS
import { Config, CookieOptions, HttpResponse } from '../core';
import {
  SESSION_DEFAULT_COOKIE_HTTP_ONLY, SESSION_DEFAULT_COOKIE_NAME, SESSION_DEFAULT_COOKIE_PATH
} from './constants';

/**
 * Delete the browser cookie containing the session token.
 *
 * @export
 * @param {HttpResponse} response - The HTTP response
 */
export function removeSessionCookie(response: HttpResponse): void {
  const cookieName = Config.get2('settings.session.cookie.name', 'string', SESSION_DEFAULT_COOKIE_NAME);
  const options: CookieOptions = {
    domain: Config.get2('settings.session.cookie.domain', 'string'),
    httpOnly: Config.get2('settings.session.cookie.httpOnly', 'boolean', SESSION_DEFAULT_COOKIE_HTTP_ONLY),
    maxAge: 0,
    path: Config.get2('settings.session.cookie.path', 'string', SESSION_DEFAULT_COOKIE_PATH),
    sameSite: Config.get2('settings.session.cookie.sameSite', 'string') as 'strict'|'lax'|'none'|undefined,
    secure: Config.get2('settings.session.cookie.secure', 'boolean')
  };
  response.setCookie(cookieName, '', options);
}
