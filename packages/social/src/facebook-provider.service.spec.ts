// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Context, createApp, createService, Get, HttpResponseBadRequest, HttpResponseOK } from '@foal/core';
import { SocialTokens } from './abstract-provider.service';
import { FacebookProvider, UserInfoError } from './facebook-provider.service';

describe('FacebookProvider', () => {

  describe('has a "getUserInfoFromTokens" that', () => {

    class FacebookProvider2 extends FacebookProvider {
      userInfoEndpoint = 'http://localhost:3000/users/me';
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

    it('should send a request with the access token and the default user info parameters '
        + 'and return the response body.', async () => {

      const userInfo = { email: 'john@foalts.org' };

      class AppController {
        @Get('/users/me')
        token(ctx: Context) {
          const { access_token, fields } = ctx.request.query;
          strictEqual(access_token, 'an_access_token');
          strictEqual(fields, 'id,name,email');
          return new HttpResponseOK(userInfo);
        }
      }

      server = createApp(AppController).listen(3000);

      const tokens: SocialTokens = {
        access_token: 'an_access_token',
        token_type: 'token_type'
      };

      const actual = await provider.getUserInfoFromTokens(tokens);
      deepStrictEqual(actual, userInfo);
    });

    it('should throw a UserInfoError if the user info endpoint returns an error.', async () => {
      class AppController {
        @Get('/users/me')
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
        await provider.getUserInfoFromTokens(tokens);
        throw new Error('getUserInfoFromTokens should have thrown a TokenError.');
      } catch (error) {
        if (!(error instanceof UserInfoError)) {
          throw error;
        }
        deepStrictEqual(error.error, {
          error: 'bad request'
        });
      }
    });

  });

});
