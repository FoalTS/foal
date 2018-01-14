import { expect } from 'chai';
import * as Sequelize from 'sequelize';

import { NotFoundError } from '@foal/core';

import { SequelizeConnectionService } from './sequelize-connection.service';
import { SequelizeService } from './sequelize.service';

interface User {
  firstName: string;
  lastName: string;
}

function testSuite(dbName: string, uri: string) {

  describe(`with ${dbName}`, () => {

    let service: SequelizeService<User>;
    let model: any;
    let user: User;
    let user2: User;

    before(() => {
      class ConcreteSequelizeConnectionService extends SequelizeConnectionService {
        constructor() {
          super(uri);
        }
      }

      class ConcreteSequelizeService extends SequelizeService<User> {
        constructor(connection: SequelizeConnectionService) {
          super('users', {
            firstName: Sequelize.STRING,
            lastName: Sequelize.STRING
          }, connection);
          model = this.model;
        }
      }
      service = new ConcreteSequelizeService(new ConcreteSequelizeConnectionService());

      user = {
        firstName: 'John',
        lastName: 'Smith'
      };
      user2 = {
        firstName: 'Estelle',
        lastName: 'Dupont'
      };
    });

    // Clear table before each test
    beforeEach(() => model.sync({ force: true }));

    describe('when create(data: any, query: ObjectType): Promise<User|User[]> is called', () => {

      it('should create one user in the db and return it if `data` is an object.', async () => {
        const result = await service.create(user, {});

        const users = await model.findAll();

        expect(users).to.be.an('array').and.to.have.lengthOf(1);
        expect(users[0].dataValues).to.deep.equal(result);
        expect(result).to.not.equal(user);
      });

      it('should create many users in the db and return them if `data` is an array.', async () => {
        const result = await service.create([ user, user2 ], {});

        const users = await model.findAll();

        expect(users).to.be.an('array').and.to.have.lengthOf(2);
        expect(result).to.be.an('array').and.to.have.lengthOf(2);
        expect(users.map(e => e.dataValues)).to.deep.equal(result);
        expect(result).to.not.equal([ user, user2 ]);
      });

    });

    describe('when getAll(query: ObjectType): Promise<User[]> is called', () => {

      describe('with empty query', () => {

        it('should return all users from the db.', async () => {
          const createdUser = (await model.create(user)).dataValues;
          const createdUser2 = (await model.create(user2)).dataValues;

          const result = await service.getAll({});
          expect(result).to.deep.equal([ createdUser, createdUser2 ]);
        });

      });

      describe('with non empty query', () => {

        it('should use `query` to get users from the db.', async () => {
          const createdUser = (await model.create(user)).dataValues;
          await model.create(user2);

          const query: any = { firstName: user.firstName };

          const result = await service.getAll(query);
          expect(result).to.deep.equal([ createdUser ]);
        });

      });

    });

    describe('when get(id: any, query: ObjectType): Promise<User> is called', () => {

      it('should return the user with the given id from the db.', async () => {
        const createdUser = (await model.create(user)).dataValues;

        const result = await service.get(createdUser.id, {});

        expect(result).to.deep.equal(createdUser);
      });

      it('should throw an NotFoundError if no user exists in the db with the given id.', async () => {
        try {
          await service.get(666, {});
          throw  new Error('No error was thrown in get()');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('when update(id: any, data: any, query: ObjectType): Promise<User> is called', () => {

      it('should update and return the user with the given id with the given data.', async () => {
        const createdUser = (await model.create(user)).dataValues;
        const createdUser2 = (await model.create(user2)).dataValues;

        const updatedUser = await service.replace(createdUser.id, {
          lastName: 'Washington'
        }, {});

        const userFromDB = (await model.findById(createdUser.id)).dataValues;
        const user2FromDB = (await model.findById(createdUser2.id)).dataValues;

        expect(userFromDB.lastName).to.equal('Washington');
        expect(user2FromDB.lastName).to.equal(user2.lastName);
        expect(updatedUser).to.deep.equal(userFromDB);
      });

      it('should throw an NotFoundError if no user exists in the db with the given id.', async () => {
        try {
          await service.replace(666, {}, {});
          throw  new Error('No error was thrown in get()');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('when modify(id: any, data: any, query: ObjectType): Promise<User> is called', () => {

      it('should update and return the user with the given id with the given data.', async () => {
        const createdUser = (await model.create(user)).dataValues;
        const createdUser2 = (await model.create(user2)).dataValues;

        const updatedUser = await service.modify(createdUser.id, {
          lastName: 'Washington'
        }, {});

        const userFromDB = (await model.findById(createdUser.id)).dataValues;
        const user2FromDB = (await model.findById(createdUser2.id)).dataValues;

        expect(userFromDB.lastName).to.equal('Washington');
        expect(user2FromDB.lastName).to.equal(user2.lastName);
        expect(updatedUser).to.deep.equal(userFromDB);
      });

      it('should throw an NotFoundError if no user exists in the db with the given id.', async () => {
        try {
          await service.modify(666, {}, {});
          throw  new Error('No error was thrown in get()');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

    describe('when delete(id: any, query: ObjectType): Promise<any> is called', () => {

      it('should delete the user with the given id from the db.', async () => {
        const createdUser = (await model.create(user)).dataValues;
        const createdUser2 = (await model.create(user2)).dataValues;

        let users = await model.findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(2);

        await service.delete(createdUser.id, {});

        users = await model.findAll();
        expect(users).to.be.an('array').and.to.have.lengthOf(1);
        expect(users[0].dataValues).to.deep.equal(createdUser2);
      });

      it('should throw an NotFoundError if no user exists in the db with the given id.', async () => {
        try {
          await service.delete(666, {});
          throw  new Error('No error was thrown in get()');
        } catch (err) {
          expect(err).to.be.instanceof(NotFoundError);
        }
      });

    });

  });

}

describe('SequelizeService<User>', () => {

  // Postgres
  let user = process.env.postgres_user !== undefined ?  process.env.postgres_user :  'postgres';
  let password = process.env.postgres_password !== undefined ? process.env.postgres_password : 'password';
  testSuite('PostgreSQL', `postgres://${user}:${password}@localhost:5432/foal_sequelize_test`);

  // MySQL
  user = process.env.mysql_user !== undefined ? process.env.mysql_user : 'root';
  password = process.env.mysql_password !== undefined ? process.env.mysql_password : 'password';
  testSuite('MySQL', `mysql://${user}:${password}@localhost:3306/foal_sequelize_test`);

});
