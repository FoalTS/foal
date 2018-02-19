import { expect } from 'chai';
import * as Sequelize from 'sequelize';

import { NotFoundError } from '@foal/core';

import { SequelizeConnectionService } from './sequelize-connection.service';
import { SequelizeModelService } from './sequelize-model.service';

interface User {
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

interface CreatingUser {
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
}

function testSuite(dbName: string, uri: string) {

  describe(`with ${dbName}`, () => {

    let service: SequelizeModelService<User, CreatingUser>;

    before(() => {
      class ConcreteSequelizeConnectionService extends SequelizeConnectionService {
        constructor() {
          super(uri);
        }
      }

      class ConcreteSequelizeModelService extends SequelizeModelService<User, CreatingUser> {
        constructor(connection: SequelizeConnectionService) {
          super('users', {
            firstName: Sequelize.STRING,
            isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
            lastName: Sequelize.STRING,
          }, connection);
        }
      }
      service = new ConcreteSequelizeModelService(new ConcreteSequelizeConnectionService());
    });

    // Clear table before each test
    beforeEach(() => service.getSequelizeModel().sync({ force: true }));

    describe('when createOne(data: ICreatingModel): Promise<IModel & IIdAndTimeStamps> is called', () => {

      it('should create one user into the database and return it with its id and timestamps.', async () => {
        const result = await service.createOne({
          firstName: 'Donald',
          lastName: 'Smith'
        });

        const users = await service.getSequelizeModel().findAll();

        // A user should be created in the database ...
        expect(users).to.be.an('array').and.to.have.lengthOf(1);
        const user = users[0];

        // ... with the proper values.
        expect(user.get('firstName')).to.equal('Donald');
        expect(user.get('lastName')).to.equal('Smith');
        expect(user.get('isAdmin')).to.equal(false);

        // The returned user should have the above fields plus an id and timestamps.
        expect(result).to.deep.equal({
          createdAt: user.get('createdAt'),
          firstName: 'Donald',
          id: user.get('id'),
          isAdmin: false,
          lastName: 'Smith',
          updatedAt: user.get('updatedAt')
        });
      });

    });

    describe('when createMany(records: ICreatingModel[]): Promise<(IModel & IIdAndTimeStamps)[]> is called', () => {

      it('should create several users into the database and return them with their ids and timestamps.', async () => {
        const result = await service.createMany([
          {
            firstName: 'Donald',
            lastName: 'Smith'
          },
          {
            firstName: 'Victor',
            isAdmin: true,
            lastName: 'Hugo',
          }
        ]);

        const users = await service.getSequelizeModel().findAll();

        // Two users should be created in the database ...
        expect(users).to.be.an('array').and.to.have.lengthOf(2);
        const user1 = users[0];
        const user2 = users[1];

        // ... with the proper values.
        expect(user1.get('firstName')).to.equal('Donald');
        expect(user1.get('lastName')).to.equal('Smith');
        expect(user1.get('isAdmin')).to.equal(false);

        expect(user2.get('firstName')).to.equal('Victor');
        expect(user2.get('lastName')).to.equal('Hugo');
        expect(user2.get('isAdmin')).to.equal(true);

        // The returned users should have the above fields plus ids and timestamps.
        expect(result[0]).to.deep.equal({
          createdAt: user1.get('createdAt'),
          firstName: 'Donald',
          id: user1.get('id'),
          isAdmin: false,
          lastName: 'Smith',
          updatedAt: user1.get('updatedAt')
        });

        expect(result[1]).to.deep.equal({
          createdAt: user2.get('createdAt'),
          firstName: 'Victor',
          id: user2.get('id'),
          isAdmin: true,
          lastName: 'Hugo',
          updatedAt: user2.get('updatedAt')
        });
      });

    });

    describe('when findById(id: IdType): Promise<IModel & IIdAndTimeStamps> is called', () => {

      it('should return the suitable user from the database with its id and timestamps.', async () => {
        const user1 = await service.getSequelizeModel().create({
            firstName: 'Donald',
            lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
            firstName: 'Victor',
            isAdmin: true,
            lastName: 'Hugo',
        });

        const result = await service.findById(user2.get('id'));

        expect(result).to.deep.equal({
          createdAt: user2.get('createdAt'),
          firstName: 'Victor',
          id: user2.get('id'),
          isAdmin: true,
          lastName: 'Hugo',
          updatedAt: user2.get('updatedAt')
        });
      });

      it('should throw a NotFoundError if no suitable user exists in the database.', async () => {
        try {
          await service.findById(666);
          throw  new Error('No error was thrown in findById().');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('when findOne(query: ObjectType): Promise<IModel & IIdAndTimeStamps> is called', () => {

      it('should return the suitable user from the database with its id and timestamps.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
            firstName: 'Victor',
            isAdmin: true,
            lastName: 'Hugo',
        });

        const result = await service.findOne({ firstName: 'Victor' });

        expect(result).to.deep.equal({
          createdAt: user2.get('createdAt'),
          firstName: 'Victor',
          id: user2.get('id'),
          isAdmin: true,
          lastName: 'Hugo',
          updatedAt: user2.get('updatedAt')
        });
      });

      it('should throw a NotFoundError if no suitable user exists in the database.', async () => {
        try {
          await service.findOne({ firstName: 'Jack' });
          throw  new Error('No error was thrown in findOne().');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('when findAll(query: ObjectType): Promise<(IModel & IIdAndTimeStamps)[]> is called', () => {

      it('should return all the suitable users from the database with their ids and timestamps.', async () => {
        const user1 = await service.getSequelizeModel().create({
            firstName: 'Donald',
            lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
            firstName: 'Victor',
            isAdmin: true,
            lastName: 'Hugo',
        });

        // With an empty query
        let result = await service.findAll({});
        expect(result).to.be.an('array').and.to.have.lengthOf(2);
        expect(result[0]).to.deep.equal({
          createdAt: user1.get('createdAt'),
          firstName: 'Donald',
          id: user1.get('id'),
          isAdmin: false,
          lastName: 'Smith',
          updatedAt: user1.get('updatedAt')
        });

        expect(result[1]).to.deep.equal({
          createdAt: user2.get('createdAt'),
          firstName: 'Victor',
          id: user2.get('id'),
          isAdmin: true,
          lastName: 'Hugo',
          updatedAt: user2.get('updatedAt')
        });

        // With a non empty query
        result = await service.findAll({ firstName: 'Victor' });
        expect(result).to.be.an('array').and.to.have.lengthOf(1);
        expect(result[0]).to.deep.equal({
          createdAt: user2.get('createdAt'),
          firstName: 'Victor',
          id: user2.get('id'),
          isAdmin: true,
          lastName: 'Hugo',
          updatedAt: user2.get('updatedAt')
        });
      });

    });

    describe(`when findByIdAndUpdate(id: IdType,
               data: Partial<IModel & IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> is called`, () => {

      it('should update the suitable user and return it with its id and timestamps.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
          firstName: 'Victor',
          isAdmin: true,
          lastName: 'Hugo',
        });

        const result = await service.findByIdAndUpdate(user1.get('id'), { firstName: 'John' });

        // The suitable user should be updated in the database.
        const user = await service.getSequelizeModel().findById(user1.get('id'));
        expect(user.get('firstName')).to.equal('John');

        // The other users should not be updated in the database.
        const userbis = await service.getSequelizeModel().findById(user2.get('id'));
        expect(userbis.get('firstName')).to.equal('Victor');

        // The returned user should have the proper fields.
        expect(result).to.deep.equal({
          createdAt: user.get('createdAt'),
          firstName: 'John',
          id: user.get('id'),
          isAdmin: false,
          lastName: 'Smith',
          updatedAt: user.get('updatedAt'),
        });
      });

      it('should throw a NotFoundError if no suitable user exists in the database.', async () => {
        try {
          await service.findByIdAndUpdate(666, { firstName: 'Jack' });
          throw  new Error('No error was thrown in findByIdAndUpdate().');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe(`when findOneAndUpdate(query: ObjectType,
               data: Partial<IModel & IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> is called`, () => {

      it('should update the suitable user and return it with its id and timestamps.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
            firstName: 'Victor',
            isAdmin: true,
            lastName: 'Hugo',
        });

        const result = await service.findOneAndUpdate({ firstName: 'Donald' }, { firstName: 'John' });

        // The suitable user should be updated in the database.
        const user = await service.getSequelizeModel().findById(user1.get('id'));
        expect(user.get('firstName')).to.equal('John');

        // The other users should not be updated in the database.
        const userbis = await service.getSequelizeModel().findById(user2.get('id'));
        expect(userbis.get('firstName')).to.equal('Victor');

        // The returned user should have the proper fields.
        expect(result).to.deep.equal({
          createdAt: user.get('createdAt'),
          firstName: 'John',
          id: user.get('id'),
          isAdmin: false,
          lastName: 'Smith',
          updatedAt: user.get('updatedAt'),
        });
      });

      it('should throw a NotFoundError if no suitable user exists in the database.', async () => {
        try {
          await service.findOneAndUpdate({ firstName: 'Adele' }, { firstName: 'Jack' });
          throw  new Error('No error was thrown in findOneAndUpdate().');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('updateMany(query: ObjectType, data: Partial<IModel & IIdAndTimeStamps>): Promise<void>', () => {

      it('should update the suitable users.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
          firstName: 'Victor',
          lastName: 'Hugo',
        });
        const user3 = await service.getSequelizeModel().create({
          firstName: 'Adele',
          lastName: 'Hugo',
        });

        const users = await service.getSequelizeModel().findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(3);

        await service.updateMany({ lastName: 'Hugo' }, { isAdmin: true });

        const user1bis = await service.getSequelizeModel().findById(user1.get('id'));
        expect(user1bis.get('isAdmin')).to.equal(false);
        const user2bis = await service.getSequelizeModel().findById(user2.get('id'));
        expect(user2bis.get('isAdmin')).to.equal(true);
        const user3bis = await service.getSequelizeModel().findById(user3.get('id'));
        expect(user3bis.get('isAdmin')).to.equal(true);
      });

    });

    describe(`when findByIdAndReplace(id: IdType,
               data: IModel & Partial<IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> is called`, () => {

      it('should replace the suitable user and return it with its id and timestamps.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
            firstName: 'Victor',
            isAdmin: true,
            lastName: 'Hugo',
        });

        const result = await service.findByIdAndReplace(user1.get('id'), {
          firstName: 'Napoleon',
          isAdmin: true,
          lastName: 'Bonaparte'
        });

        // The suitable user should be updated in the database.
        const user = await service.getSequelizeModel().findById(user1.get('id'));
        expect(user.get('firstName')).to.equal('Napoleon');
        expect(user.get('isAdmin')).to.equal(true);
        expect(user.get('lastName')).to.equal('Bonaparte');

        // The other users should not be updated in the database.
        const userbis = await service.getSequelizeModel().findById(user2.get('id'));
        expect(userbis.get('firstName')).to.equal('Victor');
        expect(userbis.get('lastName')).to.equal('Hugo');

        // The returned user should have the proper fields.
        expect(result).to.deep.equal({
          createdAt: user.get('createdAt'),
          firstName: 'Napoleon',
          id: user.get('id'),
          isAdmin: true,
          lastName: 'Bonaparte',
          updatedAt: user.get('updatedAt'),
        });
      });

      it('should throw a NotFoundError if no suitable user exists in the database.', async () => {
        try {
          await service.findByIdAndReplace(666, {
            firstName: 'Napoleon',
            isAdmin: true,
            lastName: 'Bonaparte'
          });
          throw  new Error('No error was thrown in findByIdAndReplace().');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe(`when findOneAndReplace(query: ObjectType,
               data: IModel & Partial<IIdAndTimeStamps>): Promise<IModel & IIdAndTimeStamps> is called`, () => {

      it('should replace the suitable user and return it with its id and timestamps.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
            firstName: 'Victor',
            isAdmin: true,
            lastName: 'Hugo',
        });

        const result = await service.findOneAndReplace({ firstName: 'Donald' }, {
          firstName: 'Napoleon',
          isAdmin: true,
          lastName: 'Bonaparte'
        });

        // The suitable user should be updated in the database.
        const user = await service.getSequelizeModel().findById(user1.get('id'));
        expect(user.get('firstName')).to.equal('Napoleon');
        expect(user.get('isAdmin')).to.equal(true);
        expect(user.get('lastName')).to.equal('Bonaparte');

        // The other users should not be updated in the database.
        const userbis = await service.getSequelizeModel().findById(user2.get('id'));
        expect(userbis.get('firstName')).to.equal('Victor');
        expect(userbis.get('lastName')).to.equal('Hugo');

        // The returned user should have the proper fields.
        expect(result).to.deep.equal({
          createdAt: user.get('createdAt'),
          firstName: 'Napoleon',
          id: user.get('id'),
          isAdmin: true,
          lastName: 'Bonaparte',
          updatedAt: user.get('updatedAt'),
        });
      });

      it('should throw a NotFoundError if no suitable user exists in the database.', async () => {
        try {
          await service.findOneAndReplace({ firstName: 'Jack' }, {
            firstName: 'Napoleon',
            isAdmin: true,
            lastName: 'Bonaparte'
          });
          throw  new Error('No error was thrown in findOneAndReplace().');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('when findByIdAndRemove(id: IdType): Promise<void> is called', () => {

      it('should delete the suitable user.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
          firstName: 'Victor',
          lastName: 'Hugo',
        });

        let users = await service.getSequelizeModel().findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(2);

        await service.findByIdAndRemove(user1.get('id'));

        users = await service.getSequelizeModel().findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(1);
        expect(users[0].get('id')).not.to.equal(user1.get('id'));
      });

      it('should throw a NotFoundError if no suitable user exists in the database.', async () => {
        try {
          await service.findByIdAndRemove(666);
          throw  new Error('No error was thrown in findByIdAndRemove().');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('when findOneAndRemove(query: ObjectType): Promise<void> is called', () => {

      it('should delete the suitable user.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
          firstName: 'Victor',
          lastName: 'Hugo',
        });

        let users = await service.getSequelizeModel().findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(2);

        await service.findOneAndRemove({ firstName: user1.get('firstName')});

        users = await service.getSequelizeModel().findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(1);
        expect(users[0].get('firstName')).not.to.equal(user1.get('firstName'));
      });

      it('should throw a NotFoundError if no suitable user exists in the database.', async () => {
        try {
          await service.findOneAndRemove({ firstName: 'Jack' });
          throw  new Error('No error was thrown in findByIdAndRemove().');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('when removeMany(query: ObjectType): Promise<void> is called', () => {

      it('should delete the suitable users.', async () => {
        const user1 = await service.getSequelizeModel().create({
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = await service.getSequelizeModel().create({
          firstName: 'Victor',
          lastName: 'Hugo',
        });
        const user3 = await service.getSequelizeModel().create({
          firstName: 'Adele',
          lastName: 'Hugo',
        });

        let users = await service.getSequelizeModel().findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(3);

        await service.removeMany({ lastName: 'Hugo' });

        users = await service.getSequelizeModel().findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(1);
        expect(users[0].get('lastName')).to.equal('Smith');
      });

    });

  });

}

describe('SequelizeModelService<User>', () => {

  // Postgres
  const user = process.env.postgres_user !== undefined ?  process.env.postgres_user :  'postgres';
  const password = process.env.postgres_password !== undefined ? process.env.postgres_password : 'password';
  testSuite('PostgreSQL', `postgres://${user}:${password}@localhost:5432/foal_sequelize_test`);

  // MySQL
  // user = process.env.mysql_user !== undefined ? process.env.mysql_user : 'root';
  // password = process.env.mysql_password !== undefined ? process.env.mysql_password : 'password';
  // testSuite('MySQL', `mysql://${user}:${password}@localhost:3306/foal_sequelize_test`);

});
