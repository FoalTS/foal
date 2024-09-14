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
    const response = await fetch(this.userInfoEndpoint, {
      headers: { Authorization: `token ${tokens.access_token}` }
    });
    const body = await response.json();

    if (!response.ok) {
      throw new UserInfoError(body);
    }

    return body;
  }

}
