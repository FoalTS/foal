// std
import { randomBytes } from 'crypto';
import { URL } from 'url';
import { promisify } from 'util';

// 3p
import { Config, Context, HttpResponseRedirect } from '@foal/core';

export interface SocialTokens {
  accessToken: string;
  tokenType: string;
  [name: string]: any;
}

export interface SocialUser {
  profile: any;
  tokens: SocialTokens;
}

const STATE_COOKIE_NAME = 'oauth2-state';

export abstract class AbstractProvider {
  protected readonly abstract configPaths: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  protected readonly abstract authEndpoint: string;
  protected readonly abstract tokenEndpoint: string;

  protected readonly baseAuthEndpointParams: object;
  protected readonly baseTokenEndpointParams: object;

  // protected scopeSeparator = ' ';

  private get config() {
    return {
      clientId: Config.get<string>(this.configPaths.clientId),
      clientSecret: Config.get<string>(this.configPaths.clientSecret),
      redirectUri: Config.get<string>(this.configPaths.redirectUri),
    };
  }

  abstract getUserFromTokens(tokens: SocialTokens): any;

  async redirect({ scope, params }: { scope?: string[], params?: object } = {}): Promise<HttpResponseRedirect> {
    // // Build the authorization URL.
    // const url = new URL(this.authEndpoint);
    // url.searchParams.set('reponse_type', 'code');
    // url.searchParams.set('client_id', this.config.clientId);
    // url.searchParams.set('redirect_uri', this.config.redirectUri);

    // // Add a scope if one is given.
    // if (scope && scope.length > 0) {
    //   url.searchParams.set('scope', scope.join(' '));
    // }

    // // Generate a state to protect against CSRF attacks.
    // const state = await this.getState();
    // url.searchParams.set('state', state);

    // // Add extra parameters to the URL.
    // const extraParams = Object.assign({}, this.baseAuthEndpointParams, params);
    // // tslint:disable-next-line:forin
    // for (const key in extraParams) {
    //   url.searchParams.set(key, extraParams[key]);
    // }

    // // Return a redirection response with the state as cookie.
    // return new HttpResponseRedirect(url.href)
    //   .setCookie(STATE_COOKIE_NAME, state);
    return new HttpResponseRedirect('');
  }

  async getTokens(ctx: Context): Promise<SocialTokens> {
    // Properly and precisely handle errors and exceptions.
    // In any case remove the STATE_COOKIE_NAME cookie
    //
    // Verify that the request contains an auth code and does not have errors. Throws an error otherwise.
    // Verify that the state param exists and is valid. Throws an error otherwise.
    // In the controller, maybe have a util "errorsToHttpResponses" to use in the "catch".
    //
    // Make a request to this.tokenEndpoint with the proper parameters (clientId, clientSecret, code, redirectUri).
    // Return the access token and additional tokens.
    return {
      accessToken: 'x',
      tokenType: 'y'
    };
  }

  async getUser(ctx: Context): Promise<SocialUser> {
    // Call getTokens.
    // Call getUserFromTokens (async).
    // Return the results of these two methods.
    return {
      profile: {},
      tokens: {
        accessToken: 'x',
        tokenType: 'y'
      }
    };
  }

  private async getState(): Promise<string> {
    // const buff = await promisify(randomBytes)(32);
    // return buff.toString('base64');
    return '';
  }
}
