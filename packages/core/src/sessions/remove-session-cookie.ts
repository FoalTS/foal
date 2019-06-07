// FoalTS
import { Config, CookieOptions, HttpResponse } from '../core';

export function removeSessionCookie(response: HttpResponse): void {
  const cookieName = Config.get('settings.session.cookie.name', 'auth');
  const options: CookieOptions = {
    domain: Config.get('settings.session.cookie.domain'),
    httpOnly: Config.get('settings.session.cookie.httpOnly', true),
    maxAge: 0,
    path: Config.get('settings.session.cookie.path', '/'),
    sameSite: Config.get('settings.session.cookie.sameSite'),
    secure: Config.get('settings.session.cookie.secure')
  };
  response.setCookie(cookieName, '', options);
}
