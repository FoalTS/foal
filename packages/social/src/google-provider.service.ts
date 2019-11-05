// FoalTS
import { AbstractProvider, SocialTokens } from './abstract-provider.service';

export class GoogleProvider extends AbstractProvider {
  protected configPaths = {
    clientId: 'settings.social.google.clientId',
    clientSecret: 'settings.social.google.clientSecret',
    redirectUri: 'settings.social.google.redirectUri',
  };
  protected authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  protected tokenEndpoint = 'https://oauth2.googleapis.com/token';

  getUserFromTokens(tokens: SocialTokens) {
    throw new Error('Method not implemented.');
  }

}
