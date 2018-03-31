import { IModelService, ObjectDoesNotExist } from '@foal/common';
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

  class UserModelService implements IModelService<User, object, object, any>, CheckPassword<User> {
    public createOne(): any {}
    public createMany(): any {}

    public findById(): any {}
    public findOne(query: { email?: string }): User & { id: number } {
      if (query.email === 'john@foalts.org') {
        return {
          email: 'john@foalts.org',
          id: 1,
          password: 'strongPassword',
          username: 'John',
        };
      }
      throw new ObjectDoesNotExist();
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

  describe('when authenticate is called', () => {

    it('should return null if no user is found for the given email.', async () => {
      const user = await service.authenticate({ email: 'jack@foalts.org', password: 'foo' });
      expect(user).to.equal(null);
    });

    it('should return null if the given password is incorrect.', async () => {
      const user = await service.authenticate({ email: 'john@foalts.org', password: 'wrongPassword'});
      expect(user).to.equal(null);
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
