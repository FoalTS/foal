import { expect } from 'chai';
import { BaseEntity, Entity } from 'typeorm';

import { AbstractUser } from './abstract-user';

describe('AbstractUser', () => {

  // Clear table before each test
  @Entity()
  class User extends AbstractUser {}

  it('should extend BaseEntity', () => {
    expect(new User()).to.be.an.instanceOf(BaseEntity);
  });

  // should has id as PrimaryGeneratedColumn

  describe('should add a column "isAdmin" to the created table that', () => {

    beforeEach(async () => {
      // service = new UserService(connection);
      // await service.getSequelizeModel().sync({ force: true });
    });

    it('accepts boolean values.', async () => {
      // await service.createOne({ isAdmin: true });
      // let users = await service.findAll({});
      // expect(users).to.be.an('array').and.to.have.lengthOf(1);
      // expect(users[0]).to.include({ isAdmin: true });

      // await service.createOne({ isAdmin: false });
      // users = await service.findAll({});
      // expect(users).to.be.an('array').and.to.have.lengthOf(2);
      // expect(users[1]).to.include({ isAdmin: false });

      // try {
      //   await service.createOne({ isAdmin: 'a string' });
      //   throw new Error('Column "isAdmin" should only accept boolean values.');
      // } catch (err) {
      //   if (!(err instanceof Sequelize.DatabaseError)) {
      //     throw err;
      //   }
      // }
    });

    it('does not accept null values.', async () => {
      // try {
      //   await service.createOne({ isAdmin: null });
      //   throw new Error('Column "isAdmin" should not accept null value.');
      // } catch (err) {
      //   if (!(err instanceof Sequelize.ValidationError)) {
      //     throw err;
      //   }
      // }
    });

    it('has a default value if none is specified at creation.', async () => {
      // await service.createOne({});
      // const users = await service.findAll({});
      // expect(users).to.be.an('array').and.to.have.lengthOf(1);
      // expect(users[0]).to.include({ isAdmin: false });
    });

  });

});
