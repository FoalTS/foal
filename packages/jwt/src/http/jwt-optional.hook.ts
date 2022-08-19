// 3p
import { HookDecorator } from '@foal/core';

// FoalTS
import { JWT, JWTOptions, VerifyOptions } from './jwt.hook';

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
 * @param {FetchUser} [options.user] - A function that takes an id
 * and returns the corresponding user. If no user could be found, it returns undefined.
 * @param {(token: string) => boolean|Promise<boolean>} [options.blacklist] - A function that takes a token
 * and returns true or false. If the returned value is true, then the hook returns a 401 error.
 * @param {boolean} [options.cookie] - If true, the hook expects the token to be sent in a cookie
 * named `auth`. You can change the cookie name with the key `settings.jwt.cookie.name` in the configuration.
 * @param {VerifyOptions} [verifyOptions={}] - Options of the `jsonwebtoken` package.
 * @returns {HookDecorator} The hook.
 */
export function JWTOptional(options: JWTOptions = {}, verifyOptions: VerifyOptions = {}): HookDecorator {
  return JWT(false, options, verifyOptions);
}
