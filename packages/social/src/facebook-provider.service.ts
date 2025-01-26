// std
import { URL } from 'url';

// FoalTS
import { AbstractProvider, SocialTokens } from './abstract-provider.service';
import { UserInfoError } from './user-info.error';

export interface FacebookAuthParams {
  auth_type?: 'rerequest';
}

export interface FacebookUserInfoParams {
  fields?: string[];
}

/**
 * Facebook social provider.
 *
 * @export
 * @class FacebookProvider
 * @extends {AbstractProvider<FacebookAuthParams, FacebookUserInfoParams>}
 */
export class FacebookProvider extends AbstractProvider<FacebookAuthParams, FacebookUserInfoParams> {
  protected configPaths = {
    clientId: 'settings.social.facebook.clientId',
    clientSecret: 'settings.social.facebook.clientSecret',
    redirectUri: 'settings.social.facebook.redirectUri',
  };

  protected authEndpoint = 'https://www.facebook.com/v5.0/dialog/oauth';
  protected tokenEndpoint = 'https://graph.facebook.com/v5.0/oauth/access_token';
  protected userInfoEndpoint = 'https://graph.facebook.com/v5.0/me';

  protected fields: string[] = [ 'id', 'name', 'email' ];

  protected defaultScopes: string[] = [ 'email' ];

  async getUserInfoFromTokens(tokens: SocialTokens, params?: FacebookUserInfoParams) {
    const url = new URL(this.userInfoEndpoint);
    url.searchParams.set('access_token', tokens.access_token);
    const fields = params && params.fields ? params.fields : this.fields;
    url.searchParams.set('fields', fields.join(','));

    const response = await fetch(url.href);
    const body = await response.json();

    if (!response.ok) {
      throw new UserInfoError(body);
    }

    return body;
  }

}
