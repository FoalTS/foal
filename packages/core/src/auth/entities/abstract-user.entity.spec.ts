import { expect } from 'chai';
import { BaseEntity } from 'typeorm';

import { AbstractUser } from './abstract-user.entity';

describe('AbstractUser', () => {

  class User extends AbstractUser {}

  it('should extend BaseEntity', () => {
    expect(new User()).to.be.an.instanceOf(BaseEntity);
  });

  describe('when hasPerm is called', () => {

    it('should return true if the user has the given permission and false otherwise.', () => {
      const user = new User();
      user.permissions = [ 'admin' ];
      expect(user.hasPerm('admin')).to.equal(true);
      expect(user.hasPerm('superuser')).to.equal(false);
    });

  });

});
