// std
import { deepStrictEqual, strictEqual } from 'assert';
import { Server } from 'http';

// 3p
import { Config, Context, createApp, createService, Get, HttpResponseBadRequest, HttpResponseOK } from '@foal/core';

// FoalTS
import { SocialTokens } from './abstract-provider.service';
import { FacebookProvider } from './facebook-provider.service';
import { UserInfoError } from './user-info.error';

describe('FacebookProvider', () => {

  describe('has a "getUserInfoFromTokens" that', () => {

    class FacebookProvider2 extends FacebookProvider {
      userInfoEndpoint = 'http://localhost:3000/users/me';
    }

    let server: Server;
    let provider: FacebookProvider;

    beforeEach(() => {
      provider = createService(FacebookProvider2);
      Config.set('settings.logger.logHttpRequests', false);
    });

    afterEach(() => {
      Config.remove('settings.logger.logHttpRequests');
      if (server) {
        server.close();
      }
    });

    it('should send a request with the access token and the default fields and return the response body.', async () => {
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

      server = (await createApp(AppController)).listen(3000);

      const tokens: SocialTokens = {
        access_token: 'an_access_token',
        token_type: 'token_type'
      };

      const actual = await provider.getUserInfoFromTokens(tokens);
      deepStrictEqual(actual, userInfo);
    });

    it('should accept custom fields to use in the request.', async () => {
      class AppController {
        @Get('/users/me')
        token(ctx: Context) {
          const { fields } = ctx.request.query;
          strictEqual(fields, 'first_name,last_name');
          return new HttpResponseOK({});
        }
      }

      server = (await createApp(AppController)).listen(3000);

      const tokens: SocialTokens = {
        access_token: 'an_access_token',
        token_type: 'token_type'
      };

      await provider.getUserInfoFromTokens(tokens, {
        fields: [ 'first_name', 'last_name' ]
      });
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

      server = (await createApp(AppController)).listen(3000);

      const tokens: SocialTokens = {
        access_token: 'an_access_token',
        token_type: 'token_type'
      };

      try {
        await provider.getUserInfoFromTokens(tokens);
        throw new Error('getUserInfoFromTokens should have thrown a TokenError.');
      } catch (error: any) {
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
