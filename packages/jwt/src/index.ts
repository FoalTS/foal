/**
 * FoalTS
 * Copyright(c) 2017-2022 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

export {
  getSecretOrPrivateKey,
  getSecretOrPublicKey,
} from './core';
export {
  InvalidTokenError,
  isInvalidTokenError,
  JWTOptional,
  JWTRequired,
  JWTOptions, VerifyOptions,
  removeAuthCookie,
  setAuthCookie,
} from './http';
