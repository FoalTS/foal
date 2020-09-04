// std
import { deepStrictEqual, notStrictEqual, rejects, strictEqual } from 'assert';

// 3p
import { Config, HttpResponse, HttpResponseOK } from '@foal/core';
import { decode, sign, verify } from 'jsonwebtoken';

// FoalTS
import {
  JWT_DEFAULT_COOKIE_NAME,
  JWT_DEFAULT_COOKIE_PATH,
  JWT_DEFAULT_CSRF_COOKIE_NAME,
  JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED
} from './constants';
import { setAuthCookie } from './set-auth-cookie';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAtuRLHfd89H2tst8KirenuqqfKPZteg33daUdKUQtuPGpzkth
O3M9oXXQGvrQdSVvJ/8ZLjvhuD7Ezkmt9p4GyMw9SEcq9rxxmhquI/ky9puhbTbl
NfdMPo+pI19CdvVAdea2rQz+oB9NmzbCKJY4yO/qyP+BDM5/ZsiiNxyHqL3qOD1X
NN5zX4LgOOkVy0f2xrl23IQP0gduA+d4Bik0mCZTpOwuJEza2JzmONl8zWBjxaxL
vP6V09ASpWvcA5jMWPoHdRTxkmir6/+wma9tZer0fpYAnvs3eH/FmyB8Si2yr9Sv
6lBHNfWvD56K7p9crJAf/blBV9HenCL3qPH1aQIDAQABAoIBAD5gfn4p+qQoeSWY
jK/jE4HGz6HY6l3Gha/KMLfyWOXLBm8lpnPwSgTXebK5+H771X1+s8fhBIsiXV0+
I+cI3qd9gSk1nKGqg9RbZSk/xPH3AoeNQX+2aHqt5LH7u193JhUQKx26YN2bz4ww
kOfm1Fcz/I+xFQKZKzqTE0BYqqwSBey1QE0nu6v9Olnps9gpamfCVVSkZWYoBOCw
FQhmAVhXQmudYvdO50fCl1yZ1erPCy5izF+ieyXFYYoouiLNQXh8ry4JbYBgJmh+
7VDhHTfPjbehLu2g4OCv6Y9DvLeW8wltEsyPUUdBfxTs5POW44XVHDVwUJ2uul1s
Q0JnpUECgYEA59vHIBhbV9z7V4DvNpg2IILrPTlq6Cmmhm4z5zD+qXQLrMJutYZa
55x+AhVYu+g/o5Lmtryotbx6eLFn+1RKI0hLt2UYpotyqnW2RsZINc4NtVEOjLZP
wO25wduOKPBn3rk7m5UDGai3x8H1Xgq+CsDs/SE8oO53i866JKEUBisCgYEAye9M
1cc1fd9VzP0ytHseRMBFAR3DpT8KGeD11i/ugl0t8//+3J4bYXmUXUasVo6Tw1fP
uIYe9c2pcjF4MS7DtUbxqS6sQ5W9Tcc42rW8FWgSsUKdjQcXahArmdbgEcz+smyc
Df4M4ctU66C4FrYdhxm3owPs46/pWXGGgMROXLsCgYEA5h8WVd6W2m/z7neD9TXB
kycdf9i7KM4d/5LlZPMV7u3EoKUh6Hz/QJ3r2vmA5o+uihVFc91vvWDiVWQPBj40
jyw0KkPm4XXKSzElxr0J8o0ewfU/cZ2JLr1D/wqA4FUrYr2KUfLl7tOsBFGXzMzw
rg+pp9sTJ89HS7XUvoI5M50CgYAAjTHFh7TCskB2vd5MleWARJIrrZwiMGjjpzSk
sB7TplOAzhsxGRF0E7PvCUlhNyR6LRw5Icyl2Tj0QeRVJg6MyTPRxXnc+WS5+KhU
GJj56f3bFBaAExviQ0cLNYYJJmkvrZJDi4UXfMmvlxHJphewjcZtoI4eFRXrE59N
bLvWDwKBgCMtvnkV175B54xSIWzkLtxvxrnNUwXWZ6Ssx0d/heBYq8aicwxdAqxw
k+mSmjfJEsctgPC9MB3l15P2aXVH7sCj/biJEdQpdI8yELNhyH+E/KoOd5H/RO5R
vNake9KO02h3EyySfyV4aryHiKem63CnK2x4gxtFwVDu5VTgmmnz
-----END RSA PRIVATE KEY-----`;
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtuRLHfd89H2tst8Kiren
uqqfKPZteg33daUdKUQtuPGpzkthO3M9oXXQGvrQdSVvJ/8ZLjvhuD7Ezkmt9p4G
yMw9SEcq9rxxmhquI/ky9puhbTblNfdMPo+pI19CdvVAdea2rQz+oB9NmzbCKJY4
yO/qyP+BDM5/ZsiiNxyHqL3qOD1XNN5zX4LgOOkVy0f2xrl23IQP0gduA+d4Bik0
mCZTpOwuJEza2JzmONl8zWBjxaxLvP6V09ASpWvcA5jMWPoHdRTxkmir6/+wma9t
Zer0fpYAnvs3eH/FmyB8Si2yr9Sv6lBHNfWvD56K7p9crJAf/blBV9HenCL3qPH1
aQIDAQAB
-----END PUBLIC KEY-----`;
const secret = 'secretX';

describe('setAuthCookie', () => {

  let id: string;
  let token: string;
  let tokenWithExpDate: string;
  let tokenSignedWithSecret: string;
  let response: HttpResponse;

  beforeEach(() => {
    response = new HttpResponseOK();
    id = 'userIdX';
    token = sign({}, privateKey, { subject: id, algorithm: 'RS256' });
    tokenWithExpDate = sign({}, privateKey, { subject: id, expiresIn: 60 * 15, algorithm: 'RS256' });
    tokenSignedWithSecret = sign({}, secret, { subject: id, expiresIn: 60 * 15 });
  });

  async function testExpiration(cookieName: string) {
    await setAuthCookie(response, tokenWithExpDate);

    const { options } = response.getCookie(cookieName);

    const payload = decode(tokenWithExpDate);
    if (typeof payload === 'string' || payload === null) {
      throw new Error('Unexpected error.');
    }

    notStrictEqual(payload.exp, undefined);
    deepStrictEqual(options.expires, new Date(payload.exp * 1000));
  }

  describe('should set an auth cookie in the response', () => {

    context('given no configuration option is provided', () => {

      beforeEach(() => setAuthCookie(response, token));

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(value, token);
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.domain, undefined);
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.httpOnly, undefined);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.path, JWT_DEFAULT_COOKIE_PATH);
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.sameSite, undefined);
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.secure, undefined);
      });

      it('with the proper "expires" directive ("exp" claim in JWT).', async () => {
        await testExpiration(JWT_DEFAULT_COOKIE_NAME);
      });

      it('with the proper "expires" directive (no "exp" claim in JWT).', () => {
        const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
        strictEqual(options.expires, undefined);
      });

    });

    context('given configuration options are provided', () => {

      const cookieName = JWT_DEFAULT_COOKIE_NAME + '2';

      beforeEach(async () => {
        Config.set('settings.jwt.cookie.name', cookieName);
        Config.set('settings.jwt.cookie.domain', 'example.com');
        Config.set('settings.jwt.cookie.httpOnly', false);
        Config.set('settings.jwt.cookie.path', '/foo');
        Config.set('settings.jwt.cookie.sameSite', 'strict');
        Config.set('settings.jwt.cookie.secure', true);
        await setAuthCookie(response, token);
      });

      afterEach(() => {
        Config.remove('settings.jwt.cookie.name');
        Config.remove('settings.jwt.cookie.domain');
        Config.remove('settings.jwt.cookie.httpOnly');
        Config.remove('settings.jwt.cookie.path');
        Config.remove('settings.jwt.cookie.sameSite');
        Config.remove('settings.jwt.cookie.secure');
      });

      it('with the proper default name and value.', () => {
        const { value } = response.getCookie(cookieName);
        strictEqual(value, token);
      });

      it('with the proper default "domain" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.domain, 'example.com');
      });

      it('with the proper default "httpOnly" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.httpOnly, false);
      });

      it('with the proper default "path" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.path, '/foo');
      });

      it('with the proper default "sameSite" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.sameSite, 'strict');
      });

      it('with the proper default "secure" directive.', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.secure, true);
      });

      it('with the proper "expires" directive ("exp" claim in JWT).', async () => {
        await testExpiration(cookieName);
      });

      it('with the proper "expires" directive (no "exp" claim in JWT).', () => {
        const { options } = response.getCookie(cookieName);
        strictEqual(options.expires, undefined);
      });

    });

  });

  context('given the CSRF protection is enabled in the config', () => {

    beforeEach(() => {
      Config.set('settings.jwt.csrf.enabled', true);
      Config.set('settings.jwt.privateKey', privateKey);
    });

    afterEach(() => {
      Config.remove('settings.jwt.csrf.enabled');
      Config.remove('settings.jwt.privateKey');
      Config.remove('settings.jwt.secret');
    });

    describe('should set an auth cookie in the response', () => {

      context('given no configuration option is provided', () => {

        beforeEach(() => setAuthCookie(response, token));

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
          strictEqual(options.sameSite, JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED);
        });

      });

      context('given configuration options are provided', () => {

        beforeEach(async () => {
          Config.set('settings.jwt.cookie.sameSite', 'strict');
          await setAuthCookie(response, token);
        });

        afterEach(() => {
          Config.remove('settings.jwt.cookie.sameSite');
        });

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_COOKIE_NAME);
          strictEqual(options.sameSite, 'strict');
        });

      });

    });

    describe('should set a CSRF cookie in the response', () => {

      function testCsrfToken(csrfCookieName: string) {
        describe('which a is JWT that', () => {

          it('should contain a csrfToken generated randomly (256-bit base64url-encoded string).', () => {
            const { value } = response.getCookie(csrfCookieName);
            if (!value) {
              throw new Error('The cookie should have a value.');
            }

            const content = verify(value, publicKey);
            if (typeof content === 'string') {
              throw new Error('An error occured while decoding the JWT.');
            }

            strictEqual(typeof (content as any).csrfToken, 'string');
            strictEqual((content as any).csrfToken.length >= 43, true);
            strictEqual((content as any).csrfToken.length <= 44, true);
          });

          it('should use the "sub" of the given JWT.', () => {
            const { value } = response.getCookie(csrfCookieName);
            if (!value) {
              throw new Error('The cookie should have a value.');
            }

            const content = verify(value, publicKey);
            if (typeof content === 'string') {
              throw new Error('An error occured while decoding the JWT.');
            }

            strictEqual((content as any).sub, id);
          });

          it('should use the "exp" of the given JWT.', async () => {
            await setAuthCookie(response, tokenWithExpDate);

            const { value } = response.getCookie(csrfCookieName);
            if (!value) {
              throw new Error('The cookie should have a value.');
            }

            const content = verify(value, publicKey);
            if (typeof content === 'string') {
              throw new Error('An error occured while decoding the JWT.');
            }

            strictEqual((content as any).exp, (decode(tokenWithExpDate) as any).exp);
          });

          it('should use the algorithm of the given JWT.', async () => {
            Config.remove('settings.jwt.privateKey');
            Config.set('settings.jwt.secret', secret);

            await setAuthCookie(response, tokenSignedWithSecret);

            const { value } = response.getCookie(csrfCookieName);
            if (!value) {
              throw new Error('The cookie should have a value.');
            }

            const content = verify(value, secret, { complete: true });
            if (typeof content === 'string') {
              throw new Error('An error occured while decoding the JWT.');
            }

            strictEqual((content as any).header.alg, 'HS256');
          });

        });
      }

      it('should throw a comprehensive error if the given token is not a valid JWT.', async () => {
        rejects(
          () => setAuthCookie(response, 'xxxx'),
          {
            message: 'The given token is not a valid JWT.'
          }
        );
      });

      context('given no configuration option is provided', () => {

        beforeEach(() => setAuthCookie(response, token));

        describe('with the proper default name and value', () => {
          testCsrfToken(JWT_DEFAULT_CSRF_COOKIE_NAME);
        });

        it('with the proper default "domain" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.domain, undefined);
        });

        it('with the proper default "httpOnly" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.httpOnly, false);
        });

        it('with the proper default "path" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.path, JWT_DEFAULT_COOKIE_PATH);
        });

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.sameSite, JWT_DEFAULT_SAME_SITE_ON_CSRF_ENABLED);
        });

        it('with the proper default "secure" directive.', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.secure, undefined);
        });

        it('with the proper "expires" directive ("exp" claim in JWT).', async () => {
          await testExpiration(JWT_DEFAULT_CSRF_COOKIE_NAME);
        });

        it('with the proper "expires" directive (no "exp" claim in JWT).', () => {
          const { options } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
          strictEqual(options.expires, undefined);
        });

      });

      context('given configuration options are provided', () => {

        const csrfCookieName = JWT_DEFAULT_CSRF_COOKIE_NAME + '2';

        beforeEach(async () => {
          Config.set('settings.jwt.csrf.cookie.name', csrfCookieName);
          Config.set('settings.jwt.cookie.domain', 'example.com');
          Config.set('settings.jwt.cookie.httpOnly', true);
          Config.set('settings.jwt.cookie.path', '/foo');
          Config.set('settings.jwt.cookie.sameSite', 'strict');
          Config.set('settings.jwt.cookie.secure', true);
          await setAuthCookie(response, token);
        });

        afterEach(() => {
          Config.remove('settings.jwt.csrf.cookie.name');
          Config.remove('settings.jwt.cookie.domain');
          Config.remove('settings.jwt.cookie.httpOnly');
          Config.remove('settings.jwt.cookie.path');
          Config.remove('settings.jwt.cookie.sameSite');
          Config.remove('settings.jwt.cookie.secure');
        });

        describe('with the proper default name and value', () => {
          testCsrfToken(csrfCookieName);
        });

        it('with the proper default "domain" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.domain, 'example.com');
        });

        it('with the proper default "httpOnly" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.httpOnly, false);
        });

        it('with the proper default "path" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.path, '/foo');
        });

        it('with the proper default "sameSite" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.sameSite, 'strict');
        });

        it('with the proper default "secure" directive.', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.secure, true);
        });

        it('with the proper "expires" directive ("exp" claim in JWT).', async () => {
          await testExpiration(csrfCookieName);
        });

        it('with the proper "expires" directive (no "exp" claim in JWT).', () => {
          const { options } = response.getCookie(csrfCookieName);
          strictEqual(options.expires, undefined);
        });

      });

    });

  });

  context('given the CSRF protection is disabled in the config', () => {

    beforeEach(() => setAuthCookie(response, token));

    it('should not set a CSRF cookie in the response.', () => {
      const { value } = response.getCookie(JWT_DEFAULT_CSRF_COOKIE_NAME);
      strictEqual(value, undefined);
    });

  });

});
