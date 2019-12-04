// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Context, createApp, createService, Get, HttpResponseBadRequest, HttpResponseOK } from '@foal/core';
import { SocialTokens } from './abstract-provider.service';
import { FacebookProvider, UserInfoError } from './facebook-provider.service';

describe('UserInfoError', () => {

  it('should have a "message" property.', () => {
    const err = {
      foo: 'bar'
    };
    const error = new UserInfoError(err);

    strictEqual(
      error.message,
      `The resource server returned an error. Impossible to access the user's information.
{
  "foo": "bar"
}`
    );
  });

  it('should have a "name" property.', () => {
    const error = new UserInfoError({});

    strictEqual(error.name, 'UserInfoError');
  });

  it('should have an "error" property.', () => {
    const err = {
      foo: 'bar'
    };
    const error = new UserInfoError(err);

    strictEqual(error.error, err);
  });

});

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

      server = createApp(AppController).listen(3000);

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

      server = createApp(AppController).listen(3000);

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
