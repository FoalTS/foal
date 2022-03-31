// std
import { URL, URLSearchParams } from 'url';

// 3p
import { Config, Context, generateToken, HttpResponseRedirect } from '@foal/core';
import axios from 'axios';

/**
 * Tokens returned by an OAuth2 authorization server.
 *
 * @export
 * @interface SocialTokens
 */
export interface SocialTokens {
  access_token: string;
  token_type: string;
  [name: string]: any;
}

/**
 * Objects returned by the method AbstractProvider.getUserInfo.
 *
 * @export
 * @interface UserInfoAndTokens
 * @template UserInfo
 */
export interface UserInfoAndTokens<UserInfo = any> {
  userInfo: UserInfo;
  tokens: SocialTokens;
}

/**
 * Error thrown if the state does not match.
 *
 * @export
 * @class InvalidStateError
 * @extends {Error}
 */
export class InvalidStateError extends Error {
  readonly name = 'InvalidStateError';
  constructor() {
    super('Suspicious operation: the state of the callback does not match the state of the authorization request.');
  }
}

/**
 * Error thrown if the authorization server returns an error.
 *
 * @export
 * @class AuthorizationError
 * @extends {Error}
 */
export class AuthorizationError extends Error {
  readonly name = 'AuthorizationError';
  constructor(
    readonly error: string,
    readonly errorDescription?: string,
    readonly errorUri?: string,
  ) {
    super(
      'The authorization server returned an error. Impossible to get an authorization code.\n'
      + `- error: ${error}\n`
      + `- description: ${errorDescription}\n`
      + `- URI: ${errorUri}`
    );
  }
}

/**
 * Error thrown if the token endpoint does not return a 2xx response.
 *
 * @export
 * @class TokenError
 * @extends {Error}
 */
export class TokenError extends Error {
  readonly name = 'TokenError';

  constructor(readonly error: any) {
    super(
      'The authorization server returned an error. Impossible to get an access token.\n'
      + JSON.stringify(error, null, 2)
    );
  }
}

const STATE_COOKIE_NAME = 'oauth2-state';

export interface ObjectType {
  [name: string]: any;
}

/**
 * Abstract class that any social provider must inherit from.
 *
 * @export
 * @abstract
 * @class AbstractProvider
 * @template AuthParameters - Additional parameters to pass to the auth endpoint.
 * @template UserInfoParameters - Additional parameters to pass when retrieving user information.
 */
export abstract class AbstractProvider<AuthParameters extends ObjectType, UserInfoParameters extends ObjectType> {

  /**
   * Configuration paths from which the client ID, client secret and redirect URI must be retrieved.
   *
   * @protected
   * @abstract
   * @type {{
   *     clientId: string;
   *     clientSecret: string;
   *     redirectUri: string;
   *   }}
   * @memberof AbstractProvider
   */
  protected readonly abstract configPaths: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
  /**
   * URL of the authorization endpoint from which we retrieve an authorization code.
   *
   * @protected
   * @abstract
   * @type {string}
   * @memberof AbstractProvider
   */
  protected readonly abstract authEndpoint: string;
  /**
   * URL of the token endpoint from which we retrieve an access token.
   *
   * @protected
   * @abstract
   * @type {string}
   * @memberof AbstractProvider
   */
  protected readonly abstract tokenEndpoint: string;

  /**
   * Default scopes requested by the social provider.
   *
   * @protected
   * @type {string[]}
   * @memberof AbstractProvider
   */
  protected readonly defaultScopes: string[] = [];

  /**
   * Character used to separate the scopes in the URL.
   *
   * @protected
   * @type {string}
   * @memberof AbstractProvider
   */
  protected readonly scopeSeparator: string = ' ';

  private get config() {
    return {
      clientId: Config.getOrThrow(this.configPaths.clientId, 'string'),
      clientSecret: Config.getOrThrow(this.configPaths.clientSecret, 'string'),
      redirectUri: Config.getOrThrow(this.configPaths.redirectUri, 'string'),
    };
  }

  /**
   * Retrieve user information from the tokens returned by the authorization server.
   *
   * This method may be synchronous or asynchronous.
   *
   * @abstract
   * @param {SocialTokens} tokens - Tokens returned by the authorization server. It contains at least an access token.
   * @param {UserInfoParameters} [params] - Additional parameters to pass to the function.
   * @returns {*} The user information.
   * @memberof AbstractProvider
   */
  abstract getUserInfoFromTokens(tokens: SocialTokens, params?: UserInfoParameters): any;

  /**
   * Returns an HttpResponseRedirect object to use to redirect the user to the social provider's authorization page.
   *
   * @param {{ scopes?: string[] }} [{ scopes }={}] - Custom scopes to override the default ones used by the provider.
   * @param {AuthParameters} [params] - Additional parameters (specific to the social provider).
   * @returns {Promise<HttpResponseRedirect>} The HttpResponseRedirect object.
   * @memberof AbstractProvider
   */
  async redirect({ scopes }: { scopes?: string[] } = {}, params?: AuthParameters): Promise<HttpResponseRedirect> {
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
    if (params) {
      for (const key in params) {
        url.searchParams.set(key, params[key]);
      }
    }

    // Return a redirection response with the state as cookie.
    return new HttpResponseRedirect(url.href)
      .setCookie(STATE_COOKIE_NAME, state, {
        httpOnly: true,
        maxAge: 300,
        path: '/',
        secure: Config.get('settings.social.cookie.secure', 'boolean', false)
      });
  }

  /**
   * Function to use in the controller method that handles the provider redirection.
   *
   * It returns an access token.
   *
   * @param {Context} ctx - The request context.
   * @returns {Promise<SocialTokens>} The tokens (it contains at least an access token).
   * @memberof AbstractProvider
   */
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

    try {
      const response = await axios.post(this.tokenEndpoint, params, {
        headers: {
          Accept: 'application/json'
        },
      });
      return response.data;
    } catch (error: any) {
      throw new TokenError(error.response.data);
    }
  }

  /**
   * Function to use in the controller method that handles the provider redirection.
   *
   * It retrieves the access token as well as the user information.
   *
   * @template UserInfo
   * @param {Context} ctx - The request context.
   * @param {UserInfoParameters} [params] - Additional parameters to pass to the function.
   * @returns {Promise<UserInfoAndTokens<UserInfo>>} The access token and the user information
   * @memberof AbstractProvider
   */
  async getUserInfo<UserInfo>(ctx: Context, params?: UserInfoParameters): Promise<UserInfoAndTokens<UserInfo>> {
    const tokens = await this.getTokens(ctx);
    const userInfo = await this.getUserInfoFromTokens(tokens, params);
    return { userInfo, tokens };
  }

  private async getState(): Promise<string> {
    return generateToken();
  }
}
