// FoalTS
import { AbstractProvider, SocialTokens } from './abstract-provider.service';

export class FacebookProvider extends AbstractProvider {
  protected configPaths: {
    clientId: 'settings.social.facebook.clientId',
    clientSecret: 'settings.social.facebook.clientSecret',
    redirectUri: 'settings.social.facebook.redirectUri',
  };
  protected authEndpoint = 'https://www.facebook.com/v5.0/dialog/oauth';
  protected tokenEndpoint = 'https://graph.facebook.com/v5.0/oauth/access_token';

  getUserFromTokens(tokens: SocialTokens) {
    throw new Error('Method not implemented.');
  }

}
