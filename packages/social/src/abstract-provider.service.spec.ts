// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';
import { URLSearchParams } from 'url';

// 3p
import {
  ConfigMock,
  Context,
  createApp,
  createService,
  HttpResponseBadRequest,
  HttpResponseOK,
  isHttpResponseRedirect,
  Post
} from '@foal/core';

// FoalTS
import {
  AbstractProvider,
  AuthorizationError,
  InvalidStateError,
  SocialTokens,
  TokenError
} from './abstract-provider.service';

const STATE_COOKIE_NAME = 'oauth2-state';

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

  class ConcreteProvider extends AbstractProvider<any, any> {
    protected configPaths = {
      clientId: 'settings.social.example.clientId',
      clientSecret: 'settings.social.example.clientSecret',
      redirectUri: 'settings.social.example.redirectUri'
    };
    protected authEndpoint = 'https://example2.com/auth';
    protected tokenEndpoint = 'http://localhost:3000/token';
    getUserInfoFromTokens(tokens: SocialTokens) {
      throw new Error('Method not implemented.');
    }
  }

  let provider: ConcreteProvider;
  let configInstance: ConfigMock;
  const clientId = 'clientIdXXX';
  const clientSecret = 'clientSecretYYY';
  const redirectUri = 'https://example.com/callback';

  beforeEach(() => {
    configInstance = new ConfigMock();
    configInstance.set('settings.social.example.clientId', clientId);
    configInstance.set('settings.social.example.clientSecret', clientSecret);
    configInstance.set('settings.social.example.redirectUri', redirectUri);

    provider = createService(ConcreteProvider, { configInstance });
  });

  describe('has a "redirect" method that', () => {

    it('should return an HttpResponseRedirect object.', async () => {
      const result = await provider.redirect();
      strictEqual(isHttpResponseRedirect(result), true);
    });

    describe('should return an HttpResponseRedirect object', () => {

      it('with a redirect path which contains a client ID, a response type, a redirect URI.', async () => {
        const response = await provider.redirect();
        ok(response.path.startsWith(
          'https://example2.com/auth?'
          + 'response_type=code&'
          + 'client_id=clientIdXXX&'
          + 'redirect_uri=https%3A%2F%2Fexample.com%2Fcallback'
        ));
      });

      it('with a redirect path which does not contain a scope if none was provided.', async () => {
        const response = await provider.redirect();
        const searchParams = new URLSearchParams(response.path);

        strictEqual(searchParams.get('scope'), null);
      });

      it('with a redirect path which contains the scopes if any are provided by the class.', async () => {
        class ConcreteProvider2 extends ConcreteProvider {
          defaultScopes = [ 'scope1', 'scope2' ];
        }
        provider = createService(ConcreteProvider2, { configInstance });

        const response = await provider.redirect();
        const searchParams = new URLSearchParams(response.path);

        strictEqual(searchParams.get('scope'), 'scope1 scope2');
      });

      it('with a redirect path which contains the scopes if any are provided by the class'
          + ' (custom separator).', async () => {
        class ConcreteProvider2 extends ConcreteProvider {
          defaultScopes = [ 'scope1', 'scope2' ];
          scopeSeparator = ',';
        }
        provider = createService(ConcreteProvider2, { configInstance });

        const response = await provider.redirect();
        const searchParams = new URLSearchParams(response.path);

        strictEqual(searchParams.get('scope'), 'scope1,scope2');
      });

      it('with a redirect path which contains the scopes if any are provided to the method.', async () => {
        class ConcreteProvider2 extends ConcreteProvider {
          // This checks that the default scopes will be override.
          defaultScopes = [ 'scope1', 'scope2' ];
        }
        provider = createService(ConcreteProvider2, { configInstance });

        const response = await provider.redirect({
          scopes: [ 'scope3', 'scope4' ]
        });
        const searchParams = new URLSearchParams(response.path);

        strictEqual(searchParams.get('scope'), 'scope3 scope4');
      });

      it('with a generated state to protect against CSRF attacks.', async () => {
        const response = await provider.redirect();
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

        const searchParams = new URLSearchParams(response.path);
        const stateParamValue = searchParams.get('state');
        if (typeof stateParamValue !== 'string') {
          throw new Error('State parameter not found.');
        }

        strictEqual(stateParamValue, stateCookieValue);
        notStrictEqual(stateCookieValue.length, 0);
      });

      it('with a generated state in a cookie whose secure option is defined with the config.', async () => {
        configInstance.set('settings.social.cookie.secure', true);

        const response = await provider.redirect();
        const { options } = response.getCookie(STATE_COOKIE_NAME);

        strictEqual(options.secure, true);
      });

      it('with a redirect path which contains extra parameters if any are provided to the method.', async () => {
        provider = createService(ConcreteProvider, { configInstance });

        const response = await provider.redirect({}, { foo: 'bar2' });
        const searchParams = new URLSearchParams(response.path);

        strictEqual(searchParams.get('foo'), 'bar2');
      });

    });

  });

  describe('has a "getTokens" method that', () => {

    let server;

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
      } catch (error) {
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
      } catch (error) {
        if (!(error instanceof AuthorizationError)) {
          throw error;
        }
        strictEqual(error.error, 'access_denied');
        strictEqual(error.errorDescription, 'yyy');
        strictEqual(error.errorUri, 'zzz');
      }
    });

    it('should send a request which contains a grant type, a code, a redirect URI,'
      + 'a client ID and a client secret and return the response body.', async () => {
      class AppController {
        @Post('/token')
        token(ctx: Context) {
          strictEqual(ctx.request.headers.accept, 'application/json');
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

      server = createApp(AppController).listen(3000);

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

    it('should throw a TokenError if the token endpoint returns an error.', async () => {
      class AppController {
        @Post('/token')
        token() {
          return new HttpResponseBadRequest({
            error: 'bad request'
          });
        }
      }

      server = createApp(AppController).listen(3000);

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
      } catch (error) {
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

    let server;

    beforeEach(() => {
      provider = createService(ConcreteProvider, { configInstance });
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

      server = createApp(AppController).listen(3000);

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
        getUserInfoFromTokens(tokens: SocialTokens) {
          // Do not throw an error.
        }
      }
      provider = createService(ConcreteProvider2, { configInstance });

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

      server = createApp(AppController).listen(3000);

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
        getUserInfoFromTokens(tokens: SocialTokens, params?: any) {
          calledWithTokens = tokens;
          calledWithParams = params || null;
        }
      }
      provider = createService(ConcreteProvider2, { configInstance });

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

      server = createApp(AppController).listen(3000);

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
      provider = createService(ConcreteProvider2, { configInstance });

      const { userInfo } = await provider.getUserInfo(ctx);
      strictEqual(userInfo, expectedUserInfo);
    });

  });

});
