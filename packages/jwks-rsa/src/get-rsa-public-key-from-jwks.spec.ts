// FoalTS
import { strictEqual } from 'assert';
import { getRSAPublicKeyFromJWKS } from './get-rsa-public-key-from-jwks';

describe('getRSAPublicKeyFromJWKS', () => {

  describe('return a function that', () => {

    it('should return an empty string if header.alg is not RS256.', async () => {
      const fn = getRSAPublicKeyFromJWKS({});
      strictEqual(await fn({ alg: 'HS256' }, {}), '');
    });

  });

});
