// FoalTS
import { Config, CookieOptions, HttpResponse } from '../core';
import {
  SESSION_DEFAULT_COOKIE_HTTP_ONLY, SESSION_DEFAULT_COOKIE_NAME, SESSION_DEFAULT_COOKIE_PATH
} from './constants';
import { SessionStore } from './session-store';

export function setSessionCookie(response: HttpResponse, token: string): void {
  const cookieName = Config.get('settings.session.cookie.name', SESSION_DEFAULT_COOKIE_NAME);
  const options: CookieOptions = {
    domain: Config.get('settings.session.cookie.domain'),
    httpOnly: Config.get('settings.session.cookie.httpOnly', SESSION_DEFAULT_COOKIE_HTTP_ONLY),
    maxAge: SessionStore.getExpirationTimeouts().inactivity,
    path: Config.get('settings.session.cookie.path', SESSION_DEFAULT_COOKIE_PATH),
    sameSite: Config.get('settings.session.cookie.sameSite'),
    secure: Config.get('settings.session.cookie.secure')
  };
  response.setCookie(cookieName, token, options);
}
