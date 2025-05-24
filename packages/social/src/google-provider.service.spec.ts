// std
import { deepStrictEqual, strictEqual } from 'assert';

// 3p
import { createService } from '@foal/core';
import { sign } from 'jsonwebtoken';

// FoalTS
import { SocialTokens } from './abstract-provider.service';
import { GoogleProvider, InvalidJWTError } from './google-provider.service';

describe('InvalidJWTError', () => {

  it('should have a "message" property.', () => {
    const error = new InvalidJWTError('foobar');

    strictEqual(error.message, 'foobar');
  });

  it('should have a "name" property.', () => {
    const error = new InvalidJWTError();

    strictEqual(error.name, 'InvalidJWTError');
  });

});

describe('GoogleProvider', () => {

  describe('has a "getUserInfoFromTokens" that', () => {

    // TODO: Maybe improve this.
    it('should throw an InvalidJWTError if the id_token is not a valid JWT.', () => {
      const tokens: SocialTokens = {
        access_token: 'xxx',
        id_token: 'x.ew.z',
        token_type: 'bearer',
      };

      const provider = createService(GoogleProvider);

      try {
        provider.getUserInfoFromTokens(tokens);
        throw new Error('The "getUserInfoFromTokens" method should have thrown an InvalidJWTError.');
      } catch (error: any) {
        if (!(error instanceof InvalidJWTError)) {
          throw error;
        }
        strictEqual(error.message, `The ID token returned by Google is not a valid JWT: Expected property name or '}' in JSON at position 1 (line 1 column 2).`);
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
      const user = provider.getUserInfoFromTokens(tokens);

      deepStrictEqual(user, payload);
    });

  });

});
