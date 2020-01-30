// 3p
import {
  Config, Hook, HookDecorator,
  HttpResponseBadRequest, HttpResponseUnauthorized
} from '@foal/core';
import { decode, verify, VerifyOptions } from 'jsonwebtoken';

// FoalTS
import { JWT_DEFAULT_COOKIE_NAME } from './constants';
import { isInvalidTokenError } from './invalid-token.error';

class InvalidTokenResponse extends HttpResponseUnauthorized {

  constructor(description: string) {
    super({ code: 'invalid_token', description });
    this.setHeader(
      'WWW-Authenticate',
      `error="invalid_token", error_description="${description}"`
    );
  }

}

class InvalidRequestResponse extends HttpResponseBadRequest {

  constructor(description: string) {
    super({ code: 'invalid_request', description });
  }

}

/**
 * Options of the hooks created by JWTRequired and JWTOptional.
 *
 * @export
 * @interface JWTOptions
 */
export interface JWTOptions {
  user?: (id: string|number) => Promise<any|undefined>;
  secretOrPublicKey?: (header: any, payload: any) => Promise<string>;
  blackList?: (token: string) => boolean|Promise<boolean>;
  cookie?: boolean;
  /**
   * Add openapi metadata to the class or class method.
   *
   * @type {boolean}
   * @memberof JWTOptions
   */
  openapi?: boolean;
}

/**
 * Sub-function used by JWTRequired and JWTOptional to avoid code duplication.
 *
 * @export
 * @param {boolean} required
 * @param {JWTOptions} options
 * @param {VerifyOptions} verifyOptions
 * @returns {HookDecorator}
 */
export function JWT(required: boolean, options: JWTOptions, verifyOptions: VerifyOptions): HookDecorator {
  return Hook(async (ctx, services) => {
    const config = services.get(Config);

    let token: string;
    if (options.cookie) {
      const cookieName = config.get<string>('settings.jwt.cookieName', JWT_DEFAULT_COOKIE_NAME);
      const content = ctx.request.cookies[cookieName] as string|undefined;

      if (!content) {
        if (!required) {
          return;
        }
        return new InvalidRequestResponse('Auth cookie not found.');
      }

      token = content;
    } else {
      const authorizationHeader = ctx.request.get('Authorization') as string|undefined || '';

      if (!authorizationHeader) {
        if (!required) {
          return;
        }
        return new InvalidRequestResponse('Authorization header not found.');
      }

      const content = authorizationHeader.split('Bearer ')[1] as string|undefined;
      if (!content) {
        return new InvalidRequestResponse('Expected a bearer token. Scheme is Authorization: Bearer <token>.');
      }

      token = content;
    }

    if (options.blackList && await options.blackList(token)) {
      return new InvalidTokenResponse('jwt revoked');
    }

    const parts = token.split('.');

    if (parts.length !== 3) {
      return new InvalidTokenResponse('jwt malformed');
    }

    let decoded: null | { header: any, payload: any };
    try {
      decoded = decode(token, { complete: true }) as null | { header: any, payload: any };
    } catch (error) {
      return new InvalidTokenResponse(error.message);
    }
    if (!decoded) {
      return new InvalidTokenResponse('invalid token');
    }

    let secretOrPublicKey: string|undefined;
    if (options.secretOrPublicKey) {
      try {
        secretOrPublicKey = await options.secretOrPublicKey(decoded.header, decoded.payload);
      } catch (error) {
        if (isInvalidTokenError(error)) {
          return new InvalidTokenResponse(error.message);
        }
        throw error;
      }
    } else {
      secretOrPublicKey = config.get<string|undefined>('settings.jwt.secretOrPublicKey');
    }
    if (secretOrPublicKey === undefined) {
      throw new Error(
        '[CONFIG] You must provide a secret or public key with the configuration key settings.jwt.secretOrPublicKey.'
      );
    }

    let payload: any;
    try {
      payload = await new Promise((resolve, reject) => {
        verify(token, secretOrPublicKey as string, verifyOptions, (err, value) => {
          if (err) { reject(err); } else { resolve(value); }
        });
      });
    } catch (error) {
      return new InvalidTokenResponse(error.message);
    }

    if (!options.user) {
      ctx.user = payload;
      return;
    }

    if (typeof payload.sub !== 'string') {
      return new InvalidTokenResponse('The token must include a subject which is the id of the user.');
    }

    const user = await options.user(payload.sub);
    if (!user) {
      return new InvalidTokenResponse('The token subject does not match any user.');
    }

    ctx.user = user;
  });
}
