// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import { createService } from '@foal/core';
import { sign } from 'jsonwebtoken';

// FoalTS
import { SocialTokens } from './abstract-provider.service';
import { GoogleProvider, InvalidJWTError } from './google-provider.service';

describe('GoogleProvider', () => {

  describe('has a "getUserFromTokens" that', () => {

    // TODO: Maybe improve this.
    it('should throw an InvalidJWTError if the id_token is not a valid JWT.', () => {
      const tokens: SocialTokens = {
        access_token: 'xxx',
        id_token: 'x.y.z',
        token_type: 'bearer',
      };

      const provider = createService(GoogleProvider);

      try {
        provider.getUserFromTokens(tokens);
        throw new Error('The "getUserFromTokens" method should have thrown an InvalidJWTError.');
      } catch (error) {
        if (!(error instanceof InvalidJWTError)) {
          throw error;
        }
        strictEqual(error.message, 'The ID token returned by Google is not a valid JWT: Unexpected end of JSON input.');
      }
    });

    it('should decode the OpenID token.', () => {
      const payload = { email: 'mary@foalts.org' };

      const idToken = sign(payload, 'secret', { noTimestamp: true });
      const tokens: SocialTokens = {
        access_token: 'xxx',
        id_token: idToken,
        token_type: 'bearer',
      };

      const provider = createService(GoogleProvider);
      const user = provider.getUserFromTokens(tokens);

      deepStrictEqual(user, payload);
    });

  });

});
