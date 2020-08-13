// FoalTS
import { Config, CookieOptions, HttpResponse } from '../core';
import {
  SESSION_DEFAULT_COOKIE_HTTP_ONLY, SESSION_DEFAULT_COOKIE_NAME, SESSION_DEFAULT_COOKIE_PATH
} from './constants';
import { Session } from './session';

/**
 * Sends the session token in a cookie.
 *
 * @export
 * @param {HttpResponse} response - The HTTP response.
 * @param {Session} session - The session object.
 */
export function setSessionCookie(response: HttpResponse, session: Session): void {
  const cookieName = Config.get('settings.session.cookie.name', 'string', SESSION_DEFAULT_COOKIE_NAME);
  const options: CookieOptions = {
    domain: Config.get('settings.session.cookie.domain', 'string'),
    expires: new Date(session.expirationTime * 1000),
    httpOnly: Config.get('settings.session.cookie.httpOnly', 'boolean', SESSION_DEFAULT_COOKIE_HTTP_ONLY),
    path: Config.get('settings.session.cookie.path', 'string', SESSION_DEFAULT_COOKIE_PATH),
    sameSite: Config.get('settings.session.cookie.sameSite', 'string') as 'strict'|'lax'|'none'|undefined,
    secure: Config.get('settings.session.cookie.secure', 'boolean')
  };
  response.setCookie(cookieName, session.getToken(), options);
}
