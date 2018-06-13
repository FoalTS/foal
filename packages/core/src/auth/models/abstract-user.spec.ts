import { expect } from 'chai';
import { BaseEntity } from 'typeorm';

import { AbstractUser } from './abstract-user';

describe('AbstractUser', () => {

  class User extends AbstractUser {}

  it('should extend BaseEntity', () => {
    expect(new User()).to.be.an.instanceOf(BaseEntity);
  });

  describe('when hasRole is called', () => {

    it('should return true if the user has the given role and false otherwise.', () => {
      const user = new User();
      user.roles = [ 'admin' ];
      expect(user.hasRole('admin')).to.equal(true);
      expect(user.hasRole('superuser')).to.equal(false);
    });

  });

});
