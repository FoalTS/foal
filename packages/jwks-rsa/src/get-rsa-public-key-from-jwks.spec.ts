// std
import { strictEqual } from 'assert';
import { Server } from 'http';

// 3p
import { createApp, Get, HttpResponseOK } from '@foal/core';
import { isInvalidTokenError } from '@foal/jwt';

// FoalTS
import { getRSAPublicKeyFromJWKS, Options } from './get-rsa-public-key-from-jwks';

describe('getRSAPublicKeyFromJWKS', () => {

  describe('return a function that', () => {

    let server: Server;

    class AppController {
      @Get('/.well-known/jwks.json')
      getJWKS() {
        return new HttpResponseOK({
          keys: [
            {
              alg: 'RS256',
              e: 'AQAB',
              kid: 'ccccc',
              kty: 'RSA',
              n: 'bbbbb',
              use: 'sig',
              x5c: [
                'aaaaa'
              ],
              x5t: 'ddddd'
            }
          ]
        });
      }
    }

    afterEach(() => {
      if (server) {
        server.close();
      }
    });

    beforeEach(() => server = createApp(AppController).listen(3000));

    // TODO: Remove this before merging the PR.
    const defaultOptions: Options = { jwksUri: '' };

    it('should reject an InvalidTokenError if header.alg is not RS256.', () => {
      const fn = getRSAPublicKeyFromJWKS(defaultOptions);
      return fn({ alg: 'HS256' }, {})
        .then(() => { throw new Error('An InvalidTokenError should have been thrown.'); })
        .catch(err => {
          if (!isInvalidTokenError(err)) {
            throw new Error('An InvalidTokenError should have been thrown.');
          }
          strictEqual(err.message, 'invalid algorithm');
        });
    });

    it('should reject an InvalidTokenError if no kid is provided.', () => {
      const fn = getRSAPublicKeyFromJWKS(defaultOptions);
      return fn({ alg: 'RS256' }, {})
        .then(() => { throw new Error('An InvalidTokenError should have been thrown.'); })
        .catch(err => {
          if (!isInvalidTokenError(err)) {
            throw new Error('An InvalidTokenError should have been thrown.');
          }
          strictEqual(err.message, 'missing kid');
        });
    });

    it('should reject an InvalidTokenError if the kid does not match any keys.', () => {
      const fn = getRSAPublicKeyFromJWKS({
        jwksUri: 'http://localhost:3000/.well-known/jwks.json'
      });
      return fn({ alg: 'RS256', kid: '345' }, {})
        .then(() => { throw new Error('An InvalidTokenError should have been thrown.'); })
        .catch(err => {
          if (!isInvalidTokenError(err)) {
            throw new Error('An InvalidTokenError should have been thrown.');
          }
          strictEqual(err.message, 'invalid kid');
        });
    });

    it('should reject errors returned from the JWKS client if they are not SigningKeyNotFoundError.', () => {
      server.close();
      const fn = getRSAPublicKeyFromJWKS({
        jwksUri: 'http://localhost:3000/.well-known/jwks.json'
      });
      return fn({ alg: 'RS256', kid: '345' }, {})
        .then(() => { throw new Error('An InvalidTokenError should have been thrown.'); })
        .catch(err => strictEqual(err.message, 'connect ECONNREFUSED 127.0.0.1:3000'));
    });

    it('should return the public key that matches the given kid.', async () => {
      const fn = getRSAPublicKeyFromJWKS({
        jwksUri: 'http://localhost:3000/.well-known/jwks.json'
      });
      const publicKey = await fn({ alg: 'RS256', kid: 'ccccc' }, {});
      strictEqual(publicKey, '-----BEGIN CERTIFICATE-----\naaaaa\n-----END CERTIFICATE-----\n');
    });

  });

});
