// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

// 3p
import {
  AbstractUser, Context, getHookFunction, Group,
  isHttpResponseBadRequest, isHttpResponseUnauthorized, Permission, ServiceManager
} from '@foal/core';
import { sign } from 'jsonwebtoken';
import { Connection, createConnection, Entity, getRepository } from 'typeorm';

// FoalTS
import { AuthenticateWithJwtHeader } from './authenticate-with-jwt-header.hook';

describe('authenticateWithJwtHeader', () => {

  @Entity()
  class User extends AbstractUser { }

  const hook = getHookFunction(AuthenticateWithJwtHeader(User));

  let connection: Connection;
  let id: number;

  before(async () => {
    connection = await createConnection({
      database: 'test_db.sqlite',
      dropSchema: true,
      entities: [User, Permission, Group],
      synchronize: true,
      type: 'sqlite',
    });
    const user = new User();
    await getRepository(User).save(user);
    id = user.id;
  });

  after(() => connection.close());

  it('should throw if no secret is set in the Config.', async () => {
    let err: Error|undefined;
    try {
      const ctx = new Context({ get(str: string) { return undefined; } });
      const services = new ServiceManager();

      await hook(ctx, services);
    } catch (error) {
      err = error;
    }
    if (!err) {
      throw new Error('An error should be thrown since there is not secret.');
    }
    strictEqual(err.message, 'You must provide a secret in jwt.json or in the JWT_SECRET environment variable.');
  });

  describe('when a secret is set', () => {

    const secret = 'my_secret';

    before(() => process.env.JWT_SECRET = 'my_secret');

    after(() => process.env.JWT_SECRET = '');

    it('should return an HttpResponseBadRequest object if the Authorization header does not exist.', async () => {
      const ctx = new Context({ get(str: string) { return undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseBadRequest(response)) {
        throw new Error('Response should be an instance of HttpResponseBadRequest.');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_request',
        description: 'Authorization header not found.'
      });
    });

    it('should return an HttpResponseBadRequest object if the Authorization header does '
      + 'not use the Bearer scheme.', async () => {
        const ctx = new Context({ get(str: string) { return str === 'Authorization' ? 'Basic hello' : undefined; } });
        const services = new ServiceManager();

        const response = await hook(ctx, services);

        if (!isHttpResponseBadRequest(response)) {
          throw new Error('Response should be an instance of HttpResponseBadRequest.');
        }
        deepStrictEqual(response.body, {
          code: 'invalid_request',
          description: 'Expected a bearer token. Scheme is Authorization: Bearer <token>.'
        });
      });

    it('should return an HttpResponseUnauthorized object if the token is not a JWT.', async () => {
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? 'Bearer foo' : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt malformed'
      });
    });

    it('should return an HttpResponseUnauthorized object if the header is invalid.', async () => {
      const token = 'eyJhhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        + '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moZGA08mogA';
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid algorithm'
      });
    });

    it('should return an HttpResponseUnauthorized object if the payload is invalid.', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        + '.eyJz32IiOiIxMjM0NTY3ODkwIiwibmFtZSI6UkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moZGA08mogA';
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'Unexpected token R in JSON at position 27'
      });
    });

    it('should return an HttpResponseUnauthorized object if the signature is invalid.', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        + '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
        + '.HMwf4pIs-aI8UG5Rv2dKplZP4XKvwVT5moeGA08mogA';
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid signature'
      });
    });

    it('should return an HttpResponseUnauthorized object if the signature is wrong (different secret).', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        + '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
        + '.-I5sDyvGWSA8Qwk6OwM7VLV9Nz3pkINNHakp3S8kOn0';
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'invalid signature'
      });
    });

    it('should return an HttpResponseUnauthorized object if the token is expired', async () => {
      const token = sign({}, secret, { expiresIn: '1' });
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt expired'
      });
    });

    it('should return an HttpResponseUnauthorized object if the audience is not expected.', async () => {
      const hook = getHookFunction(AuthenticateWithJwtHeader(User, { audience: 'bar' }));

      const token = sign({}, secret, { audience: 'foo' });
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt audience invalid. expected: bar'
      });
    });

    it('should return an HttpResponseUnauthorized object if the issuer is not expected.', async () => {
      const hook = getHookFunction(AuthenticateWithJwtHeader(User, { issuer: 'bar' }));

      const token = sign({}, secret, { issuer: 'foo' });
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'jwt issuer invalid. expected: bar'
      });
    });

    // TODO: test and add the headers WWW-Authenticate: error="invalid_token", error_description="jwt malformed"

    it('should set ctx.user with the decoded payload if no User entity was given.', async () => {
      const hook = getHookFunction(AuthenticateWithJwtHeader());

      const jwt = sign({ foo: 'bar' }, secret, {});
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; } });
      const services = new ServiceManager();

      await hook(ctx, services);

      notStrictEqual(ctx.user, undefined);
      strictEqual((ctx.user as any).foo, 'bar');
    });

    it('should return an HttpResponseUnauthorized object if there is no subject and a User entity'
        + ' was given.', async () => {
      const token = sign({}, secret, {});
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${token}` : undefined; } });
      const services = new ServiceManager();

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'The token must include a subject which is the id of the user.'
      });
    });

    it('should fetch the user from the database and set ctx.user if a User entity was given.', async () => {
      const jwt = sign({}, secret, { subject: id.toString() });
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; } });
      const services = new ServiceManager();

      await hook(ctx, services);

      notStrictEqual(ctx.user, undefined);
      strictEqual((ctx.user as AbstractUser).id, id);
    });

    it('should return an HttpResponseUnauthorized object if a User entity was given and no'
        + ' user was found in the database with id=payload.sub.', async () => {
      const jwt = sign({}, secret, { subject: id.toString() + '1' });
      const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; } });
      const services = new ServiceManager();

      await hook(ctx, services);

      const response = await hook(ctx, services);
      if (!isHttpResponseUnauthorized(response)) {
        throw new Error('response should be instance of HttpResponseUnauthorized');
      }
      deepStrictEqual(response.body, {
        code: 'invalid_token',
        description: 'The token subject does not match any user.'
      });
    });

  });

});
