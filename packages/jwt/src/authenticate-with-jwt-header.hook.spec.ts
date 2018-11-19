// std
import { deepStrictEqual, notStrictEqual, strictEqual } from 'assert';

// 3p
import {
  AbstractUser, Context, getHookFunction, Group,
  isHttpResponseBadRequest, Permission, ServiceManager
} from '@foal/core';
import { sign } from 'jsonwebtoken';

// FoalTS
import { Connection, createConnection, Entity, getRepository } from 'typeorm';
import { AuthenticateWithJwtHeader } from './authenticate-with-jwt-header.hook';

describe('authenticateWithJwtHeader', () => {

  @Entity()
  class User extends AbstractUser {}

  const hook = getHookFunction(AuthenticateWithJwtHeader(User));
  const secret = 'my_secret';
  let connection: Connection;
  let id: number;

  before(async () => {
    connection = await createConnection({
      database: 'test_db.sqlite',
      dropSchema: true,
      entities: [ User, Permission, Group ],
      synchronize: true,
      type: 'sqlite',
    });
    const user = new User();
    await getRepository(User).save(user);
    id = user.id;
    process.env.JWT_SECRET = 'my_secret';
  });

  after(async () => {
    await connection.close();
    process.env.JWT_SECRET = '';
  });

  it('should not throw any error if the Authorization header does not exist.', async () => {
    const ctx = new Context({ get(str: string) { return undefined; }});
    const services = new ServiceManager();
    // should throw if audience is not expected
    // should throw if token is expired (spécifié dans les options)
    // should throw if token issuer is wrong (spécifié dans les options)
    // should throw error when signature is wrong

    await hook(ctx, services);
  });

  it('should return an HttpResponseBadRequest object if the Authorization header does '
      + 'not use the Bearer schema.', async () => {
    const ctx = new Context({ get(str: string) { return str === 'Authorization' ? 'Basic hello' : undefined; }});
    const services = new ServiceManager();

    const response = await hook(ctx, services);

    if (!isHttpResponseBadRequest(response)) {
      throw new Error('response should be instance of HttpResponseBadRequest');
    }
    deepStrictEqual(response.body, {
      message: 'Format is Authorization: Bearer <token>'
    });
  });

  it('should decode the JWT token and return the corresponding user from the database.', async () => {
    const jwt = sign({}, secret, { subject: id.toString() });
    const ctx = new Context({ get(str: string) { return str === 'Authorization' ? `Bearer ${jwt}` : undefined; }});
    const services = new ServiceManager();

    await hook(ctx, services);

    notStrictEqual(ctx.user, undefined);
    strictEqual((ctx.user as AbstractUser).id, id);
  });

});
