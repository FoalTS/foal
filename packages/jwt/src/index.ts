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
} from './jwt-optional.hook';
export {
  JWTRequired,
} from './jwt-required.hook';
export {
  JWTOptions, VerifyOptions,
} from './jwt.hook';
export {
  removeAuthCookie,
} from './remove-auth-cookie';
export {
  setAuthCookie,
} from './set-auth-cookie';
