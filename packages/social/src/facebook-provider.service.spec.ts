// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Context, createApp, createService, Get, HttpResponseBadRequest, HttpResponseOK } from '@foal/core';
import { SocialTokens } from './abstract-provider.service';
import { FacebookProvider, ProfileError } from './facebook-provider.service';

describe('FacebookProvider', () => {

  describe('has a "getUserFromTokens" that', () => {

    class FacebookProvider2 extends FacebookProvider {
      profileEndpoint = 'http://localhost:3000/profile';
    }

    let server;
    let provider: FacebookProvider;

    beforeEach(() => {
      provider = createService(FacebookProvider2);
    });

    afterEach(() => {
      if (server) {
        server.close();
      }
    });

    it('should send a request with the access token and the default profile parameters '
        + 'and return the response body.', async () => {

      const profile = { email: 'john@foalts.org' };

      class AppController {
        @Get('/profile')
        token(ctx: Context) {
          const { access_token, fields } = ctx.request.query;
          strictEqual(access_token, 'an_access_token');
          strictEqual(fields, 'id,name,email,verified,link');
          return new HttpResponseOK(profile);
        }
      }

      server = createApp(AppController).listen(3000);

      const tokens: SocialTokens = {
        access_token: 'an_access_token',
        token_type: 'token_type'
      };

      const actual = await provider.getUserFromTokens(tokens);
      deepStrictEqual(actual, profile);
    });

    it('should throw a ProfileError if the profile endpoint returns an error.', async () => {
      class AppController {
        @Get('/profile')
        token() {
          return new HttpResponseBadRequest({
            error: 'bad request'
          });
        }
      }

      server = createApp(AppController).listen(3000);

      const tokens: SocialTokens = {
        access_token: 'an_access_token',
        token_type: 'token_type'
      };

      try {
        await provider.getUserFromTokens(tokens);
        throw new Error('getUserFromTokens should have thrown a TokenError.');
      } catch (error) {
        if (!(error instanceof ProfileError)) {
          throw error;
        }
        deepStrictEqual(error.error, {
          error: 'bad request'
        });
      }
    });

  });

});
