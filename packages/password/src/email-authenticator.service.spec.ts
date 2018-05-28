import { AbstractUser, Class, IModelService, ObjectDoesNotExist } from '@foal/core';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Column, Connection, createConnection, Entity } from 'typeorm';

chai.use(chaiAsPromised);

const expect = chai.expect;

import { AbstractEmailAuthenticator } from './email-authenticator.service';

describe('AbstractEmailAuthenticator', () => {

  @Entity()
  class User extends AbstractUser {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;
  }

  const password = 'foobar';
  const encryptedPassword = 'pbkdf2_sha256$100000$c678be5a273eee3938de7656071264b2$'
  + 'eb96ff7e947816f74908abc687926fec7e9a84c7e6c9a0c3d5d3cb718bc9'
  + '479410815c7b38cace114ec995354defe1e3511f3c103ed4356d457cb98bffc8d559';

  class ConcreteClass extends AbstractEmailAuthenticator<User> {
    UserClass = User;
  }

  let connection: Connection;
  let service: AbstractEmailAuthenticator<User>;

  beforeEach(async () => {
    connection = await createConnection({
      database: 'test',
      dropSchema: true,
      entities: [ User ],
      password: 'test',
      synchronize: true,
      type: 'mysql',
      username: 'test',
    });
  });

  afterEach(async () => {
    await connection.close();
  });

  beforeEach(() => {
    const john = new User();
    john.email = 'john@foalts.org';
    john.id = 1;
    john.password = encryptedPassword;
    john.roles = [];
    john.username = 'John';

    const jack = new User();
    jack.email = 'jack@foalts.org';
    jack.id = 2;
    jack.password = 'bcrypt_mypassword';
    jack.roles = [];
    jack.username = 'Jack';

    const sam = new User();
    sam.email = 'sam@foalts.org';
    sam.id = 3;
    sam.password = 'pbkdf2_sha256$hello_world';
    sam.roles = [];
    sam.username = 'Sam';

    return Promise.all([
      john.save(),
      jack.save(),
      sam.save()
    ]);
  });

  it('should instantiate.', () => {
    service = new ConcreteClass();
  });

  describe('when authenticate is called', () => {

    it('should return null if no user is found for the given email.', async () => {
      const user = await service.authenticate({ email: 'jack2@foalts.org', password: 'foo' });
      expect(user).to.equal(null);
    });

    it('should return null if the given password is incorrect.', async () => {
      const user = await service.authenticate({ email: 'john@foalts.org', password: 'wrongPassword'});
      expect(user).to.equal(null);
    });

    it('should throw an error if the encrypted user password format is neither correct nor supported.', () => {
      return expect(service.authenticate({ email: 'jack@foalts.org', password }))
        .to.be.rejectedWith('Password format is incorrect or not supported.');
    });

    it('should throw an error if the encrypted user password format (pbkdf2) is not supported.', () => {
      return expect(service.authenticate({ email: 'sam@foalts.org', password }))
        .to.be.rejectedWith('Password format is incorrect (pbkdf2).');
    });

    it('should return the authenticated user if the given email and password are correct.', async () => {
      const user = await service.authenticate({ email: 'john@foalts.org', password });
      expect(user).to.deep.equal({
        email: 'john@foalts.org',
        id: 1,
        password: encryptedPassword,
        username: 'John',
      });
    });

  });

});
