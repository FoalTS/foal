// FoalTS
import { Config, CookieOptions, HttpResponse } from '../core';
import {
  SESSION_DEFAULT_COOKIE_HTTP_ONLY, SESSION_DEFAULT_COOKIE_NAME, SESSION_DEFAULT_COOKIE_PATH
} from './constants';
import { Session } from './session';

export function setSessionCookie(response: HttpResponse, session: Session): void {
  const cookieName = Config.get('settings.session.cookieName', SESSION_DEFAULT_COOKIE_NAME);
  const options: CookieOptions = {
    domain: Config.get('settings.session.cookie.domain'),
    httpOnly: Config.get('settings.session.cookie.httpOnly', SESSION_DEFAULT_COOKIE_HTTP_ONLY),
    maxAge: session.maxAge,
    path: Config.get('settings.session.cookie.path', SESSION_DEFAULT_COOKIE_PATH),
    sameSite: Config.get('settings.session.cookie.sameSite'),
    secure: Config.get('settings.session.cookie.secure')
  };
  response.setCookie(cookieName, session.getToken(), options);
}
