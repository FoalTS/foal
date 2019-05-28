// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

// 3p
import {
  Config, ConfigMock, Context,
  getHookFunction, isHttpResponseBadRequest, isHttpResponseUnauthorized, ServiceManager
} from '@foal/core';
import { sign } from 'jsonwebtoken';

// FoalTS
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

function toBase64(headerOrPayload: string): string {
  return Buffer.from(headerOrPayload, 'binary').toString('base64').replace(/=/g, '');
}

function fromBase64(str: string): string {
  return Buffer.from(str, 'base64').toString('binary');
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

  const fetchUser = async id => id === '1' ? user : null;

  const hook = getHookFunction(JWT({ user: fetchUser }));

  const secret = 'my_secret';
  let services: ServiceManager;
  let config: ConfigMock;

  before(() => {
    services = new ServiceManager();
    config = new ConfigMock();
    services.set(Config, config);
  });

  beforeEach(() => {
    config.reset();
    config.set('settings.jwt.secretOrPublicKey', secret);
  });

  describe('should validate the request and', () => {

    describe('given options.cookie is false or not defined', () => {

      if (required) {

        it('should return an HttpResponseBadRequest object if the Authorization header does not exist.', async () => {
          const ctx = new Context({ get(str: string) { return undefined; } });

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

        it('should let ctx.user equal undefined if the Authorization header does not exist.', async () => {
          const ctx = new Context({ get(str: string) { return undefined; } });

          const response = await hook(ctx, services);
          strictEqual(response, undefined);
          strictEqual(ctx.user, undefined);
        });

      }

      it('should return an HttpResponseBadRequest object if the Authorization header does '
          + 'not use the Bearer scheme.', async () => {
        const ctx = new Context({ get(str: string) { return str === 'Authorization' ? 'Basic hello' : undefined; } });

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

    describe('given options.cookie is true', () => {

      if (required) {

        it('should return an HttpResponseBadRequest object if the cookie does not exist.' , async () => {
          const hook = getHookFunction(JWT({ cookie: true }));

          const ctx = new Context({ get(str: string) { return undefined; }, cookies: {} });

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

        it('should let ctx.user equal undefined if the cookie does not exist.', async () => {
          const hook = getHookFunction(JWT({ cookie: true }));

          const ctx = new Context({ get(str: string) { return undefined; }, cookies: {} });

          const response = await hook(ctx, services);
          strictEqual(response, undefined);
          strictEqual(ctx.user, undefined);
        });

      }

    });

  });

  describe('should verify that the token is not black listed', () => {

    it('and return an HttpResponseUnauthorized object if it is.', async () => {
      const hook = getHookFunction(JWT({
        blackList: token => token === 'revokedToken' ? true : false,
        user: fetchUser,
      }));

      const ctx = new Context({
        get(str: string) {return str === 'Authorization' ? 'Bearer revokedToken' : undefined; }
      });

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
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? 'Bearer foo' : undefined; } });

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
        + '.' + toBase64(JSON.stringify(payload1))
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moZGA08mogA';
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

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
      const token = toBase64('{')
        + '.' + toBase64(JSON.stringify(payload1))
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moZGA08mogA';
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

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
      const token = toBase64(JSON.stringify(header1))
        + '.eyJz32IiOiIxMjM0NTY3ODkwIiwibmFtZSI6UkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moZGA08mogA';
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'Unexpected token R in JSON at position 27'
      });
      strictEqual(
        response.getHeader('WWW-Authenticate'),
        'error="invalid_token", error_description="Unexpected token R in JSON at position 27"'
      );
    });

    it('should return an HttpResponseUnauthorized object if options.secretOrPublicKey throws an'
        + ' InvalidTokenError.', async () => {
      const hook = getHookFunction(JWT({
        secretOrPublicKey: async () => { throw new InvalidTokenError('invalid kid'); }
      }));
      const token = sign({}, secret);
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

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
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });
      return (hook(ctx, services) as Promise<any>)
        .then(() => { throw new Error('An error should have been thrown.'); })
        .catch(err => strictEqual(err.message, 'Connection error'));
    });

  });

  describe('should verify the token and', () => {

    it('should return an HttpResponseUnauthorized object if the signature is invalid.', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        + '.' + toBase64(JSON.stringify(payload1))
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moeGA08mogA';
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

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

    it('should throw an error if no secretOrPublicKey is set in the Config and options.secretOrPublicKey is'
        + ' not defined.', async () => {
      // Remove the secret.
      config.reset();

      let err: Error|undefined;
      try {
        const token = sign({}, secret);
        const ctx = new Context({ get(str: string) { return `Bearer ${token}`; } });
        await hook(ctx, services);
      } catch (error) {
        err = error;
      }
      if (!err) {
        throw new Error('An error should be thrown since there is not secret.');
      }
      strictEqual(
        err.message,
        'You must provide a settings.jwt.secretOrPublicKey in default.json or in the '
          + 'SETTINGS_JWT_SECRET_OR_PUBLIC_KEY environment variable.'
      );
    });

    it('should return an HttpResponseUnauthorized object if the signature is wrong (different secret).', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        + '.' + toBase64(JSON.stringify(payload1))
        + '.-I5sDyvGWSA8Qwk6OwM7VLV9Nz3pkINNHakp3S8kOn0';
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

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

    it('should return an HttpResponseUnauthorized object if the token is expired', async () => {
      const token = sign({}, secret, { expiresIn: '1' });
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

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
      const hook = getHookFunction(JWT({ user: fetchUser }, { audience: 'bar' }));

      const token = sign({}, secret, { audience: 'foo' });
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

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
      const hook = getHookFunction(JWT({ user: fetchUser }, { issuer: 'bar' }));

      const token = sign({}, secret, { issuer: 'foo' });
      const ctx = new Context({
        get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
      });

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

  describe('should set Context.user', () => {

    describe('given options.fetchUser is not defined', () => {

      it('with the decoded payload (header & secret).', async () => {
        const hook = getHookFunction(JWT());

        const jwt = sign({ foo: 'bar' }, secret, {});
        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; }
        });

        await hook(ctx, services);

        notStrictEqual(ctx.user, undefined);
        strictEqual((ctx.user as any).foo, 'bar');
      });

      it('with the decoded payload (header & secret from options.secretOrPublicKey).', async () => {
        config.reset();
        const secretOrPublicKey = async (header, payload) => {
          deepStrictEqual(header, {
            alg: 'HS256',
            typ: 'JWT'
          });
          deepStrictEqual(payload, { foo: 'bar' });
          return secret;
        };
        const hook = getHookFunction(JWT({ secretOrPublicKey }));

        const jwt = sign({ foo: 'bar' }, secret, { noTimestamp: true });
        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; }
        });

        await hook(ctx, services);

        notStrictEqual(ctx.user, undefined);
        strictEqual((ctx.user as any).foo, 'bar');
      });

      it('with the decoded payload (header & public key).', async () => {
        config.reset();
        config.set('settings.jwt.secretOrPublicKey', publicKey);

        const hook = getHookFunction(JWT());

        const jwt = sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' });
        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; }
        });

        await hook(ctx, services);

        notStrictEqual(ctx.user, undefined);
        strictEqual((ctx.user as any).foo, 'bar');
      });

      it('with the decoded payload (cookie & secret).', async () => {
        const hook = getHookFunction(JWT({ cookie: true }));

        const jwt = sign({ foo: 'bar' }, secret, {});
        const ctx = new Context({ get: () => undefined, cookies: { auth: jwt } });

        await hook(ctx, services);

        notStrictEqual(ctx.user, undefined);
        strictEqual((ctx.user as any).foo, 'bar');
      });

      it('with the decoded payload (cookie with a custom name & secret).', async () => {
        config.set('settings.jwt.cookieName', 'xxx');
        const hook = getHookFunction(JWT({ cookie: true }));

        const jwt = sign({ foo: 'bar' }, secret, {});
        const ctx = new Context({ get: () => undefined, cookies: { xxx: jwt } });

        await hook(ctx, services);

        notStrictEqual(ctx.user, undefined);
        strictEqual((ctx.user as any).foo, 'bar');
      });

    });

    describe('given options.fetchUser if defined', () => {

      it('OR return an HttpResponseUnauthorized object if payload.sub is not a string.', async () => {
        const token = sign({}, secret, {});
        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; }
        });

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

      it('with the user retrieved from the database.', async () => {
        const jwt = sign({}, secret, { subject: user.id.toString() });
        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; }
        });

        await hook(ctx, services);

        strictEqual(ctx.user, user);
      });

      it('OR return an HttpResponseUnauthorized object if no user could be retrieved from the database '
          + 'with the given payload.sub.', async () => {
        const jwt = sign({}, secret, { subject: user.id.toString() + '1' });
        const ctx = new Context({
          get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; }
        });

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

}
