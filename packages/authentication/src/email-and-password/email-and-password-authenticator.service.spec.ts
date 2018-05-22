import { IModelService, ObjectDoesNotExist } from '@foal/common';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const expect = chai.expect;

import { EmailAndPasswordAuthenticatorService } from './email-and-password-authenticator.service';

describe('EmailAndPasswordAuthenticatorService', () => {

  interface User {
    email: string;
    password: string;
    username: string;
  }

  const password = 'foobar';
  const encryptedPassword = 'pbkdf2_sha256$100000$c678be5a273eee3938de7656071264b2$'
  + 'eb96ff7e947816f74908abc687926fec7e9a84c7e6c9a0c3d5d3cb718bc9'
  + '479410815c7b38cace114ec995354defe1e3511f3c103ed4356d457cb98bffc8d559';

  class ConcreteClass extends EmailAndPasswordAuthenticatorService<User> {}
  let service: ConcreteClass;

  class UserModelService implements IModelService<User, object, object, any> {
    createOne(): any {}
    createMany(): any {}

    findById(): any {}
    findOne(query: { email?: string }): User & { id: number } {
      if (query.email === 'john@foalts.org') {
        return {
          email: 'john@foalts.org',
          id: 1,
          password: encryptedPassword,
          username: 'John',
        };
      }
      if (query.email === 'jack@foalts.org') {
        return {
          email: 'jack@foalts.org',
          id: 2,
          password: 'bcrypt_mypassword',
          username: 'Jack',
        };
      }
      if (query.email === 'sam@foalts.org') {
        return {
          email: 'sam@foalts.org',
          id: 3,
          password: 'pbkdf2_sha256$hello_world',
          username: 'Sam',
        };
      }
      throw new ObjectDoesNotExist();
    }
    findAll(): any {}

    findByIdAndUpdate(): any {}
    findOneAndUpdate(): any {}
    updateMany(): void {}

    findByIdAndReplace(): any {}
    findOneAndReplace(): any {}

    findByIdAndRemove(): any {}
    findOneAndRemove(): any {}

    removeMany(): void {}
  }

  it('should instantiate.', () => {
    service = new ConcreteClass(new UserModelService());
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
