// FoalTS
import { Context, dependency, Get } from '@foal/core';
import { GoogleProvider } from '@foal/social';

describe('Feature: Adding social auth controllers', () => {

  it('Example: Simple example.', async () => {

    // This test only tests that the code compiles.

    /* ======================= DOCUMENTATION BEGIN ======================= */

    // tslint:disable-next-line:no-unused-variable
    class AuthController {
      @dependency
      google: GoogleProvider;

      @Get('/signin/google')
      redirectToGoogle() {
        // Your "Login In with Google" button should point to this route.
        // The user will be redirected to Google auth page.
        return this.google.createHttpResponseWithConsentPageUrl({ isRedirection: true });
      }

      @Get('/signin/google/callback')
      async handleGoogleRedirection(ctx: Context) {
        // Once the user gives their permission to log in with Google, the OAuth server
        // will redirect the user to this route. This route must match the redirect URI.
        // tslint:disable-next-line:no-unused-variable
        const { userInfo, tokens } = await this.google.getUserInfo(ctx);

        // Do something with the user information AND/OR the access token.
        // If you only need the access token, you can call the "getTokens" method.

        // The method usually ends with a HttpResponseRedirect object as returned value.
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

  });

});
