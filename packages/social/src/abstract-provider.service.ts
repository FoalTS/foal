// std
import { randomBytes } from 'crypto';
import { URL, URLSearchParams } from 'url';
import { promisify } from 'util';

// 3p
import { Config, Context, dependency, HttpResponseRedirect } from '@foal/core';
import * as fetch from 'node-fetch';

export interface SocialTokens {
  access_token: string;
  token_type: string;
  [name: string]: any;
}

export interface UserInfoAndTokens<UserInfo = any> {
  userInfo: UserInfo;
  tokens: SocialTokens;
}

export class InvalidStateError extends Error {}
export class AuthorizationError extends Error {
  constructor(
    readonly error: string,
    readonly errorDescription?: string,
    readonly errorUri?: string,
  ) {
    super();
  }
}
export class TokenError extends Error {
  constructor(readonly error) {
    super();
  }
}

const STATE_COOKIE_NAME = 'oauth2-state';

export abstract class AbstractProvider {
  @dependency
  configInstance: Config;

  protected readonly abstract configPaths: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  protected readonly abstract authEndpoint: string;
  protected readonly abstract tokenEndpoint: string;

  protected readonly baseTokenEndpointParams: object = {};

  protected readonly defaultScopes: string[] = [];

  protected readonly scopeSeparator: string = ' ';

  private get config() {
    return {
      clientId: this.configInstance.get<string>(this.configPaths.clientId),
      clientSecret: this.configInstance.get<string>(this.configPaths.clientSecret),
      redirectUri: this.configInstance.get<string>(this.configPaths.redirectUri),
    };
  }

  abstract getUserInfoFromTokens(tokens: SocialTokens): any;

  async redirect({ scopes, params }: { scopes?: string[], params?: object } = {}): Promise<HttpResponseRedirect> {
    // Build the authorization URL.
    const url = new URL(this.authEndpoint);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.config.clientId);
    url.searchParams.set('redirect_uri', this.config.redirectUri);

    // Add the scopes if any are provided.
    const actualScopes = scopes || this.defaultScopes;
    if (actualScopes.length > 0) {
      url.searchParams.set('scope', actualScopes.join(this.scopeSeparator));
    }

    // Generate a state to protect against CSRF attacks.
    const state = await this.getState();
    url.searchParams.set('state', state);

    // Add extra parameters to the URL.
    // tslint:disable-next-line:forin
    for (const key in params) {
      url.searchParams.set(key, params[key]);
    }

    // Return a redirection response with the state as cookie.
    return new HttpResponseRedirect(url.href)
      .setCookie(STATE_COOKIE_NAME, state, {
        httpOnly: true,
        maxAge: 300,
        path: '/',
        secure: this.configInstance.get('settings.social.cookie.secure', false)
      });
  }

  async getTokens(ctx: Context): Promise<SocialTokens> {
    if (ctx.request.query.state !== ctx.request.cookies[STATE_COOKIE_NAME]) {
      throw new InvalidStateError();
    }
    if (ctx.request.query.error) {
      throw new AuthorizationError(
        ctx.request.query.error,
        ctx.request.query.error_description,
        ctx.request.query.error_uri,
      );
    }

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('code', ctx.request.query.code || '');
    params.set('redirect_uri', this.config.redirectUri);
    params.set('client_id', this.config.clientId);
    params.set('client_secret', this.config.clientSecret);

    // tslint:disable-next-line:forin
    for (const key in this.baseTokenEndpointParams) {
      params.set(key, this.baseTokenEndpointParams[key]);
    }

    const response = await fetch(this.tokenEndpoint, {
      body: params,
      method: 'POST',
    });
    const body = await response.json();

    if (!response.ok) {
      throw new TokenError(body);
    }

    return body;
  }

  async getUserInfo<UserInfo>(ctx: Context): Promise<UserInfoAndTokens<UserInfo>> {
    const tokens = await this.getTokens(ctx);
    const userInfo = await this.getUserInfoFromTokens(tokens);
    return { userInfo, tokens };
  }

  private async getState(): Promise<string> {
    const buff = await promisify(randomBytes)(32);
    return buff.toString('base64');
  }
}
