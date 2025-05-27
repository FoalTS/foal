// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';
import { Server } from 'http';
import { URLSearchParams } from 'url';
import * as crypto from 'crypto'

// 3p
import {
  Config,
  ConfigNotFoundError,
  Context,
  createApp,
  createService,
  HttpResponseBadRequest,
  HttpResponseOK,
  isHttpResponseOK,
  isHttpResponseRedirect,
  Post
} from '@foal/core';

// FoalTS
import {
  AbstractProvider,
  AuthorizationError,
  CodeVerifierNotFound,
  InvalidStateError,
  SocialTokens,
  TokenError
} from './abstract-provider.service';

const STATE_COOKIE_NAME = 'oauth2-state';
const CODE_VERIFIER_COOKIE_NAME = 'oauth2-code-verifier';

describe('InvalidStateError', () => {

  it('should have a "message" property.', () => {
    const error = new InvalidStateError();

    strictEqual(
      error.message,
      'Suspicious operation: the state of the callback does not match the state of the authorization request.');
  });

  it('should have a "name" property.', () => {
    const error = new InvalidStateError();

    strictEqual(error.name, 'InvalidStateError');
  });

});

describe('CodeVerifierNotFound', () => {

  it('should have a "message" property.', () => {
    const error = new CodeVerifierNotFound();

    strictEqual(
      error.message,
      'Suspicious operation: encrypted code verifier not found in cookie.');
  });

  it('should have a "name" property.', () => {
    const error = new CodeVerifierNotFound();

    strictEqual(error.name, 'CodeVerifierNotFound');
  });

});

describe('AuthorizationError', () => {

  it('should have a "message" property.', () => {
    const error = new AuthorizationError('error1', 'error description', 'error URI');

    strictEqual(
      error.message,
      `The authorization server returned an error. Impossible to get an authorization code.
- error: error1
- description: error description
- URI: error URI`
    );
  });

  it('should have a "name" property.', () => {
    const error = new AuthorizationError('error1', 'error description', 'error URI');

    strictEqual(error.name, 'AuthorizationError');
  });

  it('should have an "error" property.', () => {
    const error = new AuthorizationError('error1', 'error description', 'error URI');

    strictEqual(error.error, 'error1');
  });

  it('should have an "errorDescription" property.', () => {
    const error = new AuthorizationError('error1', 'error description', 'error URI');

    strictEqual(error.errorDescription, 'error description');
  });

  it('should have an "errorUri" property.', () => {
    const error = new AuthorizationError('error1', 'error description', 'error URI');

    strictEqual(error.errorUri, 'error URI');
  });

});

describe('TokenError', () => {

  it('should have a "message" property.', () => {
    const err = {
      foo: 'bar'
    };
    const error = new TokenError(err);

    strictEqual(
      error.message,
      `The authorization server returned an error. Impossible to get an access token.
{
  "foo": "bar"
}`
    );
  });

  it('should have a "name" property.', () => {
    const error = new TokenError({});

    strictEqual(error.name, 'TokenError');
  });

  it('should have an "error" property.', () => {
    const err = {
      foo: 'bar'
    };
    const error = new TokenError(err);

    strictEqual(error.error, err);
  });

});

describe('AbstractProvider', () => {

  class ConcreteProvider extends AbstractProvider<any, any, any> {
    protected configPaths = {
      clientId: 'settings.social.example.clientId',
      clientSecret: 'settings.social.example.clientSecret',
      redirectUri: 'settings.social.example.redirectUri'
    };
    protected authEndpoint = 'https://example2.com/auth';
    protected tokenEndpoint = 'http://localhost:3000/token';

    async getUserInfoFromTokens(tokens: SocialTokens): Promise<any> {
      throw new Error('Method not implemented.');
    }
  }

  let provider: ConcreteProvider;
  const clientId = 'clientIdXXX';
  const clientSecret = 'clientSecretYYY';
  const redirectUri = 'https://example.com/callback';

  beforeEach(() => {
    Config.set('settings.social.example.clientId', clientId);
    Config.set('settings.social.example.clientSecret', clientSecret);
    Config.set('settings.social.example.redirectUri', redirectUri);
    Config.set('settings.logger.logHttpRequests', false);

    provider = createService(ConcreteProvider);
  });

  afterEach(() => {
    Config.remove('settings.social.example.clientId');
    Config.remove('settings.social.example.clientSecret');
    Config.remove('settings.social.example.redirectUri');
    Config.remove('settings.logger.logHttpRequests');
    Config.remove('settings.social.cookie.secure');
    Config.remove('settings.social.cookie.domain');
  });

  describe('has a "createHttpResponseWithConsentPageUrl" method that', () => {

    context('given the isRedirection option is false or not defined', () => {

      it('should return an HttpResponseOK object.', async () => {
        const result = await provider.createHttpResponseWithConsentPageUrl();
        strictEqual(isHttpResponseOK(result), true);
      });

      describe('should return an HttpResponseOK object', () => {

        it('with a consentPageUrl which contains a client ID, a response type, a redirect URI.', async () => {
          const response = await provider.createHttpResponseWithConsentPageUrl();

          ok(response.body.consentPageUrl.startsWith(
            'https://example2.com/auth?'
            + 'response_type=code&'
            + 'client_id=clientIdXXX&'
            + 'redirect_uri=https%3A%2F%2Fexample.com%2Fcallback'
          ));
        });

        it('with a consentPageUrl which does not contain a scope if none was provided.', async () => {
          const response = await provider.createHttpResponseWithConsentPageUrl();
          const searchParams = new URLSearchParams(response.body.consentPageUrl);

          strictEqual(searchParams.get('scope'), null);
        });

        it('with a consentPageUrl which contains the scopes if any are provided by the class.', async () => {
          class ConcreteProvider2 extends ConcreteProvider {
            defaultScopes = [ 'scope1', 'scope2' ];
          }
          provider = createService(ConcreteProvider2);

          const response = await provider.createHttpResponseWithConsentPageUrl();
          const searchParams = new URLSearchParams(response.body.consentPageUrl);

          strictEqual(searchParams.get('scope'), 'scope1 scope2');
        });

        it('with a consentPageUrl which contains the scopes if any are provided by the class'
            + ' (custom separator).', async () => {
          class ConcreteProvider2 extends ConcreteProvider {
            defaultScopes = [ 'scope1', 'scope2' ];
            scopeSeparator = ',';
          }
          provider = createService(ConcreteProvider2);

          const response = await provider.createHttpResponseWithConsentPageUrl();
          const searchParams = new URLSearchParams(response.body.consentPageUrl);

          strictEqual(searchParams.get('scope'), 'scope1,scope2');
        });

        it('with a consentPageUrl which contains the scopes if any are provided to the method.', async () => {
          class ConcreteProvider2 extends ConcreteProvider {
            // This checks that the default scopes will be override.
            defaultScopes = [ 'scope1', 'scope2' ];
          }
          provider = createService(ConcreteProvider2);

          const response = await provider.createHttpResponseWithConsentPageUrl({
            scopes: [ 'scope3', 'scope4' ]
          });
          const searchParams = new URLSearchParams(response.body.consentPageUrl);

          strictEqual(searchParams.get('scope'), 'scope3 scope4');
        });

        it('with a generated state to protect against CSRF attacks.', async () => {
          const response = await provider.createHttpResponseWithConsentPageUrl();
          const stateCookieValue = response.getCookie(STATE_COOKIE_NAME).value;
          const stateCookieOptions = response.getCookie(STATE_COOKIE_NAME).options;
          if (typeof stateCookieValue !== 'string') {
            throw new Error('Cookie not found.');
          }

          deepStrictEqual(stateCookieOptions, {
            httpOnly: true,
            maxAge: 300,
            path: '/',
            secure: false
          });

          const searchParams = new URLSearchParams(response.body.consentPageUrl);
          const stateParamValue = searchParams.get('state');
          if (typeof stateParamValue !== 'string') {
            throw new Error('State parameter not found.');
          }

          strictEqual(stateParamValue, stateCookieValue);
          notStrictEqual(stateCookieValue.length, 0);
        });

        it('with a generated state with does not contain problematic URL characters.', async () => {
          // This test is bad because it is not deterministic.
          // Unfortunately, since the state is randomly generated, we can't do better.

          const response = await provider.createHttpResponseWithConsentPageUrl();
          const searchParams = new URLSearchParams(response.body.consentPageUrl);
          const stateParamValue = searchParams.get('state');
          if (typeof stateParamValue !== 'string') {
            throw new Error('State parameter not found.');
          }

          strictEqual(stateParamValue.includes('+'), false);
          strictEqual(stateParamValue.includes('/'), false);
          strictEqual(stateParamValue.includes('='), false);
        });

        it('with a generated state in a cookie whose secure option is defined with the config.', async () => {
          Config.set('settings.social.cookie.secure', true);

          const response = await provider.createHttpResponseWithConsentPageUrl();
          const { options } = response.getCookie(STATE_COOKIE_NAME);

          strictEqual(options.secure, true);
        });

        it('with a generated state in a cookie whose domain option is defined with the config.', async () => {
          Config.set('settings.social.cookie.domain', 'foalts.org');

          const response = await provider.createHttpResponseWithConsentPageUrl();
          const { options } = response.getCookie(STATE_COOKIE_NAME);

          strictEqual(options.domain, 'foalts.org');
        });

        it('with a consentPageUrl which contains extra parameters if any are provided to the method.', async () => {
          provider = createService(ConcreteProvider);

          const response = await provider.createHttpResponseWithConsentPageUrl({}, { foo: 'bar2' });
          const searchParams = new URLSearchParams(response.body.consentPageUrl);

          strictEqual(searchParams.get('foo'), 'bar2');
        });

        it('with a consentPageUrl that do NOT contain PKCE parameters.', async () => {
          provider = createService(ConcreteProvider);

          const response = await provider.createHttpResponseWithConsentPageUrl();
          const searchParams = new URLSearchParams(response.body.consentPageUrl);

          strictEqual(searchParams.get('code_challenge'), null);
          strictEqual(searchParams.get('code_challenge_method'), null);
        });

      });

    });

    context('given the isRedirection option is true', () => {

      it('should return an HttpResponseRedirect object where the path is the consent page URL.', async () => {
        const httpResponseOK = await provider.createHttpResponseWithConsentPageUrl();
        const httpResponseRedirect = await provider.createHttpResponseWithConsentPageUrl({ isRedirection: true });

        if (!isHttpResponseRedirect(httpResponseRedirect)) {
          throw new Error('The response should be an HttpResponseRedirect object.');
        }

        const httpResponseOKConsentPageUrl = new URL(httpResponseOK.body.consentPageUrl);
        const httpResponseRedirectConsentPageUrl = new URL(httpResponseRedirect.path);

        // Remove values generated randomly.
        httpResponseOKConsentPageUrl.searchParams.delete('state');
        httpResponseRedirectConsentPageUrl.searchParams.delete('state');

        strictEqual(httpResponseRedirectConsentPageUrl.href, httpResponseOKConsentPageUrl.href);
        notStrictEqual(httpResponseRedirect.getCookie(STATE_COOKIE_NAME), undefined);
      });

    });

  });

  describe('has a "getTokens" method that', () => {

    let server: Server;

    afterEach(() => {
      if (server) {
        server.close();
      }
    });

    it('should throw an InvalidStateError if the query param "state" is not equal '
        + 'to the cookie state value.', async () => {
      const ctx = new Context({
        cookies: {
          [STATE_COOKIE_NAME]: 'xxx'
        },
        query: {},
      });
      try {
        await provider.getTokens(ctx);
        throw new Error('getTokens should have thrown an InvalidStateError.');
      } catch (error: any) {
        if (!(error instanceof InvalidStateError)) {
          throw error;
        }
      }
    });

    it('should throw an AuthorizationError if the request contains a query param "error".', async () => {
      const ctx = new Context({
        cookies: {
          [STATE_COOKIE_NAME]: 'xxx'
        },
        query: {
          error: 'access_denied',
          error_description: 'yyy',
          error_uri: 'zzz',
          state: 'xxx',
        },
      });
      try {
        await provider.getTokens(ctx);
        throw new Error('getTokens should have thrown an AuthorizationError.');
      } catch (error: any) {
        if (!(error instanceof AuthorizationError)) {
          throw error;
        }
        strictEqual(error.error, 'access_denied');
        strictEqual(error.errorDescription, 'yyy');
        strictEqual(error.errorUri, 'zzz');
      }
    });

    context('given the useAuthorizationHeaderForTokenEndpoint property is false', () => {
      it('should send a request which contains a grant type, a code, a redirect URI,'
          + 'a client ID and a client secret but no auth header and return the response body.', async () => {
        class AppController {
          @Post('/token')
          token(ctx: Context) {
            strictEqual(ctx.request.get('Accept'), 'application/json');
            strictEqual(ctx.request.get('Content-Type'), 'application/x-www-form-urlencoded');
            strictEqual(ctx.request.get('Authorization'), undefined);

            const { grant_type, code, redirect_uri, client_id, client_secret } = ctx.request.body;
            strictEqual(grant_type, 'authorization_code');
            strictEqual(code, 'an_authorization_code');
            strictEqual(redirect_uri, redirectUri);
            strictEqual(client_id, clientId);
            strictEqual(client_secret, clientSecret);
            return new HttpResponseOK({
              access_token: 'an_access_token',
              token_type: 'bearer'
            });
          }
        }

        server = (await createApp(AppController)).listen(3000);

        const ctx = new Context({
          cookies: {
            [STATE_COOKIE_NAME]: 'xxx'
          },
          query: {
            code: 'an_authorization_code',
            state: 'xxx',
          },
        });

        const actual = await provider.getTokens(ctx);
        const expected: SocialTokens = {
          access_token: 'an_access_token',
          token_type: 'bearer'
        };
        deepStrictEqual(actual, expected);
      });
    });

    context('given the useAuthorizationHeaderForTokenEndpoint property is true', () => {
      it('should send a request which contains a grant type, a code, a redirect URI,'
          + 'and an auth header and return the response body.', async () => {
        // Example taken from https://datatracker.ietf.org/doc/html/rfc2617#section-2
        const clientId = 'Aladdin';
        const clientSecret = 'open sesame';
        const authHeader = 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==';

        Config.set('settings.social.example.clientId', clientId);
        Config.set('settings.social.example.clientSecret', clientSecret);

        class ConcreteProvider2 extends ConcreteProvider {
          useAuthorizationHeaderForTokenEndpoint = true;
        }

        provider = new ConcreteProvider2();

        class AppController {
          @Post('/token')
          token(ctx: Context) {
            strictEqual(ctx.request.headers.accept, 'application/json');
            strictEqual(ctx.request.get('Content-Type'), 'application/x-www-form-urlencoded');
            strictEqual(ctx.request.get('Authorization'), authHeader);

            const { grant_type, code, redirect_uri, client_id, client_secret } = ctx.request.body;
            strictEqual(grant_type, 'authorization_code');
            strictEqual(code, 'an_authorization_code');
            strictEqual(redirect_uri, redirectUri);
            strictEqual(client_id, undefined);
            strictEqual(client_secret, undefined);
            return new HttpResponseOK({
              access_token: 'an_access_token',
              token_type: 'bearer'
            });
          }
        }

        server = (await createApp(AppController)).listen(3000);

        const ctx = new Context({
          cookies: {
            [STATE_COOKIE_NAME]: 'xxx'
          },
          query: {
            code: 'an_authorization_code',
            state: 'xxx',
          },
        });

        const actual = await provider.getTokens(ctx);
        const expected: SocialTokens = {
          access_token: 'an_access_token',
          token_type: 'bearer'
        };
        deepStrictEqual(actual, expected);
      });
    });

    it('should throw a TokenError if the token endpoint returns an error.', async () => {
      class AppController {
        @Post('/token')
        token() {
          return new HttpResponseBadRequest({
            error: 'bad request'
          });
        }
      }

      server = (await createApp(AppController)).listen(3000);

      const ctx = new Context({
        cookies: {
          [STATE_COOKIE_NAME]: 'xxx'
        },
        query: {
          code: 'an_authorization_code',
          state: 'xxx',
        },
      });

      try {
        await provider.getTokens(ctx);
        throw new Error('getTokens should have thrown a TokenError.');
      } catch (error: any) {
        if (!(error instanceof TokenError)) {
          throw error;
        }
        deepStrictEqual(error.error, {
          error: 'bad request'
        });
      }
    });

  });

  describe('has a "getUserInfo" method that', () => {

    let server: Server;

    beforeEach(() => {
      provider = createService(ConcreteProvider);
    });

    afterEach(() => {
      if (server) {
        server.close();
      }
    });

    it('should return the tokens.', async () => {
      class AppController {
        @Post('/token')
        token() {
          return new HttpResponseOK({
            access_token: 'an_access_token',
            token_type: 'bearer'
          });
        }
      }

      server = (await createApp(AppController)).listen(3000);

      const ctx = new Context({
        cookies: {
          [STATE_COOKIE_NAME]: 'xxx'
        },
        query: {
          code: 'an_authorization_code',
          state: 'xxx',
        },
      });

      class ConcreteProvider2 extends ConcreteProvider {
        async getUserInfoFromTokens(tokens: SocialTokens) {
          // Do not throw an error.
        }
      }
      provider = createService(ConcreteProvider2);

      const { tokens } = await provider.getUserInfo(ctx);
      const expectedTokens: SocialTokens = {
        access_token: 'an_access_token',
        token_type: 'bearer'
      };
      deepStrictEqual(tokens, expectedTokens);
    });

    it('should call the "getUserInfoFromTokens" method with the retrieved tokens and the given params.', async () => {
      const tokens: SocialTokens = {
        access_token: 'an_access_token',
        token_type: 'bearer'
      };
      const params = {
        fields: [ 'email' ]
      };

      class AppController {
        @Post('/token')
        token() {
          return new HttpResponseOK(tokens);
        }
      }

      server = (await createApp(AppController)).listen(3000);

      const ctx = new Context({
        cookies: {
          [STATE_COOKIE_NAME]: 'xxx'
        },
        query: {
          code: 'an_authorization_code',
          state: 'xxx',
        },
      });

      let calledWithTokens: null|SocialTokens = null;
      let calledWithParams: null|any = null;
      class ConcreteProvider2 extends ConcreteProvider {
        async getUserInfoFromTokens(tokens: SocialTokens, params?: any) {
          calledWithTokens = tokens;
          calledWithParams = params || null;
        }
      }
      provider = createService(ConcreteProvider2);

      await provider.getUserInfo(ctx, params);
      deepStrictEqual(calledWithTokens, tokens);
      deepStrictEqual(calledWithParams, params);
    });

    it('should return the user info returned by the "getUserInfoFromTokens" method.', async () => {
      class AppController {
        @Post('/token')
        token() {
          return new HttpResponseOK({
            access_token: 'an_access_token',
            token_type: 'bearer'
          });
        }
      }

      server = (await createApp(AppController)).listen(3000);

      const ctx = new Context({
        cookies: {
          [STATE_COOKIE_NAME]: 'xxx'
        },
        query: {
          code: 'an_authorization_code',
          state: 'xxx',
        },
      });

      const expectedUserInfo = { email: 'alix@foalts.org' };
      class ConcreteProvider2 extends ConcreteProvider {
        async getUserInfoFromTokens() {
          return expectedUserInfo;
        }
      }
      provider = createService(ConcreteProvider2);

      const { userInfo } = await provider.getUserInfo(ctx);
      strictEqual(userInfo, expectedUserInfo);
    });

  });

});

describe('Abstract Provider With PKCE', () => {

  class ConcreteProvider extends AbstractProvider<any, any> {
    protected configPaths = {
      clientId: 'settings.social.example.clientId',
      clientSecret: 'settings.social.example.clientSecret',
      redirectUri: 'settings.social.example.redirectUri'
    };
    protected usePKCE: boolean = true;
    protected authEndpoint = 'https://example2.com/auth';
    protected tokenEndpoint = 'http://localhost:3000/token';

    async getUserInfoFromTokens(tokens: SocialTokens) {
      throw new Error('Method not implemented.');
    }
  }

  let provider: ConcreteProvider;
  const clientId = 'clientIdXXX';
  const clientSecret = 'clientSecretYYY';
  const redirectUri = 'https://example.com/callback';

  beforeEach(() => {
    Config.set('settings.social.example.clientId', clientId);
    Config.set('settings.social.example.clientSecret', clientSecret);
    Config.set('settings.social.example.redirectUri', redirectUri);
    Config.set('settings.logger.logHttpRequests', false);

    provider = createService(ConcreteProvider);
  });

  afterEach(() => {
    Config.remove('settings.social.example.clientId');
    Config.remove('settings.social.example.clientSecret');
    Config.remove('settings.social.example.redirectUri');
    Config.remove('settings.logger.logHttpRequests');
    Config.remove('settings.social.cookie.secure');
    Config.remove('settings.social.cookie.domain');
  });

  describe('has a "createHttpResponseWithConsentPageUrl" method that', () => {

    it('should fail if secret is not configured', async () => {
      try {
        await provider.createHttpResponseWithConsentPageUrl();
      } catch(error) {
        if(!(error instanceof ConfigNotFoundError)){
          throw error;
        }
      }
    });

    describe('should return an HttpResponse object', () => {

      beforeEach(() => {
        Config.set('settings.social.secret.codeVerifierSecret', 'SECRET');
      });

      afterEach(() => {
        Config.remove('settings.social.secret.codeVerifierSecret');
      });

      it('with a consentPageUrl which contains a client ID, a response type, a redirect URI, code_challenge and code_challenge_method (S256) if pkce enabled.', async () => {
        const response = await provider.createHttpResponseWithConsentPageUrl();
        ok(response.body.consentPageUrl.startsWith(
          'https://example2.com/auth?'
          + 'response_type=code&'
          + 'client_id=clientIdXXX&'
          + 'redirect_uri=https%3A%2F%2Fexample.com%2Fcallback'
        ));
        const searchParams = new URLSearchParams(response.body.consentPageUrl);
        ok(searchParams.get('code_challenge'));
        strictEqual(searchParams.get('code_challenge_method'), 'S256');
      });

      it('that sets a cookie containing the code verifier encrypted.', async () =>{
        const response = await provider.createHttpResponseWithConsentPageUrl();

        const stateCookieValue = response.getCookie(CODE_VERIFIER_COOKIE_NAME).value;
        const stateCookieOptions = response.getCookie(CODE_VERIFIER_COOKIE_NAME).options;
        if (typeof stateCookieValue !== 'string') {
          throw new Error('Cookie not found.');
        }

        deepStrictEqual(stateCookieOptions, {
          httpOnly: true,
          maxAge: 300,
          path: '/',
          secure: false
        });
      });

      it('that sets a cookie that can have a custom domain.', async () =>{
        Config.set('settings.social.cookie.domain', 'foalts.org');

        const response = await provider.createHttpResponseWithConsentPageUrl();
        const { options } = response.getCookie(CODE_VERIFIER_COOKIE_NAME);

        strictEqual(options.domain, 'foalts.org');
      });
    });

    describe('has a "getTokens" method that', () => {

      let server: Server;
      const secret: string = 'SECRETCODE';

      afterEach(() => {
        if (server) {
          server.close();
        }
        Config.remove('settings.social.secret.codeVerifierSecret');
      });

      beforeEach(() => {
        Config.set('settings.social.secret.codeVerifierSecret', secret);
      });

      it('should send a request which contains a grant type, a code, a redirect URI,'
        + 'a client ID, a client secret and code_verifier and return the response body.', async () => {

        const codeVerifier = 'code verifier';

        class AppController {
          @Post('/token')
          token(ctx: Context) {
            strictEqual(ctx.request.headers.accept, 'application/json');
            strictEqual(ctx.request.get('Content-Type'), 'application/x-www-form-urlencoded');
            const { grant_type, code, redirect_uri, client_id, client_secret, code_verifier } = ctx.request.body;
            strictEqual(grant_type, 'authorization_code');
            strictEqual(code, 'an_authorization_code');
            strictEqual(redirect_uri, redirectUri);
            strictEqual(client_id, clientId);
            strictEqual(client_secret, clientSecret);
            strictEqual(code_verifier, codeVerifier)
            return new HttpResponseOK({
              access_token: 'an_access_token',
              token_type: 'bearer'
            });
          }
        }

        server = (await createApp(AppController)).listen(3000);

        const iv = crypto.randomBytes(16); // temporary for testing purpose

        const ctx = new Context({
          cookies: {
            [STATE_COOKIE_NAME]: 'xxx',
            [CODE_VERIFIER_COOKIE_NAME]: encryptHelper(codeVerifier, iv, secret)
          },
          query: {
            code: 'an_authorization_code',
            state: 'xxx',
          },
        });

        const actual = await provider.getTokens(ctx);
        const expected: SocialTokens = {
          access_token: 'an_access_token',
          token_type: 'bearer'
        };
        deepStrictEqual(actual, expected);
      });

      it('should throw a CodeVerifierNotFound if Code Verifier not exists or is not valid', async () => {
        class AppController {
          @Post('/token')
          token() {
            return new HttpResponseBadRequest({
              error: 'bad request'
            });
          }
        }

        server = (await createApp(AppController)).listen(3000);

        const ctx = new Context({
          cookies: {
            [STATE_COOKIE_NAME]: 'xxx'
          },
          query: {
            code: 'an_authorization_code',
            state: 'xxx',
          },
        });

        try {
          await provider.getTokens(ctx);
          throw new Error('getTokens should have thrown a CodeVerifierNotFound.');
        } catch (error: any) {
          if (!(error instanceof CodeVerifierNotFound)) {
            throw error;
          }
        }
      })
    });
  });

});

describe('Abstract Provider With PKCE and Plain Method', () => {
  class ConcreteProvider extends AbstractProvider<any, any> {
    protected configPaths = {
      clientId: 'settings.social.example.clientId',
      clientSecret: 'settings.social.example.clientSecret',
      redirectUri: 'settings.social.example.redirectUri'
    };
    protected usePKCE: boolean = true;
    protected useCodeVerifierAsCodeChallenge = true;
    protected authEndpoint = 'https://example2.com/auth';
    protected tokenEndpoint = 'http://localhost:3000/token';

    async getUserInfoFromTokens(tokens: SocialTokens) {
      throw new Error('Method not implemented.');
    }
  }

  let provider: ConcreteProvider;
  const clientId = 'clientIdXXX';
  const clientSecret = 'clientSecretYYY';
  const redirectUri = 'https://example.com/callback';

  beforeEach(() => {
    Config.set('settings.social.example.clientId', clientId);
    Config.set('settings.social.example.clientSecret', clientSecret);
    Config.set('settings.social.example.redirectUri', redirectUri);
    Config.set('settings.logger.logHttpRequests', false);

    provider = createService(ConcreteProvider);
  });

  afterEach(() => {
    Config.remove('settings.social.example.clientId');
    Config.remove('settings.social.example.clientSecret');
    Config.remove('settings.social.example.redirectUri');
    Config.remove('settings.logger.logHttpRequests');
    Config.remove('settings.social.cookie.secure');
    Config.remove('settings.social.cookie.domain');
  });

  describe('has a "createHttpResponseWithConsentPageUrl" method that', () => {
    describe('should return an HttpResponse object', () => {

      beforeEach(() => {
        Config.set('settings.social.secret.codeVerifierSecret', 'SECRET');
      });

      afterEach(() => {
        Config.remove('settings.social.secret.codeVerifierSecret');
      });

      it('with a consentPageUrl which contains a client ID, a response type, a redirect URI, code_challenge and code_challenge_method (plain) if pkce enabled.', async () => {
        const response = await provider.createHttpResponseWithConsentPageUrl();
        ok(response.body.consentPageUrl.startsWith(
          'https://example2.com/auth?'
          + 'response_type=code&'
          + 'client_id=clientIdXXX&'
          + 'redirect_uri=https%3A%2F%2Fexample.com%2Fcallback'
        ));
        const searchParams = new URLSearchParams(response.body.consentPageUrl);
        ok(searchParams.get('code_challenge'));
        strictEqual(searchParams.get('code_challenge_method'), 'plain');
      });
    });
  });
});

function encryptHelper(message: string, iv: Buffer, secret: string): string {
  // Hash secret
  const hashedSecret = crypto.createHash('sha256').update(secret).digest();

  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-ctr', hashedSecret, iv); // aes-256-ctr is default

  // Encrypt data, concat final
  const data = cipher.update(Buffer.from(message));
  const encryptedMessage = Buffer.concat([data, cipher.final()])

  return `${iv.toString('base64')}${encryptedMessage.toString('base64')}`
}