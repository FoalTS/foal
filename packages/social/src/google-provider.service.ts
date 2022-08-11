// FoalTS
import { convertBase64urlToBase64 } from '@foal/core';
import { AbstractProvider, SocialTokens } from './abstract-provider.service';

export interface GoogleAuthParams {
  nonce?: string;
  prompt?: string;
  display?: string;
  login_hint?: string;
  access_type?: 'offline'|'online';
  include_granted_scopes?: true|false;
  'openid.realm'?: string;
  hd?: string;
}

export class InvalidJWTError extends Error {
  readonly name = 'InvalidJWTError';
}

/**
 * Google social provider.
 *
 * @export
 * @class GoogleProvider
 * @extends {AbstractProvider<GoogleAuthParams, never>}
 */
export class GoogleProvider extends AbstractProvider<GoogleAuthParams, never> {
  protected configPaths = {
    clientId: 'settings.social.google.clientId',
    clientSecret: 'settings.social.google.clientSecret',
    redirectUri: 'settings.social.google.redirectUri',
  };
  protected authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  protected tokenEndpoint = 'https://oauth2.googleapis.com/token';

  protected defaultScopes: string[] = [ 'openid', 'profile', 'email' ];

  getUserInfoFromTokens(tokens: SocialTokens): object {
    try {
      const encodedPayload = tokens.id_token.split('.')[1];
      const decodedPayload = Buffer.from(convertBase64urlToBase64(encodedPayload), 'base64')
        .toString('utf8');
      return JSON.parse(decodedPayload);
    } catch (error: any) {
      throw new InvalidJWTError(`The ID token returned by Google is not a valid JWT: ${error.message}.`);
    }
  }

}
