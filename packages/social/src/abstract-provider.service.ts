// std
import { URL, URLSearchParams } from 'url';
import * as crypto from 'crypto';

// 3p
import { Config, Context, generateToken, HttpResponseRedirect, convertBase64ToBase64url, CookieOptions, HttpResponseOK } from '@foal/core';

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
 * Error thrown if the (encrypted) code verifier is not found in cookie.
 *
 * @export
 * @class CodeVerifierNotFound
 * @extends {Error}
 */
export class CodeVerifierNotFound extends Error {
  readonly name = 'CodeVerifierNotFound';
  constructor() {
    super('Suspicious operation: encrypted code verifier not found in cookie.');
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
const CODE_VERIFIER_COOKIE_NAME = 'oauth2-code-verifier'

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
 * @template UserInfo - Type of the user information.
 */
export abstract class AbstractProvider<AuthParameters extends ObjectType, UserInfoParameters extends ObjectType, UserInfo = any> {

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

  /**
   * Enables code flow with PKCE.
   *
   * @protected
   * @type {boolean}
   * @memberof AbstractProvider
   */
  protected readonly usePKCE: boolean = false;

  /**
   * Specifies whether to use the plain code verifier string as PKCE code challenge.
   *
   * @protected
   * @type {boolean}
   * @memberof AbstractProvider
   */
  protected readonly useCodeVerifierAsCodeChallenge: boolean = false;

  /**
   * Configuration path from which the code verifier secret must be retrieved.
   *
   * @protected
   * @type {boolean}
   * @memberof AbstractProvider
   */
  protected readonly codeVerifierSecretPath: string = 'settings.social.secret.codeVerifierSecret';

  /**
   * Specifies whether the client ID and client secret must be sent in a Authorization header using Basic scheme.
   *
   * @protected
   * @memberof AbstractProvider
   */
  protected readonly useAuthorizationHeaderForTokenEndpoint: boolean = false;

  /**
   * Algorithm used for the code verifier encryption.
   *
   * @protected
   * @type {string}
   * @memberof AbstractProvider
   */
  private readonly cryptAlgorithm: string = 'aes-256-ctr' ;

  private get config() {
    return {
      clientId: Config.getOrThrow(this.configPaths.clientId, 'string'),
      clientSecret: Config.getOrThrow(this.configPaths.clientSecret, 'string'),
      redirectUri: Config.getOrThrow(this.configPaths.redirectUri, 'string')
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
   * @returns {UserInfo | Promise<UserInfo>} The user information.
   * @memberof AbstractProvider
   */
  abstract getUserInfoFromTokens(tokens: SocialTokens, params?: UserInfoParameters): UserInfo | Promise<UserInfo>;

  /**
   * Returns an HttpResponseOK or HttpResponseRedirect object to redirect the user to the social provider's authorization page.
   *
   * If the isRedirection parameter is undefined or set to false, the function returns an HttpResponseOK object. Its body contains the URL of the consent page.
   *
   * If the isRedirection parameter is set to true, the function returns an HttpResponseRedirect object.
   *
   * @param {{ scopes?: string[] }} [{ scopes }={}] - Custom scopes to override the default ones used by the provider.
   * @param {{ isRedirection?: boolean }} [{ isRedirection }={}] - If true, the function returns an HttpResponseRedirect object. Otherwise, it returns an HttpResponseOK object.
   * @param {AuthParameters} [params] - Additional parameters (specific to the social provider).
   * @returns {Promise<HttpResponseOK | HttpResponseRedirect>} The HttpResponseOK or HttpResponseRedirect object.
   * @memberof AbstractProvider
   */
  async createHttpResponseWithConsentPageUrl({ scopes, isRedirection }: { scopes?: string[], isRedirection?: boolean } = {}, params?: AuthParameters): Promise<HttpResponseOK | HttpResponseRedirect> {
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

    // We use a base64url-encoded random token making OAuth2 PKCE spec compliant - see https://datatracker.ietf.org/doc/html/rfc7636#appendix-B for more information
    const codeVerifier = await generateToken();

    if (this.usePKCE) {
      const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64');
      url.searchParams.set('code_challenge', this.useCodeVerifierAsCodeChallenge ? codeVerifier : convertBase64ToBase64url(hash));
      url.searchParams.set('code_challenge_method', this.useCodeVerifierAsCodeChallenge ? 'plain' : 'S256');
    }

    const response = isRedirection ? new HttpResponseRedirect(url.href) : new HttpResponseOK({ consentPageUrl: url.href });

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      maxAge: 300,
      path: '/',
      secure: Config.get('settings.social.cookie.secure', 'boolean', false)
    }

    const cookieDomain = Config.get('settings.social.cookie.domain', 'string');
    if (cookieDomain) {
      cookieOptions.domain = cookieDomain;
    }

    // Add Code Challenge COOKIE for token request
    if (this.usePKCE) {
      // Encrypt this code_challenge cookie for security reasons
      response.setCookie(CODE_VERIFIER_COOKIE_NAME, this.encryptString(codeVerifier), cookieOptions);
    }

    // Return a redirection response with the state as cookie.
    return response
      .setCookie(STATE_COOKIE_NAME, state, cookieOptions)
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

    if (!this.useAuthorizationHeaderForTokenEndpoint) {
      params.set('client_id', this.config.clientId);
      params.set('client_secret', this.config.clientSecret);
    }

    if (this.usePKCE) {
      const encryptedCodeVerifier = ctx.request.cookies[CODE_VERIFIER_COOKIE_NAME]
      if (!encryptedCodeVerifier) {
        throw new CodeVerifierNotFound();
      }

      const codeVerifier = this.decryptString(encryptedCodeVerifier)
      params.set('code_verifier', codeVerifier);
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (this.useAuthorizationHeaderForTokenEndpoint) {
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      headers.Authorization = `Basic ${auth}`;
    }

    const response = await fetch(this.tokenEndpoint, {
      body: params,
      headers,
      method: 'POST',
    });
    const body = await response.json();

    if (!response.ok) {
      throw new TokenError(body);
    }

    return body;
  }

  /**
   * Function to use in the controller method that handles the provider redirection.
   *
   * It retrieves the access token as well as the user information.
   *
   * @param {Context} ctx - The request context.
   * @param {UserInfoParameters} [params] - Additional parameters to pass to the function.
   * @returns {Promise<UserInfoAndTokens<UserInfo>>} The access token and the user information
   * @memberof AbstractProvider
   */
  async getUserInfo(ctx: Context, params?: UserInfoParameters): Promise<UserInfoAndTokens<UserInfo>> {
    const tokens = await this.getTokens(ctx);
    const userInfo = await this.getUserInfoFromTokens(tokens, params);
    return { userInfo, tokens };
  }

  private async getState(): Promise<string> {
    return generateToken();
  }

  /**
   * This function is for encrypt a string using aes-256 and codeVerifierSecret.
   * Notice that init vector base64-encoded is concatenated at start of encrypted message.
   * We'll need init vector to decrypt message.
   * Init vector is 16 bytes length and it base64-encoded is 24 bytes length.
   *
   * @param {string} message - String to encrypt
   */
  private encryptString(message: string): string {

    const hashedSecret = this.getCodeVerifierSecretBuffer();

    // Initiate iv with random bytes
    const initVector = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv(this.cryptAlgorithm, hashedSecret, initVector);

    // Encrypt data, concat final
    const data = cipher.update(Buffer.from(message));
    const encryptedMessage = Buffer.concat([data, cipher.final()])

    return `${initVector.toString('base64')}${encryptedMessage.toString('base64')}`
  }

  /**
   * This function is for decrypt a string using aes-256 and codeVerifierSecret
   * encryptedMessage is {iv}{encrypted data}
   *
   * @param {string} encryptedMessage - String to decrypt
   */
    private decryptString(encryptedMessage: string): string {
      const hashedSecret = this.getCodeVerifierSecretBuffer();

      // Get init vector back from encryptedMessage
      const initVector: Buffer = Buffer.from(encryptedMessage.substring(0,24), 'base64'); // original iv is 16 bytes long, so base64 encoded is 24 bytes long
      const message: string = encryptedMessage.substring(24);

      // Create decipher
      const decipher = crypto.createDecipheriv(this.cryptAlgorithm, hashedSecret, initVector);

      // Decrypt data, concat final
      const data = decipher.update(Buffer.from(message, 'base64'));
      const decryptedMessage = Buffer.concat([data, decipher.final()])

      return decryptedMessage.toString()
    }

    private getCodeVerifierSecretBuffer(): Buffer {
      // Get secret from config file or throw an error if not defined
      const codeVerifierSecret = Config.getOrThrow(this.codeVerifierSecretPath, 'string');
      // We create a sha256 hash to ensure that key is 32 bytes long
      return crypto.createHash('sha256').update(codeVerifierSecret).digest();
    }
}
