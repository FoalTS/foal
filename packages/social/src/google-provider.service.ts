// 3p
import { Context, HttpResponseRedirect } from '@foal/core';

// FoalTS
import { AbstractProvider, SocialTokens, UserInfoAndTokens } from './abstract-provider.service';

export interface GoogleAuthParams {
  nonce?: string;
  prompt?: 'none'|'consent'|'select_account';
  display?: string;
  login_hint?: string;
  access_type?: 'offline'|'online';
  include_granted_scopes?: true|false;
  'openid.realm'?: string;
  hd: string;
}

export class InvalidJWTError extends Error {}

export class GoogleProvider extends AbstractProvider {
  protected configPaths = {
    clientId: 'settings.social.google.clientId',
    clientSecret: 'settings.social.google.clientSecret',
    redirectUri: 'settings.social.google.redirectUri',
  };
  protected authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  protected tokenEndpoint = 'https://oauth2.googleapis.com/token';

  protected defaultScopes: string[] = [ 'openid', 'profile', 'email' ];

  redirect({ scopes, params }: { scopes?: string[], params?: GoogleAuthParams } = {}): Promise<HttpResponseRedirect> {
    return super.redirect({ scopes, params });
  }

  getUserInfo<UserInfo>(ctx: Context): Promise<UserInfoAndTokens<UserInfo>> {
    return super.getUserInfo(ctx);
  }

  getUserInfoFromTokens(tokens: SocialTokens): object {
    try {
      const encodedPayload = tokens.id_token.split('.')[1];
      const decodedPayload = Buffer.from(encodedPayload, 'base64').toString('utf8');
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new InvalidJWTError(`The ID token returned by Google is not a valid JWT: ${error.message}.`);
    }
  }

}
