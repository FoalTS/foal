/**
 * FoalTS
 * Copyright(c) 2017-2025 Loïc Poullain
 * Released under the MIT License.
 */

export {
  AbstractProvider,
  UserInfoAndTokens,
  SocialTokens,
  InvalidStateError,
  CodeVerifierNotFound,
  TokenError,
  AuthorizationError,
  ObjectType,
} from './abstract-provider.service';
export {
  FacebookProvider,
  FacebookAuthParams,
  FacebookUserInfoParams,
} from './facebook-provider.service';
export {
  GithubProvider,
  GithubAuthParams,
} from './github-provider.service';
export {
  GoogleProvider,
  InvalidJWTError,
  GoogleAuthParams,
  GoogleUserInfo,
} from './google-provider.service';
export {
  LinkedInProvider,
  LinkedInUserInfoParams,
} from './linkedin-provider.service';
export {
  TwitterProvider,
  TwitterAuthParameter,
} from './twitter-provider.service'
export {
  UserInfoError,
} from './user-info.error';
