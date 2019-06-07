// FoalTS
import { Config, CookieOptions, HttpResponse } from '../core';
import { Session } from './session';

export function setSessionCookie(response: HttpResponse, session: Session): void {
  const cookieName = Config.get('settings.session.cookieName', 'auth');
  const options: CookieOptions = {
    domain: Config.get('settings.session.cookie.domain'),
    httpOnly: Config.get('settings.session.cookie.httpOnly', true),
    maxAge: session.maxAge,
    path: Config.get('settings.session.cookie.path', '/'),
    sameSite: Config.get('settings.session.cookie.sameSite'),
    secure: Config.get('settings.session.cookie.secure')
  };
  response.setCookie(cookieName, session.getToken(), options);
}
