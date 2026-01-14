// std
import { deepStrictEqual, notStrictEqual, rejects, strictEqual } from 'assert';
import { mock } from 'node:test';

// 3p
import {
  Config,
  Context,
  convertBase64ToBase64url,
  convertBase64urlToBase64,
  getApiComponents,
  getApiParameters,
  getApiResponses,
  getApiSecurity,
  getHookFunction,
  HookFunction,
  HttpMethod,
  IApiComponents,
  IApiCookieParameter,
  IApiSecurityRequirement,
  isHttpResponseBadRequest,
  isHttpResponseForbidden,
  isHttpResponseUnauthorized,
  Logger,
  ServiceManager
} from '@foal/core';
import { sign } from 'jsonwebtoken';

// FoalTS
import { JWT_DEFAULT_COOKIE_NAME, JWT_DEFAULT_CSRF_COOKIE_NAME } from './constants';
import { InvalidTokenError } from './invalid-token.error';
import { JWTOptional } from './jwt-optional.hook';
import { JWTRequired } from './jwt-required.hook';

// See https://github.com/auth0/node-jsonwebtoken/tree/master/test
const publicKey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAvzoCEC2rpSpJQaWZbUmlsDNwp83Jr4fi6KmBWIwnj1MZ6CUQ7rBa
suLI8AcfX5/10scSfQNCsTLV2tMKQaHuvyrVfwY0dINk+nkqB74QcT2oCCH9XduJ
jDuwWA4xLqAKuF96FsIes52opEM50W7/W7DZCKXkC8fFPFj6QF5ZzApDw2Qsu3yM
Rmr7/W9uWeaTwfPx24YdY7Ah+fdLy3KN40vXv9c4xiSafVvnx9BwYL7H1Q8NiK9L
GEN6+JSWfgckQCs6UUBOXSZdreNN9zbQCwyzee7bOJqXUDAuLcFARzPw1EsZAyjV
tGCKIQ0/btqK+jFunT2NBC8RItanDZpptQIDAQAB
-----END RSA PUBLIC KEY-----`;
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAvzoCEC2rpSpJQaWZbUmlsDNwp83Jr4fi6KmBWIwnj1MZ6CUQ
7rBasuLI8AcfX5/10scSfQNCsTLV2tMKQaHuvyrVfwY0dINk+nkqB74QcT2oCCH9
XduJjDuwWA4xLqAKuF96FsIes52opEM50W7/W7DZCKXkC8fFPFj6QF5ZzApDw2Qs
u3yMRmr7/W9uWeaTwfPx24YdY7Ah+fdLy3KN40vXv9c4xiSafVvnx9BwYL7H1Q8N
iK9LGEN6+JSWfgckQCs6UUBOXSZdreNN9zbQCwyzee7bOJqXUDAuLcFARzPw1EsZ
AyjVtGCKIQ0/btqK+jFunT2NBC8RItanDZpptQIDAQABAoIBAQCsssO4Pra8hFMC
gX7tr0x+tAYy1ewmpW8stiDFilYT33YPLKJ9HjHbSms0MwqHftwwTm8JDc/GXmW6
qUui+I64gQOtIzpuW1fvyUtHEMSisI83QRMkF6fCSQm6jJ6oQAtOdZO6R/gYOPNb
3gayeS8PbMilQcSRSwp6tNTVGyC33p43uUUKAKHnpvAwUSc61aVOtw2wkD062XzM
hJjYpHm65i4V31AzXo8HF42NrAtZ8K/AuQZne5F/6F4QFVlMKzUoHkSUnTp60XZx
X77GuyDeDmCgSc2J7xvR5o6VpjsHMo3ek0gJk5ZBnTgkHvnpbULCRxTmDfjeVPue
v3NN2TBFAoGBAPxbqNEsXPOckGTvG3tUOAAkrK1hfW3TwvrW/7YXg1/6aNV4sklc
vqn/40kCK0v9xJIv9FM/l0Nq+CMWcrb4sjLeGwHAa8ASfk6hKHbeiTFamA6FBkvQ
//7GP5khD+y62RlWi9PmwJY21lEkn2mP99THxqvZjQiAVNiqlYdwiIc7AoGBAMH8
f2Ay7Egc2KYRYU2qwa5E/Cljn/9sdvUnWM+gOzUXpc5sBi+/SUUQT8y/rY4AUVW6
YaK7chG9YokZQq7ZwTCsYxTfxHK2pnG/tXjOxLFQKBwppQfJcFSRLbw0lMbQoZBk
S+zb0ufZzxc2fJfXE+XeJxmKs0TS9ltQuJiSqCPPAoGBALEc84K7DBG+FGmCl1sb
ZKJVGwwknA90zCeYtadrIT0/VkxchWSPvxE5Ep+u8gxHcqrXFTdILjWW4chefOyF
5ytkTrgQAI+xawxsdyXWUZtd5dJq8lxLtx9srD4gwjh3et8ZqtFx5kCHBCu29Fr2
PA4OmBUMfrs0tlfKgV+pT2j5AoGBAKnA0Z5XMZlxVM0OTH3wvYhI6fk2Kx8TxY2G
nxsh9m3hgcD/mvJRjEaZnZto6PFoqcRBU4taSNnpRr7+kfH8sCht0k7D+l8AIutL
ffx3xHv9zvvGHZqQ1nHKkaEuyjqo+5kli6N8QjWNzsFbdvBQ0CLJoqGhVHsXuWnz
W3Z4cBbVAoGAEtnwY1OJM7+R2u1CW0tTjqDlYU2hUNa9t1AbhyGdI2arYp+p+umA
b5VoYLNsdvZhqjVFTrYNEuhTJFYCF7jAiZLYvYm0C99BqcJnJPl7JjWynoNHNKw3
9f6PIOE1rAmPE8Cfz/GFF5115ZKVlq+2BY8EKNxbCIy2d/vMEvisnXI=
-----END RSA PRIVATE KEY-----`;

function toBase64Url(headerOrPayload: string): string {
  return convertBase64ToBase64url(Buffer.from(headerOrPayload, 'binary').toString('base64'));
}

/* tslint:disable-next-line:no-unused-variable */
function fromBase64Url(str: string): string {
  return Buffer.from(convertBase64urlToBase64(str), 'base64').toString('binary');
}

const payload1 = {
  sub: '1234567890',
  // tslint:disable-next-line:object-literal-sort-keys
  name: 'John Doe',
  iat: 1516239022
};

const header1 = {
  alg: 'HS256',
  typ: 'JWT'
};

export function testSuite(JWT: typeof JWTOptional|typeof JWTRequired, required: boolean) {
  const user = { id: 1 };
  let actualServices: ServiceManager;
  const secret = 'my_secret';

  const findUser = async (id: number, services: ServiceManager) => {
    actualServices = services;
    return id === 1 ? user : null;
  };

  let ctx: Context;
  let hook: HookFunction;
  let services: ServiceManager;

  function createContext(
    headers: { [key: string]: string } = {},
    cookies: { [key: string]: string } = {},
    body: { [key: string]: string } = {},
    // Do not use GET, HEAD or OPTIONS as default (CSRF tests).
    method: HttpMethod = 'POST',
  ) {
    return new Context({
      get(key: string) { return headers[key]; },
      body,
      cookies,
      method,
    });
  }

  beforeEach(() => {
    ctx = createContext();
    hook = getHookFunction(JWT({ user: findUser }));
    services = new ServiceManager();

    Config.set('settings.jwt.secret', secret);
  });

  afterEach(() => {
    Config.remove('settings.jwt.secret');
    Config.remove('settings.jwt.publicKey');
    Config.remove('settings.jwt.cookie.name');
  });

  describe('should validate the request and', () => {

    context('given options.cookie is false or not defined', () => {

      if (required) {

        it('should return an HttpResponseBadRequest object if the Authorization header does not exist.', async () => {
          const response = await hook(ctx, services);
          if (!isHttpResponseBadRequest(response)) {
            throw new Error('Response should be an instance of HttpResponseBadRequest.');
          }
          deepStrictEqual(response.body, {
            code: 'invalid_request',
            description: 'Authorization header not found.'
          });
        });

      } else {

        it('should let ctx.user equal null if the Authorization header does not exist.', async () => {
          const response = await hook(ctx, services);
          strictEqual(response, undefined);
          strictEqual(ctx.user, null);
        });

      }

      it('should return an HttpResponseBadRequest object if the Authorization header does '
          + 'not use the Bearer scheme.', async () => {
        ctx = createContext({ Authorization: 'Basic hello' });

        const response = await hook(ctx, services);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('Response should be an instance of HttpResponseBadRequest.');
        }
        deepStrictEqual(response.body, {
          code: 'invalid_request',
          description: 'Expected a bearer token. Scheme is Authorization: Bearer <token>.'
        });
      });

    });

    context('given options.cookie is true', () => {

      if (required) {

        it('should return an HttpResponseBadRequest object if the cookie does not exist.' , async () => {
          const hook = getHookFunction(JWT({ cookie: true }));

          const response = await hook(ctx, services);
          if (!isHttpResponseBadRequest(response)) {
            throw new Error('Response should be an instance of HttpResponseBadRequest.');
          }
          deepStrictEqual(response.body, {
            code: 'invalid_request',
            description: 'Auth cookie not found.'
          });
        });

      } else {

        it('should let ctx.user equal null if the cookie does not exist.', async () => {
          const hook = getHookFunction(JWT({ cookie: true }));

          const response = await hook(ctx, services);
          strictEqual(response, undefined);
          strictEqual(ctx.user, null);
        });

      }

    });

  });

  describe('should verify that the token is not black listed', () => {

    it('and return an HttpResponseUnauthorized object if it is.', async () => {
      const hook = getHookFunction(JWT({
        blackList: token => token === 'revokedToken' ? true : false,
        user: findUser,
      }));

      ctx = createContext({ Authorization: 'Bearer revokedToken' });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt revoked'
      });
      strictEqual(response.getHeader('WWW-Authenticate'), 'error="invalid_token", error_description="jwt revoked"');
    });

  });

  describe('should validate the format and encoding of the token and', () => {

    it('should return an HttpResponseUnauthorized object if the token is not a JWT.', async () => {
      ctx = createContext({ Authorization: 'Bearer foo' });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt malformed'
      });
      strictEqual(response.getHeader('WWW-Authenticate'), 'error="invalid_token", error_description="jwt malformed"');
    });

    it('should return an HttpResponseUnauthorized object if the header is invalid'
        + ' (not a base64-encoded string).', async () => {
      const token = '$$$'
        + '.' + toBase64Url(JSON.stringify(payload1))
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moZGA08mogA';
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid token'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="invalid token"'
      );
    });

    it('should return an HttpResponseUnauthorized object if the header is invalid'
        + ' (not a representation of a valid JSON object).', async () => {
      const token = toBase64Url('{')
        + '.' + toBase64Url(JSON.stringify(payload1))
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moZGA08mogA';
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid token'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="invalid token"'
      );
    });

    it('should return an HttpResponseUnauthorized object if the payload is invalid.', async () => {
      const token = toBase64Url(JSON.stringify(header1))
        + '.eyJz32IiOiIxMjM0NTY3ODkwIiwibmFtZSI6UkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moZGA08mogA';
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }

      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: `Unexpected token 'R', ...\"0\",\"name\":RJohn Doe\"\"... is not valid JSON`
      });

      strictEqual(
        response.getHeader('WWW-Authenticate'),
        `error="invalid_token", error_description="Unexpected token 'R', ...\"0\",\"name\":RJohn Doe\"\"... is not valid JSON"`
      );
    });

    it('should return an HttpResponseUnauthorized object if options.secretOrPublicKey throws an'
        + ' InvalidTokenError.', async () => {
      const hook = getHookFunction(JWT({
        secretOrPublicKey: async () => { throw new InvalidTokenError('invalid kid'); }
      }));
      const token = sign({}, secret);
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid kid'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="invalid kid"'
      );
    });

    it('should throw an error if options.secretOrPublicKey throws an error which is not an InvalidTokenError.', () => {
      const hook = getHookFunction(JWT({
        secretOrPublicKey: async () => { throw new Error('Connection error'); }
      }));
      const token = sign({}, secret);
      ctx = createContext({ Authorization: `Bearer ${token}` });

      return (hook(ctx, services) as Promise<any>)
        .then(() => { throw new Error('An error should have been thrown.'); })
        .catch(err => strictEqual(err.message, 'Connection error'));
    });

  });

  describe('should verify the token and', () => {

    afterEach(() => Config.remove('settings.jwt.secretEncoding'));

    it('should return an HttpResponseUnauthorized object if the signature is invalid.', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        + '.' + toBase64Url(JSON.stringify(payload1))
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moeGA08mogA';
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid signature'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="invalid signature"'
      );
    });

    it('should return an HttpResponseUnauthorized object if the algorithm is "none".', async () => {
      const header = { alg: 'none', typ: 'JWT' };
      const token = toBase64Url(JSON.stringify(header))
        + '.' + toBase64Url(JSON.stringify(payload1))
        + '.' + 'some-signature';
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid algorithm'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="invalid algorithm"'
      );
    });

    it('should throw an error if no secret or public key is set in the Config and options.secretOrPublicKey is'
        + ' not defined.', async () => {
      // Remove the secret.
      Config.remove('settings.jwt.secret');

      const token = sign({}, secret);
      ctx = createContext({ Authorization: `Bearer ${token}` });

      await rejects(
        async () => hook(ctx, services),
        {
          message: '[CONFIG] You must provide at least one of these configuration keys: '
            + 'settings.jwt.secret or settings.jwt.publicKey.'
        }
      );
    });

    it('should return an HttpResponseUnauthorized object if the signature is wrong (different secret).', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        + '.' + toBase64Url(JSON.stringify(payload1))
        + '.-I5sDyvGWSA8Qwk6OwM7VLV9Nz3pkINNHakp3S8kOn0';
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid signature'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="invalid signature"'
      );
    });

    it('should not return an HttpResponseUnauthorized object if the signature is valid'
      + ' (different secret encoding).', async () => {
        const hook = getHookFunction(JWT());

        Config.set('settings.jwt.secretEncoding', 'base64');
        const token = sign({}, Buffer.from(secret, 'base64'));
        ctx = createContext({ Authorization: `Bearer ${token}` });

        const response = await hook(ctx, services);
        if (isHttpResponseUnauthorized(response)) {
          throw new Error('The hook should NOT have returned an instance of HttpResponseUnauthorized');
        }
    });

    it('should return an HttpResponseUnauthorized object if the token is expired.', async () => {
      const token = sign({}, secret, { expiresIn: '1' });
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt expired'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="jwt expired"'
      );
    });

    it('should return an HttpResponseUnauthorized object if the audience is not expected.', async () => {
      const hook = getHookFunction(JWT({ user: findUser }, { audience: 'bar' }));

      const token = sign({}, secret, { audience: 'foo' });
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt audience invalid. expected: bar'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="jwt audience invalid. expected: bar"'
      );
    });

    it('should return an HttpResponseUnauthorized object if the issuer is not expected.', async () => {
      const hook = getHookFunction(JWT({ user: findUser }, { issuer: 'bar' }));

      const token = sign({}, secret, { issuer: 'foo' });
      ctx = createContext({ Authorization: `Bearer ${token}` });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt issuer invalid. expected: bar'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="jwt issuer invalid. expected: bar"'
      );
    });

  });

  describe('should verify the CSRF token and', () => {

    context('given the request needs a CSRF check', () => {

      let token: string;
      let sub: string;
      let csrfToken: string;

      function createContextWithPostMethod(headers: {[name:string]: string}, cookies: {[name:string]: string}): Context {
        return createContext(headers, cookies, {}, 'POST');
      }

      beforeEach(() => {
        sub = '678';
        token = sign({ foo: 'bar' }, secret, { subject: sub });
        csrfToken = sign({ foo2: 'bar' }, secret, { subject: sub });
        hook = getHookFunction(JWT({ cookie: true, csrf: true }))
      });

      it('should return an HttpResponseForbidden instance if the request has no CSRF cookie.', async () => {
        ctx = createContextWithPostMethod(
          {},
          {
            [JWT_DEFAULT_COOKIE_NAME]: token,
          },
        );

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned a HttpResponseForbidden instance.');
        }

        strictEqual(response.body, 'CSRF token missing or incorrect.');
      });

      it('should return an HttpResponseForbidden instance if the csrf tokens are equal but have a wrong signature.', async () => {
        csrfToken = sign({ foo2: 'bar' }, `${secret}2`, {});
        ctx = createContextWithPostMethod(
          { 'X-CSRF-Token': csrfToken },
          {
            [JWT_DEFAULT_COOKIE_NAME]: token,
            [JWT_DEFAULT_CSRF_COOKIE_NAME]: csrfToken,
          },
        );

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned a HttpResponseForbidden instance.');
        }

        strictEqual(response.body, 'CSRF token missing or incorrect.');
      });

      it('should return an HttpResponseForbidden instance if the csrf tokens are equal but have a wrong subject.', async () => {
        csrfToken = sign({ foo2: 'bar' }, secret, { subject: sub + 'Y' });
        ctx = createContextWithPostMethod(
          { 'X-CSRF-Token': csrfToken },
          {
            [JWT_DEFAULT_COOKIE_NAME]: token,
            [JWT_DEFAULT_CSRF_COOKIE_NAME]: csrfToken,
          },
        );

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned a HttpResponseForbidden instance.');
        }

        strictEqual(response.body, 'CSRF token missing or incorrect.');
      });

      it('should return an HttpResponseForbidden instance if the csrf tokens are equal but have expired.', async () => {
        csrfToken = sign({ foo2: 'bar' }, secret, { subject: sub, expiresIn: 0 });
        ctx = createContextWithPostMethod(
          { 'X-CSRF-Token': csrfToken },
          {
            [JWT_DEFAULT_COOKIE_NAME]: token,
            [JWT_DEFAULT_CSRF_COOKIE_NAME]: csrfToken,
          },
        );

        const response = await hook(ctx, services);
        if (!isHttpResponseForbidden(response)) {
          throw new Error('The hook should have returned a HttpResponseForbidden instance.');
        }

        strictEqual(response.body, 'CSRF token missing or incorrect.');
      });

      context('given a CSRF token is sent in the request', () => {

        it('should return an HttpResponseForbidden instance if the CSRF tokens are not equal.', async () => {
          ctx = createContextWithPostMethod(
            { 'X-CSRF-Token': csrfToken + '2' },
            {
              [JWT_DEFAULT_COOKIE_NAME]: token,
              [JWT_DEFAULT_CSRF_COOKIE_NAME]: csrfToken,
            },
          );

          const response = await hook(ctx, services);
          if (!isHttpResponseForbidden(response)) {
            throw new Error('The hook should have returned a HttpResponseForbidden instance.');
          }

          strictEqual(response.body, 'CSRF token missing or incorrect.');
        });

        it('should not return an HttpResponseForbidden instance if the CSRF tokens are equal.', async () => {
          ctx = createContextWithPostMethod(
            { 'X-CSRF-Token': csrfToken },
            {
              [JWT_DEFAULT_COOKIE_NAME]: token,
              [JWT_DEFAULT_CSRF_COOKIE_NAME]: csrfToken,
            },
          );

          const response = await hook(ctx, services);
          if (isHttpResponseForbidden(response)) {
            throw new Error('The hook should NOT have returned a HttpResponseForbidden instance.');
          }
        });

      });

    });

  });

  describe('should set Context.user', () => {

    it('and shoud add the user ID to the log context.', async () => {
      const jwt = sign({}, secret, { subject: '123' });
      ctx = createContext({ Authorization: `Bearer ${jwt}` });

      hook = getHookFunction(JWT({
        user: async () => null,
        userIdType: 'number'
      }));

      const logger = services.get(Logger);
      const loggerMock = mock.method(logger, 'addLogContext', () => {}).mock;

      await hook(ctx, services);

      strictEqual(loggerMock.callCount(), 1);
      deepStrictEqual(
        loggerMock.calls[0].arguments,
        [{ userId: 123 }],
      );
    })

    context('given options.user is not defined', () => {

      it('with the decoded payload (header & secret).', async () => {
        const hook = getHookFunction(JWT());

        const jwt = sign({ foo: 'bar' }, secret, {});
        ctx = createContext({ Authorization: `Bearer ${jwt}` });

        await hook(ctx, services);

        notStrictEqual(ctx.user, null);
        strictEqual((ctx.user as any).foo, 'bar');
      });

      it('with the decoded payload (header & secret from options.secretOrPublicKey).', async () => {
        Config.remove('settings.jwt.secret');

        const secretOrPublicKey = async (header: any, payload: any) => {
          deepStrictEqual(header, {
            alg: 'HS256',
            typ: 'JWT'
          });
          deepStrictEqual(payload, { foo: 'bar' });
          return secret;
        };
        const hook = getHookFunction(JWT({ secretOrPublicKey }));

        const jwt = sign({ foo: 'bar' }, secret, { noTimestamp: true });
        ctx = createContext({ Authorization: `Bearer ${jwt}` });

        await hook(ctx, services);

        notStrictEqual(ctx.user, null);
        strictEqual((ctx.user as any).foo, 'bar');
      });

      it('with the decoded payload (header & public key).', async () => {
        Config.remove('settings.jwt.secret');
        Config.set('settings.jwt.publicKey', publicKey);

        const hook = getHookFunction(JWT());

        const jwt = sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
        ctx = createContext({ Authorization: `Bearer ${jwt}` });

        await hook(ctx, services);

        notStrictEqual(ctx.user, null);
        strictEqual((ctx.user as any).foo, 'bar');
      });

      it('with the decoded payload (cookie & secret).', async () => {
        const hook = getHookFunction(JWT({ cookie: true }));

        const jwt = sign({ foo: 'bar' }, secret, {});
        ctx = createContext({}, { [JWT_DEFAULT_COOKIE_NAME]: jwt });

        await hook(ctx, services);

        notStrictEqual(ctx.user, null);
        strictEqual((ctx.user as any).foo, 'bar');
      });

      it('with the decoded payload (cookie with a custom name & secret).', async () => {
        Config.set('settings.jwt.cookie.name', 'xxx');

        const hook = getHookFunction(JWT({ cookie: true }));

        const jwt = sign({ foo: 'bar' }, secret, {});
        ctx = createContext({}, { xxx: jwt });

        await hook(ctx, services);

        notStrictEqual(ctx.user, null);
        strictEqual((ctx.user as any).foo, 'bar');
      });

    });

    context('given options.user if defined', () => {

      it('OR return an HttpResponseUnauthorized object if payload.sub is not a string.', async () => {
        const token = sign({}, secret, {});
        ctx = createContext({ Authorization: `Bearer ${token}` });

        const response = await hook(ctx, services);
        if (!isHttpResponseUnauthorized(response)) {
          throw new Error('response should be instance of HttpResponseUnauthorized');
        }
        deepStrictEqual(response.body, {
          code: 'invalid_token',
          description: 'The token must include a subject which is the id of the user.'
        });
        strictEqual(
          response.getHeader('WWW-Authenticate'),
          'error="invalid_token", error_description="The token must include a subject which is the id of the user."'
        );
      });

      it('and should validate the user ID type and convert it if necessary.', async () => {
        const jwt = sign({}, secret, { subject: 'not-a-number' });
        ctx = createContext({ Authorization: `Bearer ${jwt}` });

        hook = getHookFunction(JWT({
          user: async () => null,
          userIdType: 'number'
        }));

        await rejects(
          async () => hook(ctx, services),
          new Error('Suspicious operation: invalid user ID type.')
        );
      })

      it('and should call options.user with the service manager.', async () => {
        const jwt = sign({}, secret, { subject: user.id.toString() });
        ctx = createContext({ Authorization: `Bearer ${jwt}` });

        await hook(ctx, services);

        strictEqual(actualServices, services);
      })

      it('with the user retrieved from the database.', async () => {
        const jwt = sign({}, secret, { subject: user.id.toString() });
        ctx = createContext({ Authorization: `Bearer ${jwt}` });

        await hook(ctx, services);

        strictEqual(ctx.user, user);
      });

      it('OR return an HttpResponseUnauthorized object if no user could be retrieved from the database '
          + 'with the given payload.sub.', async () => {
        const jwt = sign({}, secret, { subject: user.id.toString() + '1' });
        ctx = createContext({ Authorization: `Bearer ${jwt}` });

        await hook(ctx, services);

        const response = await hook(ctx, services);
        if (!isHttpResponseUnauthorized(response)) {
          throw new Error('response should be instance of HttpResponseUnauthorized');
        }
        deepStrictEqual(response.body, {
          code: 'invalid_token',
          description: 'The token subject does not match any user.'
        });
        strictEqual(
          response.getHeader('WWW-Authenticate'),
          'error="invalid_token", error_description="The token subject does not match any user."'
        );
      });

    });

  });

  describe('should define an API specification', () => {

    const csrfCookieName = JWT_DEFAULT_CSRF_COOKIE_NAME + '2';

    afterEach(() => {
      Config.remove('settings.jwt.csrf.enabled');
      Config.remove('settings.jwt.csrf.cookie.name');
    });

    it('unless options.openapi is false.', () => {
      @JWT({ openapi: false })
      class Foobar {}

      strictEqual(getApiSecurity(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
      deepStrictEqual(getApiComponents(Foobar, new Foobar()), {});
    });

    it('with the proper security scheme (cookie).', () => {
      @JWT({  cookie: true })
      class Foobar {}

      const actualComponents = getApiComponents(Foobar, new Foobar());
      const expectedComponents: IApiComponents = {
        securitySchemes: {
          cookieAuth: {
            in: 'cookie',
            name: JWT_DEFAULT_COOKIE_NAME,
            type: 'apiKey',
          }
        }
      };
      deepStrictEqual(actualComponents, expectedComponents);
    });

    it('with the proper security scheme (cookie name different).', () => {
      Config.set('settings.jwt.cookie.name', 'auth2');

      @JWT({ cookie: true })
      class Foobar {}

      const actualComponents = getApiComponents(Foobar, new Foobar());
      const expectedComponents: IApiComponents = {
        securitySchemes: {
          cookieAuth: {
            in: 'cookie',
            name: 'auth2',
            type: 'apiKey',
          }
        }
      };
      deepStrictEqual(actualComponents, expectedComponents);
    });

    it('with the proper security scheme (no cookie).', () => {
      @JWT()
      class Foobar {}

      const actualComponents = getApiComponents(Foobar, new Foobar());
      const expectedComponents: IApiComponents = {
        securitySchemes: {
          bearerAuth: {
            bearerFormat: 'JWT',
            scheme: 'bearer',
            type: 'http',
          }
        }
      };
      deepStrictEqual(actualComponents, expectedComponents);
    });

    if (required) {

      it('with the proper security requirement (cookie).', () => {
        @JWT({ cookie: true })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        const expectedSecurityRequirements: IApiSecurityRequirement[] = [
          { cookieAuth: [] }
        ];
        deepStrictEqual(actualSecurityRequirements, expectedSecurityRequirements);
      });

      it('with the proper security requirement (no cookie).', () => {
        @JWT()
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        const expectedSecurityRequirements: IApiSecurityRequirement[] = [
          { bearerAuth: [] }
        ];
        deepStrictEqual(actualSecurityRequirements, expectedSecurityRequirements);
      });

      function testResponses(options: { cookie: boolean }) {
        @JWT(options)
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'JWT is missing or invalid.' }
        });
      }

      it('with the proper API responses (no cookie & no csrf protection).', () => {
        testResponses({ cookie: false });
      });

      it('with the proper API responses (no cookie & csrf protection).', () => {
        Config.set('settings.jwt.csrf.enabled', true);

        testResponses({ cookie: false });
      });

      it('with the proper API responses (cookie & no csrf protection).', () => {
        testResponses({ cookie: true });
      });

      it('with the proper API responses (cookie & csrf protection).', () => {
        Config.set('settings.jwt.csrf.enabled', true);

        @JWT({ cookie: true })
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'JWT is missing or invalid.' },
          403: { description: 'CSRF token is missing or incorrect.'}
        });
      });

    } else {

      it('with no security requirement (cookie).', () => {
        @JWT({ cookie: true })
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        strictEqual(actualSecurityRequirements, undefined);
      });

      it('with no security requirement (no cookie).', () => {
        @JWT()
        class Foobar {}

        const actualSecurityRequirements = getApiSecurity(Foobar);
        strictEqual(actualSecurityRequirements, undefined);
      });

      function testResponses(options: { cookie: boolean }) {
        @JWT(options)
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'JWT is invalid.' }
        });
      }

      it('with the proper API responses (no cookie & no csrf protection).', () => {
        testResponses({ cookie: false });
      });

      it('with the proper API responses (no cookie & csrf protection).', () => {
        Config.set('settings.jwt.csrf.enabled', true);

        testResponses({ cookie: false });
      });

      it('with the proper API responses (cookie & no csrf protection).', () => {
        testResponses({ cookie: true });
      });

      it('with the proper API responses (cookie & csrf protection).', () => {
        Config.set('settings.jwt.csrf.enabled', true);

        @JWT({ cookie: true })
        class Foobar {}

        deepStrictEqual(getApiResponses(Foobar), {
          401: { description: 'JWT is invalid.' },
          403: { description: 'CSRF token is missing or incorrect.'}
        });
      });

    }

    function testParameters(options: { cookie: boolean }) {
      @JWT(options)
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
    }

    it('with the proper API parameters (no cookie & no csrf protection).', () => {
      testParameters({ cookie: false });
    });

    it('with the proper API parameters (no cookie & csrf protection).', () => {
      Config.set('settings.jwt.csrf.enabled', true);

      testParameters({ cookie: false });
    });

    it('with the proper API parameters (cookie & no csrf protection).', () => {
      testParameters({ cookie: true });
    });

    it('with the proper API parameters (cookie & csrf protection).', () => {
      Config.set('settings.jwt.csrf.enabled', true);

      @JWT({ cookie: true })
      class Foobar {}

      const csrfCookieParameter: IApiCookieParameter = {
        description: 'CSRF token',
        in: 'cookie',
        name: JWT_DEFAULT_CSRF_COOKIE_NAME,
      };
      deepStrictEqual(getApiParameters(Foobar), [ csrfCookieParameter ]);
    });

    it('with the proper API parameters (cookie & csrf protection & custom name).', () => {
      Config.set('settings.jwt.csrf.enabled', true);
      Config.set('settings.jwt.csrf.cookie.name', csrfCookieName);

      @JWT({ cookie: true })
      class Foobar {}

      const csrfCookieParameter: IApiCookieParameter = {
        description: 'CSRF token',
        in: 'cookie',
        name: csrfCookieName,
      };
      deepStrictEqual(getApiParameters(Foobar), [ csrfCookieParameter ]);
    });

  });

}
