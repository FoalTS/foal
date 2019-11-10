// std
import { randomBytes } from 'crypto';
import { URL } from 'url';
import { promisify } from 'util';

// 3p
import { Config, Context, dependency, HttpResponseRedirect } from '@foal/core';
import * as fetch from 'node-fetch';

export interface SocialTokens {
  access_token: string;
  token_type: string;
  [name: string]: any;
}

export interface SocialUser<Profile = any> {
  profile: Profile;
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

  protected readonly baseAuthEndpointParams: object = {};
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

  abstract getUserFromTokens(tokens: SocialTokens): any;

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
    const extraParams = Object.assign({}, this.baseAuthEndpointParams, params);
    // tslint:disable-next-line:forin
    for (const key in extraParams) {
      url.searchParams.set(key, extraParams[key]);
    }

    // Return a redirection response with the state as cookie.
    return new HttpResponseRedirect(url.href)
      .setCookie(STATE_COOKIE_NAME, state);
    // Which cookie parameters? HTTPS vs HTTP.
    // Short lifetime to remove it automatically?
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

    const url = new URL(this.tokenEndpoint);
    url.searchParams.set('grant_type', 'authorization_code');
    url.searchParams.set('code', ctx.request.query.code || '');
    url.searchParams.set('redirect_uri', this.config.redirectUri);
    url.searchParams.set('client_id', this.config.clientId);
    url.searchParams.set('client_secret', this.config.clientSecret);

    // tslint:disable-next-line:forin
    for (const key in this.baseTokenEndpointParams) {
      url.searchParams.set(key, this.baseTokenEndpointParams[key]);
    }

    const response = await fetch(url.href);
    const body = await response.json();

    if (!response.ok) {
      throw new TokenError(body);
    }

    return body;
  }

  async getUser<Profile>(ctx: Context): Promise<SocialUser<Profile>> {
    const tokens = await this.getTokens(ctx);
    const profile = await this.getUserFromTokens(tokens);
    return { profile, tokens };
  }

  private async getState(): Promise<string> {
    const buff = await promisify(randomBytes)(32);
    return buff.toString('base64');
  }
}
