import { expect } from 'chai';
import * as Sequelize from 'sequelize';

import { NotFoundError, RestParams } from '@foal/core';

import { SequelizeConnectionService } from './sequelize-connection.service';
import { SequelizeService } from './sequelize.service';

interface User {
  firstName: string;
  lastName: string;
}

describe('SequelizeService', () => {

  let connection: SequelizeConnectionService;
  let service: SequelizeService;
  let model: any;
  let user: User;
  let user2: User;
  let emptyParams: RestParams;

  before(() => {
    class ConcreteSequelizeConnectionService extends SequelizeConnectionService {
      constructor() {
        // This is an ugly hack to run tests on local and on travis.
        const password = process.env.password || 'LoicPoullain';
        super(`postgres://postgres:${password}@localhost:5432/foal_test_db`);
      }
    }
    connection = new ConcreteSequelizeConnectionService();

    class ConcreteSequelizeService extends SequelizeService {
      constructor(connection: SequelizeConnectionService) {
        super('users', {
          firstName: Sequelize.STRING,
          lastName: Sequelize.STRING
        }, connection);
        model = this.model;
      }
    }
    service = new ConcreteSequelizeService(connection);

    user = {
      firstName: 'John',
      lastName: 'Smith'
    };
    user2 = {
      firstName: 'Estelle',
      lastName: 'Dupont'
    };
    emptyParams = { query: {} };
  });

  // Clear table before each test
  beforeEach(() => model.sync({ force: true }));

  describe('when create(data: any, params: RestParams): Promise<any> is called', () => {

    it('should create one user in the db and return it if `data` is an object.', async () => {
      const result = await service.create(user, emptyParams);

      const users = await model.findAll();

      expect(users).to.be.an('array').and.to.have.lengthOf(1);
      expect(users[0].dataValues).to.deep.equal(result);
      expect(result).to.not.equal(user);
    });

    it('should create many users in the db and return them if `data` is an array.', async () => {
      const result = await service.create([ user, user2 ], emptyParams);

      const users = await model.findAll();

      expect(users).to.be.an('array').and.to.have.lengthOf(2);
      expect(result).to.be.an('array').and.to.have.lengthOf(2);
      expect(users.map(e => e.dataValues)).to.deep.equal(result);
      expect(result).to.not.equal([ user, user2 ]);
    });

  });

  describe('when getAll(params: RestParams): Promise<any> is called', () => {

    describe('with empty params', () => {

      it('should return all users from the db.', async () => {
        const createdUser = (await model.create(user)).dataValues;
        const createdUser2 = (await model.create(user2)).dataValues;

        const result = await service.getAll(emptyParams);
        expect(result).to.deep.equal([ createdUser, createdUser2 ]);
      });

    });

    describe('with non empty params', () => {

      it('should use params.query to get users from the db.', async () => {
        const createdUser = (await model.create(user)).dataValues;
        await model.create(user2);

        const query: any = { firstName: user.firstName };

        const result = await service.getAll({ query });
        expect(result).to.deep.equal([ createdUser ]);
      });

    });

  });

  describe('when get(id: any, params: RestParams): Promise<any> is called', () => {

    it('should return the user with the given id from the db.', async () => {
      const createdUser = (await model.create(user)).dataValues;

      const result = await service.get(createdUser.id, emptyParams);

      expect(result).to.deep.equal(createdUser);
    });

    it('should throw an NotFoundError if no user exists in the db with the given id.', async () => {
      try {
        await service.get(666, emptyParams);
        throw  new Error('No error was thrown in get()');
      } catch (err) {
        expect(err).to.be.instanceof(NotFoundError);
      }
    });

  });

  describe('when update(id: any, data: any, params: RestParams): Promise<any> is called', () => {

    it('should update and return the user with the given id with the given data.', async () => {
      const createdUser = (await model.create(user)).dataValues;
      const createdUser2 = (await model.create(user2)).dataValues;

      const updatedUser = await service.update(createdUser.id, {
        lastName: 'Washington'
      }, emptyParams);

      const userFromDB = (await model.findById(createdUser.id)).dataValues;
      const user2FromDB = (await model.findById(createdUser2.id)).dataValues;

      expect(userFromDB.lastName).to.equal('Washington');
      expect(user2FromDB.lastName).to.equal(user2.lastName);
      expect(updatedUser).to.deep.equal(userFromDB);
    });

    it('should throw an NotFoundError if no user exists in the db with the given id.', async () => {
      try {
        await service.update(666, {}, emptyParams);
        throw  new Error('No error was thrown in get()');
      } catch (err) {
        expect(err).to.be.instanceof(NotFoundError);
      }
    });

  });

  describe('when patch(id: any, data: any, params: RestParams): Promise<any> is called', () => {

    it('should update and return the user with the given id with the given data.', async () => {
      const createdUser = (await model.create(user)).dataValues;
      const createdUser2 = (await model.create(user2)).dataValues;

      const updatedUser = await service.patch(createdUser.id, {
        lastName: 'Washington'
      }, emptyParams);

      const userFromDB = (await model.findById(createdUser.id)).dataValues;
      const user2FromDB = (await model.findById(createdUser2.id)).dataValues;

      expect(userFromDB.lastName).to.equal('Washington');
      expect(user2FromDB.lastName).to.equal(user2.lastName);
      expect(updatedUser).to.deep.equal(userFromDB);
    });

    it('should throw an NotFoundError if no user exists in the db with the given id.', async () => {
      try {
        await service.patch(666, {}, emptyParams);
        throw  new Error('No error was thrown in get()');
      } catch (err) {
        expect(err).to.be.instanceof(NotFoundError);
      }
    });

  });

  describe('when delete(id: any, params: RestParams): Promise<any> is called', () => {

    it('should delete the user with the given id from the db.', async () => {
      const createdUser = (await model.create(user)).dataValues;
      const createdUser2 = (await model.create(user2)).dataValues;

      let users = await model.findAll();
      expect(users).to.be.an('array').and.to.have.lengthOf(2);

      await service.delete(createdUser.id, emptyParams);

      users = await model.findAll();
      expect(users).to.be.an('array').and.to.have.lengthOf(1);
      expect(users[0].dataValues).to.deep.equal(createdUser2);
    });

    it('should throw an NotFoundError if no user exists in the db with the given id.', async () => {
      try {
        await service.delete(666, emptyParams);
        throw  new Error('No error was thrown in get()');
      } catch (err) {
        expect(err).to.be.instanceof(NotFoundError);
      }
    });

  });

});
