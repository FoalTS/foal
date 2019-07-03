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
  const cookieName = Config.get('settings.session.cookie.name', SESSION_DEFAULT_COOKIE_NAME);
  const options: CookieOptions = {
    domain: Config.get('settings.session.cookie.domain'),
    httpOnly: Config.get('settings.session.cookie.httpOnly', SESSION_DEFAULT_COOKIE_HTTP_ONLY),
    maxAge: 0,
    path: Config.get('settings.session.cookie.path', SESSION_DEFAULT_COOKIE_PATH),
    sameSite: Config.get('settings.session.cookie.sameSite'),
    secure: Config.get('settings.session.cookie.secure')
  };
  response.setCookie(cookieName, '', options);
}
