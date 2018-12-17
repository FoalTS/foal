// std
import { fail, strictEqual } from 'assert';

// 3p
import { Group, Permission, UserWithPermissions } from '@foal/core';
import { Column, createConnection, Entity, getConnection, getManager } from 'typeorm';

// FoalTS
import { EmailAuthenticator } from './email-authenticator.service';

describe('EmailAuthenticator', () => {

  @Entity()
  class User extends UserWithPermissions {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;
  }

  class ConcreteClass extends EmailAuthenticator<User> {
    entityClass = User;
  }

  let service: EmailAuthenticator<User>;

  it('should instantiate.', () => {
    service = new ConcreteClass();
  });

  describe('when authenticate is called', () => {
    const password = 'foobar';
    const encryptedPassword = 'pbkdf2_sha256$100000$c678be5a273eee3938de7656071264b2$'
    + 'eb96ff7e947816f74908abc687926fec7e9a84c7e6c9a0c3d5d3cb718bc9'
    + '479410815c7b38cace114ec995354defe1e3511f3c103ed4356d457cb98bffc8d559';

    beforeEach(() => createConnection({
      database: 'test',
      dropSchema: true,
      entities: [ User, Group, Permission ],
      password: 'test',
      synchronize: true,
      type: 'mysql',
      username: 'test',
    }));

    beforeEach(() => {
      const john = new User();
      john.email = 'john@foalts.org';
      john.id = 1;
      john.password = encryptedPassword;
      john.username = 'John';

      const mary = new User();
      mary.email = 'mary@foalts.org';
      mary.id = 2;
      mary.password = 'bcrypt_mypassword';
      mary.username = 'mary';

      const sam = new User();
      sam.email = 'sam@foalts.org';
      sam.id = 3;
      sam.password = 'pbkdf2_sha256$hello_world';
      sam.username = 'Sam';

      return getManager().save([ john, sam, mary ]);
    });

    afterEach(() => getConnection().close());

    it('should return null if no user is found for the given email.', async () => {
      const user = await service.authenticate({ email: 'jack2@foalts.org', password: 'foo' });
      strictEqual(user, null);
    });

    it('should return null if the given password is incorrect.', async () => {
      const user = await service.authenticate({ email: 'john@foalts.org', password: 'wrongPassword'});
      strictEqual(user, null);
    });

    it('should throw an error if the encrypted user password format is neither correct nor supported.', () => {
      return service.authenticate({ email: 'mary@foalts.org', password })
        .then(() => fail('This promise should be rejected.'))
        .catch(err => strictEqual(err.message, 'Password format is incorrect or not supported.'));
    });

    it('should throw an error if the encrypted user password format (pbkdf2) is not supported.', () => {
      return service.authenticate({ email: 'sam@foalts.org', password })
        .then(() => fail('This promise should be rejected.'))
        .catch(err => strictEqual(err.message, 'Password format is incorrect (pbkdf2).'));
    });

    it('should return the authenticated user if the given email and password are correct.', async () => {
      const user = await service.authenticate({ email: 'john@foalts.org', password });
      if (!user) {
        throw new Error('The returned user should not be null.');
      }
      strictEqual(user.email, 'john@foalts.org');
      strictEqual(user.id, 1);
      strictEqual(user.password, encryptedPassword);
      strictEqual(user.username, 'John');
    });

  });

});
