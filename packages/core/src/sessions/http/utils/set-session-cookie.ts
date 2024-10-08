// FoalTS
import { Config, CookieOptions, HttpResponse } from '../../../core';
import {
  SESSION_DEFAULT_COOKIE_HTTP_ONLY,
  SESSION_DEFAULT_COOKIE_NAME,
  SESSION_DEFAULT_COOKIE_PATH,
  SESSION_DEFAULT_CSRF_COOKIE_NAME,
  SESSION_DEFAULT_SAME_SITE_ON_CSRF_ENABLED,
  SESSION_USER_COOKIE_NAME,
} from '../constants';
import { Session } from '../../core';

/**
 * Sends the session token in a cookie.
 *
 * If the CSRF protection is enabled, it also sends the CSRF token in a CSRF cookie.
 *
 * If a "user" argument is provided, it also sends its value in a "user" cookie.
 *
 * @export
 * @param {HttpResponse} response - The HTTP response.
 * @param {Session} session - The session object.
 * @param {string} [user] - The content of the "user" cookie if any.
 */
export function setSessionCookie(response: HttpResponse, session: Session, user?: string): void {
  const cookieName = Config.get('settings.session.cookie.name', 'string', SESSION_DEFAULT_COOKIE_NAME);

  const csrfEnabled = Config.get('settings.session.csrf.enabled', 'boolean', false);
  let sameSite = Config.get('settings.session.cookie.sameSite', 'string') as 'strict'|'lax'|'none'|undefined;
  if (csrfEnabled && sameSite === undefined) {
    sameSite = SESSION_DEFAULT_SAME_SITE_ON_CSRF_ENABLED;
  }

  const options: CookieOptions = {
    domain: Config.get('settings.session.cookie.domain', 'string'),
    expires: new Date(session.expirationTime * 1000),
    path: Config.get('settings.session.cookie.path', 'string', SESSION_DEFAULT_COOKIE_PATH),
    sameSite,
    secure: Config.get('settings.session.cookie.secure', 'boolean')
  };

  response.setCookie(cookieName, session.getToken(), {
    ...options,
    httpOnly: Config.get('settings.session.cookie.httpOnly', 'boolean', SESSION_DEFAULT_COOKIE_HTTP_ONLY),
  });

  if (csrfEnabled) {
    const csrfCookieName = Config.get('settings.session.csrf.cookie.name', 'string', SESSION_DEFAULT_CSRF_COOKIE_NAME);
    response.setCookie(csrfCookieName, session.get<string|undefined>('csrfToken') || '', {
      ...options,
      httpOnly: false,
    });
  }

  if (user) {
    response.setCookie(SESSION_USER_COOKIE_NAME, user, {
      ...options,
      httpOnly: false,
    });
  }
}
