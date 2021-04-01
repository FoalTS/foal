/**
 * FoalTS
 * Copyright(c) 2017-2021 Loïc Poullain <loic.poullain@centraliens.net>
 * Released under the MIT License.
 */

export {
  AbstractProvider,
  UserInfoAndTokens,
  SocialTokens,
  InvalidStateError,
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
} from './google-provider.service';
export {
  LinkedInProvider,
  LinkedInUserInfoParams,
} from './linkedin-provider.service';
export {
  UserInfoError,
} from './user-info.error';
