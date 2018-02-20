import { ModelService } from '@foal/common';
import { expect } from 'chai';

import { LocalAuthenticatorService, CheckPassword } from './local-authenticator.service';
import { ObjectType, NotFoundError, UnauthorizedError } from '@foal/core';

describe('LocalAuthenticatorService', () => {

  interface User {
    email: string;
    password: string;
    username: string;
  }

  class ConcreteClass extends LocalAuthenticatorService<User> {}
  let service: ConcreteClass;

  class UserModelService implements ModelService<User, ObjectType, ObjectType, any>, CheckPassword<User> {
    createOne(): any {}
    createMany(): any {}
    
    findById(): any {}
    findOne(query: ObjectType): User & { id: number } {
      if (query.email === 'john@gmail.com') {
        return {
          id: 1,
          username: 'John',
          password: 'strongPassword',
          email: 'john@gmail.com'
        }
      }
      throw new NotFoundError();
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
    
    checkPassword(user: User, password: string): boolean {
      return user.password === password;
    }
  }

  it('should instantiate.', () => {
    service = new ConcreteClass(new UserModelService());
  });

  describe(`when authenticate({ email, password }: { email: string, password: string }):
            Promise<User> is called`, () => {

    it('should throw an UnauthorizedError if no user is found for the given email.', async () => {
      try {
        await service.authenticate({ email: 'jack@gmail.com', password: 'foo'});
        throw  new Error('No error was thrown in authenticate().');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedError);
        expect(err.details).to.deep.equal({
          message: 'Incorrect email or password.'
        });
      };
    });

    it('should throw an UnauthorizedError if the given password is incorrect.', async () => {
      try {
        await service.authenticate({ email: 'john@gmail.com', password: 'wrongPassword'});
        throw  new Error('No error was thrown in authenticate().');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedError);
        expect(err.details).to.deep.equal({
          message: 'Incorrect email or password.'
        });
      };
    });

    it('should return the authenticated user if the given email and password are correct.', async () => {
      const user = await service.authenticate({ email: 'john@gmail.com', password: 'strongPassword'});
      expect(user).to.deep.equal({
        id: 1,
        username: 'John',
        password: 'strongPassword',
        email: 'john@gmail.com'
      });
    });

  });

});
