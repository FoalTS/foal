// 3p
import { Config, CookieOptions, generateToken, HttpResponse } from '@foal/core';
import { decode, sign } from 'jsonwebtoken';

// FoalTS
import {
  JWT_DEFAULT_COOKIE_NAME,
  JWT_DEFAULT_COOKIE_PATH,
  JWT_DEFAULT_CSRF_COOKIE_NAME,
  JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED
} from './constants';
import { getSecretOrPrivateKey } from '../core';

export async function setAuthCookie(response: HttpResponse, token: string): Promise<void> {
  const cookieName = Config.get('settings.jwt.cookie.name', 'string', JWT_DEFAULT_COOKIE_NAME);

  const csrfEnabled = Config.get('settings.jwt.csrf.enabled', 'boolean', false);
  let sameSite = Config.get('settings.jwt.cookie.sameSite', 'string') as 'strict'|'lax'|'none'|undefined;
  if (csrfEnabled && sameSite === undefined) {
    sameSite = JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED;
  }

  const options: CookieOptions = {
    domain: Config.get('settings.jwt.cookie.domain', 'string'),
    path: Config.get('settings.jwt.cookie.path', 'string', JWT_DEFAULT_COOKIE_PATH),
    sameSite,
    secure: Config.get('settings.jwt.cookie.secure', 'boolean'),
  };

  const decodedToken = decode(token, { complete: true });
  if (typeof decodedToken === 'string' || decodedToken === null) {
    throw new Error('The given token is not a valid JWT.');
  }

  const { header, payload } = decodedToken;
  if (payload.exp !== undefined) {
    options.expires = new Date(payload.exp * 1000);
  }

  response.setCookie(cookieName, token, {
    ...options,
    httpOnly: Config.get('settings.jwt.cookie.httpOnly', 'boolean'),
  });

  if (!csrfEnabled) {
    return;
  }

  const jwtOptions = {
    algorithm: header.alg
  };

  const csrfPayload: any = {
    csrfToken: await generateToken(),
    sub: payload.sub,
  };

  if (payload.exp !== undefined) {
    csrfPayload.exp = payload.exp;
  }

  const jwt = await new Promise<string>((resolve, reject) => sign(
    csrfPayload,
    getSecretOrPrivateKey(),
    jwtOptions,
    (err: Error, encoded: string) => {
      // TODO: test this line.
      if (err) {
        return reject(err);
      }
      resolve(encoded);
    }
  ));

  const csrfCookieName = Config.get('settings.jwt.csrf.cookie.name', 'string', JWT_DEFAULT_CSRF_COOKIE_NAME);
  response.setCookie(csrfCookieName, jwt, {
    ...options,
    httpOnly: false,
  });
}
