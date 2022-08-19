// 3p
import {
  ApiDefineSecurityScheme,
  ApiParameter,
  ApiResponse,
  ApiSecurityRequirement,
  Config,
  Context,
  FetchUser,
  Hook,
  HookDecorator,
  HttpResponseBadRequest,
  HttpResponseForbidden,
  HttpResponseUnauthorized,
  IApiSecurityScheme,
  ServiceManager
} from '@foal/core';
import { decode, verify } from 'jsonwebtoken';

// FoalTS
import { JWT_DEFAULT_COOKIE_NAME, JWT_DEFAULT_CSRF_COOKIE_NAME } from './constants';
import { getSecretOrPublicKey } from '../core';
import { getCsrfTokenFromRequest } from './get-csrf-token-from-request';
import { isInvalidTokenError } from './invalid-token.error';
import { getCsrfTokenFromCookie } from './utils';

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
  user?: FetchUser;
  secretOrPublicKey?: (header: any, payload: any) => Promise<string>;
  blackList?: (token: string) => boolean|Promise<boolean>;
  cookie?: boolean;
  csrf?: boolean;
  /**
   * Add openapi metadata to the class or class method.
   *
   * @type {boolean}
   * @memberof JWTOptions
   */
  openapi?: boolean;
}

export interface VerifyOptions {
  algorithms?: string[];
  audience?: string | RegExp | (string | RegExp)[];
  complete?: boolean;
  issuer?: string | string[];
  ignoreExpiration?: boolean;
  ignoreNotBefore?: boolean;
  subject?: string;
  clockTolerance?: number;
  maxAge?: string|number;
  clockTimestamp?: number;
  nonce?: string;
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
  async function hook(ctx: Context, services: ServiceManager) {
    let token: string;
    if (options.cookie) {
      const cookieName = Config.get('settings.jwt.cookie.name', 'string', JWT_DEFAULT_COOKIE_NAME);
      const content = ctx.request.cookies[cookieName] as string|undefined;

      if (!content) {
        if (!required) {
          return;
        }
        return new InvalidRequestResponse('Auth cookie not found.');
      }

      token = content;
    } else {
      const authorizationHeader = ctx.request.get('Authorization') || '';

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
    } catch (error: any) {
      return new InvalidTokenResponse(error.message);
    }
    if (!decoded) {
      return new InvalidTokenResponse('invalid token');
    }

    let secretOrPublicKey: string|Buffer;
    if (options.secretOrPublicKey) {
      try {
        secretOrPublicKey = await options.secretOrPublicKey(decoded.header, decoded.payload);
      } catch (error: any) {
        if (isInvalidTokenError(error)) {
          return new InvalidTokenResponse(error.message);
        }
        throw error;
      }
    } else {
      secretOrPublicKey = getSecretOrPublicKey();
    }

    let payload: any;
    try {
      payload = await new Promise((resolve, reject) => {
        verify(token, secretOrPublicKey, verifyOptions, (err: any, value: object | undefined) => {
          if (err) { reject(err); } else { resolve(value); }
        });
      });
    } catch (error: any) {
      return new InvalidTokenResponse(error.message);
    }

    /* Verify CSRF token */

    if (
      options.cookie &&
      (options.csrf ?? Config.get('settings.jwt.csrf.enabled', 'boolean', false)) &&
      ![ 'GET', 'HEAD', 'OPTIONS' ].includes(ctx.request.method)
    ) {
      const expectedCsrftoken = getCsrfTokenFromCookie(ctx.request);
      if (!expectedCsrftoken) {
        return new HttpResponseForbidden('CSRF token missing or incorrect.');
      }

      try {
        const csrfPayload: any = await new Promise((resolve, reject) => {
          verify(expectedCsrftoken, secretOrPublicKey, (err: any, value: object | undefined) => {
            if (err) { reject(err); } else { resolve(value); }
          });
        });
        if (csrfPayload.sub !== payload.sub) {
          return new HttpResponseForbidden('CSRF token missing or incorrect.');
        }
      } catch {
        return new HttpResponseForbidden('CSRF token missing or incorrect.');
      }

      const actualCsrfToken = getCsrfTokenFromRequest(ctx.request);
      if (actualCsrfToken !== expectedCsrftoken) {
        return new HttpResponseForbidden('CSRF token missing or incorrect.');
      }
    }

    /* Set ctx.user */

    if (!options.user) {
      ctx.user = payload;
      return;
    }

    if (typeof payload.sub !== 'string') {
      return new InvalidTokenResponse('The token must include a subject which is the id of the user.');
    }

    const user = await options.user(payload.sub, services);
    if (!user) {
      return new InvalidTokenResponse('The token subject does not match any user.');
    }

    ctx.user = user;
  }

  const openapi = [
    required ?
      ApiResponse(401, { description: 'JWT is missing or invalid.' }) :
      ApiResponse(401, { description: 'JWT is invalid.' })
  ];

  if (options.cookie) {
    const securityScheme: IApiSecurityScheme = {
      in: 'cookie',
      name: Config.get('settings.jwt.cookie.name', 'string', JWT_DEFAULT_COOKIE_NAME),
      type: 'apiKey',
    };
    openapi.push(ApiDefineSecurityScheme('cookieAuth', securityScheme));
    if (required) {
      openapi.push(ApiSecurityRequirement({ cookieAuth: [] }));
    }
    if (Config.get('settings.jwt.csrf.enabled', 'boolean', false)) {
      openapi.push(ApiParameter({
        description: 'CSRF token',
        in: 'cookie',
        name: Config.get('settings.jwt.csrf.cookie.name', 'string', JWT_DEFAULT_CSRF_COOKIE_NAME),
      }));
      openapi.push(ApiResponse(403, { description: 'CSRF token is missing or incorrect.' }));
    }
  } else {
    const securityScheme: IApiSecurityScheme = {
      bearerFormat: 'JWT',
      scheme: 'bearer',
      type: 'http',
    };
    openapi.push(ApiDefineSecurityScheme('bearerAuth', securityScheme));
    if (required) {
      openapi.push(ApiSecurityRequirement({ bearerAuth: [] }));
    }
  }

  return Hook(hook, openapi, { openapi: options.openapi });
}
