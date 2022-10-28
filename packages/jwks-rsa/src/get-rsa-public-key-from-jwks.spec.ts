// std
import { rejects, strictEqual } from 'assert';
import { Server } from 'http';

// 3p
import { createApp, Get, HttpResponseOK } from '@foal/core';
import { isInvalidTokenError } from '@foal/jwt';

// FoalTS
import { getRSAPublicKeyFromJWKS, Options } from './get-rsa-public-key-from-jwks';

describe('getRSAPublicKeyFromJWKS', () => {

  describe('return a function that', () => {

    let server: Server;
    const kid = 'NjVBRjY5MDlCMUIwNzU4RTA2QzZFMDQ4QzQ2MDAyQjVDNjk1RTM2Qg';

    class AppController {
      @Get('/.well-known/jwks.json')
      getJWKS() {
        return new HttpResponseOK({
          // Example found at: https://auth0.com/blog/navigating-rs256-and-jwks/
          keys: [
            {
              alg: 'RS256',
              kty: 'RSA',
              use: 'sig',
              x5c: [
                'MIIC+DCCAeCgAwIBAgIJBIGjYW6hFpn2MA0GCSqGSIb3DQEBBQUAMCMxITAfBgNVBAMTGGN1c3RvbWVyLWRlbW9zLmF1dGgwLmNvbTAeFw0xNjExMjIyMjIyMDVaFw0zMDA4MDEyMjIyMDVaMCMxITAfBgNVBAMTGGN1c3RvbWVyLWRlbW9zLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMnjZc5bm/eGIHq09N9HKHahM7Y31P0ul+A2wwP4lSpIwFrWHzxw88/7Dwk9QMc+orGXX95R6av4GF+Es/nG3uK45ooMVMa/hYCh0Mtx3gnSuoTavQEkLzCvSwTqVwzZ+5noukWVqJuMKNwjL77GNcPLY7Xy2/skMCT5bR8UoWaufooQvYq6SyPcRAU4BtdquZRiBT4U5f+4pwNTxSvey7ki50yc1tG49Per/0zA4O6Tlpv8x7Red6m1bCNHt7+Z5nSl3RX/QYyAEUX1a28VcYmR41Osy+o2OUCXYdUAphDaHo4/8rbKTJhlu8jEcc1KoMXAKjgaVZtG/v5ltx6AXY0CAwEAAaMvMC0wDAYDVR0TBAUwAwEB/zAdBgNVHQ4EFgQUQxFG602h1cG+pnyvJoy9pGJJoCswDQYJKoZIhvcNAQEFBQADggEBAGvtCbzGNBUJPLICth3mLsX0Z4z8T8iu4tyoiuAshP/Ry/ZBnFnXmhD8vwgMZ2lTgUWwlrvlgN+fAtYKnwFO2G3BOCFw96Nm8So9sjTda9CCZ3dhoH57F/hVMBB0K6xhklAc0b5ZxUpCIN92v/w+xZoz1XQBHe8ZbRHaP1HpRM4M7DJk2G5cgUCyu3UBvYS41sHvzrxQ3z7vIePRA4WF4bEkfX12gvny0RsPkrbVMXX1Rj9t6V7QXrbPYBAO+43JvDGYawxYVvLhz+BJ45x50GFQmHszfY3BR9TPK8xmMmQwtIvLu1PMttNCs7niCYkSiUv2sc2mlq1i3IashGkkgmo='
              ],
              n: 'yeNlzlub94YgerT030codqEztjfU_S6X4DbDA_iVKkjAWtYfPHDzz_sPCT1Axz6isZdf3lHpq_gYX4Sz-cbe4rjmigxUxr-FgKHQy3HeCdK6hNq9ASQvMK9LBOpXDNn7mei6RZWom4wo3CMvvsY1w8tjtfLb-yQwJPltHxShZq5-ihC9irpLI9xEBTgG12q5lGIFPhTl_7inA1PFK97LuSLnTJzW0bj096v_TMDg7pOWm_zHtF53qbVsI0e3v5nmdKXdFf9BjIARRfVrbxVxiZHjU6zL6jY5QJdh1QCmENoejj_ytspMmGW7yMRxzUqgxcAqOBpVm0b-_mW3HoBdjQ',
              e: 'AQAB',
              kid,
              x5t: 'NjVBRjY5MDlCMUIwNzU4RTA2QzZFMDQ4QzQ2MDAyQjVDNjk1RTM2Qg'
            }
          ]});
      }
    }

    afterEach(() => {
      if (server) {
        server.close();
      }
    });

    beforeEach(async () => server = (await createApp(AppController)).listen(3000));

    // TODO: Remove this before merging the PR.
    const defaultOptions: Options = { jwksUri: '' };

    it('should reject an InvalidTokenError if header.alg is not RS256.', () => {
      const fn = getRSAPublicKeyFromJWKS(defaultOptions);

      return rejects(
        () => fn({ alg: 'HS256' }, {}),
        (err: any) => {
          if (!isInvalidTokenError(err)) {
            throw new Error('An InvalidTokenError should have been thrown.');
          }
          strictEqual(err.message, 'invalid algorithm');
          return true;
        }
      );
    });

    it('should reject an InvalidTokenError if no kid is provided.', () => {
      const fn = getRSAPublicKeyFromJWKS(defaultOptions);

      return rejects(
        () => fn({ alg: 'RS256' }, {}),
        (err: any) => {
          if (!isInvalidTokenError(err)) {
            throw new Error('An InvalidTokenError should have been thrown.');
          }
          strictEqual(err.message, 'missing kid');
          return true;
        }
      );
    });

    it('should reject an InvalidTokenError if the kid does not match any keys.', () => {
      const fn = getRSAPublicKeyFromJWKS({
        jwksUri: 'http://localhost:3000/.well-known/jwks.json'
      });

      return rejects(
        () => fn({ alg: 'RS256', kid: '345' }, {}),
        (err: any) => {
          if (!isInvalidTokenError(err)) {
            throw new Error('An InvalidTokenError should have been thrown.');
          }
          strictEqual(err.message, 'invalid kid');
          return true;
        }
      );
    });

    it('should reject errors returned from the JWKS client if they are not SigningKeyNotFoundError.', () => {
      server.close();
      const fn = getRSAPublicKeyFromJWKS({
        jwksUri: 'http://localhost:3000/.well-known/jwks.json'
      });

      return rejects(
        () => fn({ alg: 'RS256', kid: '345' }, {}),
        (err: any) => err.code === 'ECONNREFUSED',
      );
    });

    it('should return the public key that matches the given kid.', async () => {
      const fn = getRSAPublicKeyFromJWKS({
        jwksUri: 'http://localhost:3000/.well-known/jwks.json'
      });
      const publicKey = await fn({ alg: 'RS256', kid }, {});
      strictEqual(publicKey.startsWith('-----BEGIN PUBLIC KEY-----\n'), true);
      strictEqual(publicKey.endsWith('-----END PUBLIC KEY-----\n'), true);
    });

  });

});
