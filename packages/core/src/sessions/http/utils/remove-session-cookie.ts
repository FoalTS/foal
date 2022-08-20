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

/**
 * Deletes the browser cookie containing the session token.
 *
 * If the CSRF protection is enabled, it also deletes the CSRF cookie containing the CSRF token.
 *
 * If the `user` argument is true, it also deletes the "user" cookie.
 *
 * @export
 * @param {HttpResponse} response - The HTTP response
 * @param {boolean} [user] - Specify if the "user" cookie should be deleted.
 */
export function removeSessionCookie(response: HttpResponse, user?: boolean): void {
  const cookieName = Config.get('settings.session.cookie.name', 'string', SESSION_DEFAULT_COOKIE_NAME);

  const csrfEnabled = Config.get('settings.session.csrf.enabled', 'boolean', false);
  let sameSite = Config.get('settings.session.cookie.sameSite', 'string') as 'strict'|'lax'|'none'|undefined;
  if (csrfEnabled && sameSite === undefined) {
    sameSite = SESSION_DEFAULT_SAME_SITE_ON_CSRF_ENABLED;
  }

  const options: CookieOptions = {
    domain: Config.get('settings.session.cookie.domain', 'string'),
    maxAge: 0,
    path: Config.get('settings.session.cookie.path', 'string', SESSION_DEFAULT_COOKIE_PATH),
    sameSite,
    secure: Config.get('settings.session.cookie.secure', 'boolean'),
  };

  response.setCookie(cookieName, '', {
    ...options,
    httpOnly: Config.get('settings.session.cookie.httpOnly', 'boolean', SESSION_DEFAULT_COOKIE_HTTP_ONLY),
  });

  if (csrfEnabled) {
    const csrfCookieName = Config.get('settings.session.csrf.cookie.name', 'string', SESSION_DEFAULT_CSRF_COOKIE_NAME);
    response.setCookie(csrfCookieName, '', {
      ...options,
      httpOnly: false,
    });
  }

  if (user) {
    response.setCookie(SESSION_USER_COOKIE_NAME, '', {
      ...options,
      httpOnly: false,
    });
  }
}
