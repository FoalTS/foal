import { ModelService } from '@foal/common';
import { NotFoundError, ObjectType, UnauthorizedError } from '@foal/core';
import { expect } from 'chai';

import { CheckPassword, LocalAuthenticatorService } from './local-authenticator.service';

describe('LocalAuthenticatorService', () => {

  interface User {
    email: string;
    password: string;
    username: string;
  }

  class ConcreteClass extends LocalAuthenticatorService<User> {}
  let service: ConcreteClass;

  class UserModelService implements ModelService<User, ObjectType, ObjectType, any>, CheckPassword<User> {
    public createOne(): any {}
    public createMany(): any {}

    public findById(): any {}
    public findOne(query: ObjectType): User & { id: number } {
      if (query.email === 'john@foalts.org') {
        return {
          email: 'john@foalts.org',
          id: 1,
          password: 'strongPassword',
          username: 'John',
        };
      }
      throw new NotFoundError();
    }
    public findAll(): any {}

    public findByIdAndUpdate(): any {}
    public findOneAndUpdate(): any {}
    public updateMany(): void {}

    public findByIdAndReplace(): any {}
    public findOneAndReplace(): any {}

    public findByIdAndRemove(): any {}
    public findOneAndRemove(): any {}

    public removeMany(): void {}

    public checkPassword(user: User, password: string): boolean {
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
        await service.authenticate({ email: 'jack@foalts.org', password: 'foo'});
        throw  new Error('No error was thrown in authenticate().');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedError);
        expect(err.details).to.deep.equal({
          message: 'Incorrect email or password.'
        });
      }
    });

    it('should throw an UnauthorizedError if the given password is incorrect.', async () => {
      try {
        await service.authenticate({ email: 'john@foalts.org', password: 'wrongPassword'});
        throw  new Error('No error was thrown in authenticate().');
      } catch (err) {
        expect(err).to.be.instanceOf(UnauthorizedError);
        expect(err.details).to.deep.equal({
          message: 'Incorrect email or password.'
        });
      }
    });

    it('should return the authenticated user if the given email and password are correct.', async () => {
      const user = await service.authenticate({ email: 'john@foalts.org', password: 'strongPassword'});
      expect(user).to.deep.equal({
        email: 'john@foalts.org',
        id: 1,
        password: 'strongPassword',
        username: 'John',
      });
    });

  });

});
