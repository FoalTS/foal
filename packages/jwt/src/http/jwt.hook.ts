// 3p
import {
  ApiDefineSecurityScheme,
  ApiParameter,
  ApiResponse,
  ApiSecurityRequirement,
  Config,
  Context,
  Hook,
  HookDecorator,
  HttpResponseBadRequest,
  HttpResponseForbidden,
  HttpResponseUnauthorized,
  IApiSecurityScheme,
  Logger,
  ServiceManager
} from '@foal/core';
import { decode, verify } from 'jsonwebtoken';

// FoalTS
import { JWT_DEFAULT_COOKIE_NAME, JWT_DEFAULT_CSRF_COOKIE_NAME } from './constants';
import { checkAndConvertUserIdType } from './check-and-convert-user-id-type';
import { getJwtFromRequest, RequestValidationError } from './get-jwt-from-request';
import { getSecretOrPublicKey } from '../core';
import { isInvalidTokenError } from './invalid-token.error';
import { getCsrfTokenFromCookie, getCsrfTokenFromRequest, shouldVerifyCsrfToken } from './utils';

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
export type JWTOptions = {
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
} & (
  {
    userIdType: 'string';
    user?: (id: string, services: ServiceManager) => Promise<Context['user']>;
  } |
  {
    userIdType?: 'number';
    user?: (id: number, services: ServiceManager) => Promise<Context['user']>;
  }
);

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
    let token: string|undefined;

    try {
      token = getJwtFromRequest(ctx.request, options.cookie ? 'token-in-cookie' : 'token-in-header', required);
    } catch (error) {
      if (error instanceof RequestValidationError) {
        return new InvalidRequestResponse(error.message);
      }
      // TODO: test this.
      throw error;
    }

    if (!token) {
      return;
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

    if (shouldVerifyCsrfToken(ctx.request, options)) {
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

    const userId = checkAndConvertUserIdType(payload.sub, options.userIdType);

    const logger = services.get(Logger);
    logger.addLogContext({ userId });

    const user = await options.user(userId as never, services);
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
