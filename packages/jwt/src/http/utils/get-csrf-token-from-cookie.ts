// std
import { Config, Context } from '@foal/core';

// FoalTS
import { JWT_DEFAULT_CSRF_COOKIE_NAME } from '../constants';

export function getCsrfTokenFromCookie(request: Context['request']): string|undefined {
  const csrfCookieName = Config.get('settings.jwt.csrf.cookie.name', 'string', JWT_DEFAULT_CSRF_COOKIE_NAME);
  return request.cookies[csrfCookieName];
}