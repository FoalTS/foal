/**
 * FoalTS
 * Copyright(c) 2017-2022 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

export {
  getSecretOrPrivateKey,
} from './core/get-secret-or-private-key.util';
export {
  getSecretOrPublicKey,
} from './core/get-secret-or-public-key.util';
export {
  InvalidTokenError,
  isInvalidTokenError,
} from './invalid-token.error';
export {
  JWTOptional,
} from './http/jwt-optional.hook';
export {
  JWTRequired,
} from './http/jwt-required.hook';
export {
  JWTOptions, VerifyOptions,
} from './http/jwt.hook';
export {
  removeAuthCookie,
} from './http/remove-auth-cookie';
export {
  setAuthCookie,
} from './http/set-auth-cookie';
