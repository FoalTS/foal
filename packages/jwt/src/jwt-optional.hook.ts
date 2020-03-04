// 3p
import { ApiDefineSecurityScheme, ApiResponse, Config, HookDecorator, IApiSecurityScheme } from '@foal/core';
import { VerifyOptions } from 'jsonwebtoken';

// FoalTS
import { JWT_DEFAULT_COOKIE_NAME } from './constants';
import { JWT, JWTOptions } from './jwt.hook';

/**
 * Hook factory to authenticate users using JSON Web Tokens.
 *
 * The hook does not return any error when no user could be authenticated.
 *
 * If `options.cookie` is not defined, the hook expects the JWT to be included in the
 * `Authorization` header using the `Bearer` schema. Once the token is verified and decoded,
 * `ctx.user` is set with the payload (by default) or a custom object (see `options.user`).
 *
 * The content of the header should look like the following: Authorization: Bearer <token>
 *
 * @export
 * @param {JWTOptions} [options={}] - Hook options.
 * @param {(id: string|number) => Promise<any|undefined>} [options.user] - A function that takes an id
 * and returns the corresponding user. If no user could be found, it returns undefined.
 * @param {(token: string) => boolean|Promise<boolean>} [options.blacklist] - A function that takes a token
 * and returns true or false. If the returned value is true, then the hook returns a 401 error.
 * @param {boolean} [options.cookie] - If true, the hook expects the token to be sent in a cookie
 * named `auth`. You can change the cookie name with the key `settings.jwt.cookieName` in the configuration.
 * @param {VerifyOptions} [verifyOptions={}] - Options of the `jsonwebtoken` package.
 * @returns {HookDecorator} The hook.
 */
export function JWTOptional(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator {
  return (target: any, propertyKey?: string) =>  {
    JWT(false, options, verifyOptions)(target, propertyKey);

    if (options.openapi === false ||
      (options.openapi === undefined && !Config.get2('settings.openapi.useHooks', 'boolean'))
    ) {
      return;
    }

    if (options.cookie) {
      const securityScheme: IApiSecurityScheme = {
        in: 'cookie',
        name: Config.get2('settings.jwt.cookieName', 'string', JWT_DEFAULT_COOKIE_NAME),
        type: 'apiKey',
      };
      ApiDefineSecurityScheme('cookieAuth', securityScheme)(target, propertyKey);
    } else {
      const securityScheme: IApiSecurityScheme = {
        bearerFormat: 'JWT',
        scheme: 'bearer',
        type: 'http',
      };
      ApiDefineSecurityScheme('bearerAuth', securityScheme)(target, propertyKey);
    }

    ApiResponse(401, { description: 'JWT is invalid.' })(target, propertyKey);
  };
}
