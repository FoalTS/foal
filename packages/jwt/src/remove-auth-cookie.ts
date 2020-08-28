import { Config, CookieOptions, HttpResponse } from '@foal/core';
import {
  JWT_DEFAULT_COOKIE_NAME,
  JWT_DEFAULT_COOKIE_PATH,
  JWT_DEFAULT_CSRF_COOKIE_NAME,
  JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED
} from './constants';

export function removeAuthCookie(response: HttpResponse): void {
  const cookieName = Config.get('settings.jwt.cookie.name', 'string', JWT_DEFAULT_COOKIE_NAME);

  const csrfEnabled = Config.get('settings.jwt.csrf.enabled', 'boolean', false);
  let sameSite = Config.get('settings.jwt.cookie.sameSite', 'string') as 'strict'|'lax'|'none'|undefined;
  if (csrfEnabled && sameSite === undefined) {
    sameSite = JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED;
  }

  const options: CookieOptions = {
    domain: Config.get('settings.jwt.cookie.domain', 'string'),
    maxAge: 0,
    path: Config.get('settings.jwt.cookie.path', 'string', JWT_DEFAULT_COOKIE_PATH),
    sameSite,
    secure: Config.get('settings.jwt.cookie.secure', 'boolean'),
  };

  response.setCookie(cookieName, '', {
    ...options,
    httpOnly: Config.get('settings.jwt.cookie.httpOnly', 'boolean'),
  });

  if (csrfEnabled) {
    const csrfCookieName = Config.get('settings.jwt.csrf.cookie.name', 'string', JWT_DEFAULT_CSRF_COOKIE_NAME);
    response.setCookie(csrfCookieName, '', {
      ...options,
      httpOnly: false,
    });
  }
}
