// std
import { notStrictEqual, ok, strictEqual } from 'assert';
import { URLSearchParams } from 'url';

// 3p
import { ConfigMock, createService, isHttpResponseRedirect } from '@foal/core';

// FoalTS
import { AbstractProvider, SocialTokens } from './abstract-provider.service';

const STATE_COOKIE_NAME = 'oauth2-state';

describe('AbstractProvider', () => {

  class ConcreteProvider extends AbstractProvider {
    protected configPaths = {
      clientId: 'settings.social.example.clientId',
      clientSecret: 'settings.social.example.clientSecret',
      redirectUri: 'settings.social.example.redirectUri'
    };
    protected authEndpoint = 'https://example2.com/auth';
    protected tokenEndpoint = 'https://example2.com/token';
    getUserFromTokens(tokens: SocialTokens) {
      throw new Error('Method not implemented.');
    }
  }

  let provider: ConcreteProvider;
  let configInstance: ConfigMock;

  before(() => {
    configInstance = new ConfigMock();
    configInstance.set('settings.social.example.clientId', 'xxx');
    configInstance.set('settings.social.example.clientSecret', 'yyy');
    configInstance.set('settings.social.example.redirectUri', 'https://example.com/callback');

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
          'https://example2.com/auth?response_type=code&client_id=xxx&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback'
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
        if (typeof stateCookieValue !== 'string') {
          throw new Error('Cookie not found.');
        }

        const searchParams = new URLSearchParams(response.path);
        const stateParamValue = searchParams.get('state');
        if (typeof stateParamValue !== 'string') {
          throw new Error('State parameter not found.');
        }

        strictEqual(stateParamValue, stateCookieValue);
        notStrictEqual(stateCookieValue.length, 0);
      });

      it('with a redirect path which contains extra parameters if any are provided by the class.', async () => {
        class ConcreteProvider2 extends ConcreteProvider {
          baseAuthEndpointParams = {
            foo: 'bar'
          };
        }
        provider = createService(ConcreteProvider2, { configInstance });

        const response = await provider.redirect();
        const searchParams = new URLSearchParams(response.path);

        strictEqual(searchParams.get('foo'), 'bar');
      });

      it('with a redirect path which contains extra parameters if any are provided to the method.', async () => {
        class ConcreteProvider2 extends ConcreteProvider {
          baseAuthEndpointParams = {
            // This checks that the base params will be extended.
            foo: 'bar',
            foobar: 'barfoo'
          };
        }
        provider = createService(ConcreteProvider2, { configInstance });

        const response = await provider.redirect({
          params: { foo: 'bar2' }
        });
        const searchParams = new URLSearchParams(response.path);

        strictEqual(searchParams.get('foo'), 'bar2');
        strictEqual(searchParams.get('foobar'), 'barfoo');
      });

    });

  });

});
