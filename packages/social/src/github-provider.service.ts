// 3p
import axios from 'axios';

// FoalTS
import { AbstractProvider, SocialTokens } from './abstract-provider.service';
import { UserInfoError } from './user-info.error';

export interface GithubAuthParams {
  login?: string;
  allow_signup?: boolean;
}

/**
 * Github social provider.
 *
 * @export
 * @class GithubProvider
 * @extends {AbstractProvider<GithubAuthParams, never>}
 */
export class GithubProvider extends AbstractProvider<GithubAuthParams, never> {
  protected configPaths = {
    clientId: 'settings.social.github.clientId',
    clientSecret: 'settings.social.github.clientSecret',
    redirectUri: 'settings.social.github.redirectUri',
  };
  protected authEndpoint = 'https://github.com/login/oauth/authorize';
  protected tokenEndpoint = 'https://github.com/login/oauth/access_token';
  protected userInfoEndpoint = 'https://api.github.com/user';

  async getUserInfoFromTokens(tokens: SocialTokens) {
    try {
      const response = await axios.get(this.userInfoEndpoint, {
        headers: { Authorization: `token ${tokens.access_token}` }
      });
      return response.data;
    } catch (error: any) {
      throw new UserInfoError(error.response.data);
    }
  }

}
