import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {
  createConnection,
  getConnection,
  getManager,
} from 'typeorm';

import { ObjectDoesNotExist } from '../errors';

chai.use(chaiAsPromised);

const expect = chai.expect;

import { EntitySerializer } from './entity-serializer.service';
// TODO: remove user.entity.spec file.
import { User } from './user.entity.spec';

function testSuite(type: 'mysql'|'mariadb'|'postgres'|'sqlite', connectionName: string) {

  describe(`with ${type}`, () => {

    let service: EntitySerializer<User>;

    before(() => {
      class UserService extends EntitySerializer<User> {
        entityClass = User;
        connectionName = connectionName;
      }
      service = new UserService();
    });

    beforeEach(() => {
      switch (type) {
        case 'mysql':
        case 'mariadb':
          return createConnection({
            database: 'test',
            dropSchema: true,
            entities: [ User ],
            name: connectionName,
            password: 'test',
            synchronize: true,
            type,
            username: 'test',
          });
        case 'postgres':
          return createConnection({
            database: 'test',
            dropSchema: true,
            entities: [ User ],
            name: connectionName,
            password: 'test',
            synchronize: true,
            type,
            username: 'test',
          });
        case 'sqlite':
          return createConnection({
            database: 'test_db.sqlite',
            dropSchema: true,
            entities: [ User ],
            name: connectionName,
            synchronize: true,
            type,
          });
        default:
          break;
      }
    });

    afterEach(() => getConnection(connectionName).close());

    describe('when createOne is called', () => {

      it('should create one user into the database and then return it.', async () => {
        await service.createOne({
          firstName: 'Donald',
          lastName: 'Smith'
        });

        const users = await getManager(connectionName).find(User);

        // A user should be created in the database ...
        expect(users).to.be.an('array').and.to.have.lengthOf(1);
        const user = users[0];

        // ... with the proper values.
        expect(user.firstName).to.equal('Donald');
        expect(user.lastName).to.equal('Smith');
        expect(user.isAdmin).to.equal(false);
        expect(user.id).not.to.equal(undefined);
      });

      xit('should not replace an existing user (if an id is given).', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });
        await getManager(connectionName).save(user1);

        expect(user1.id).not.to.equal(undefined);

        await service.createOne({
          firstName: 'John',
          id: user1.id,
          lastName: 'Smith'
        });

        const users = await getManager(connectionName).find(User);

        expect(users).to.be.an('array').and.to.have.lengthOf(2);
      });

    });

    describe('when createMany is called', () => {

      it('should create several users into the database and then return them.', async () => {
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

        const users = await getManager(connectionName).find(User);

        // Two users should be created in the database ...
        expect(users).to.be.an('array').and.to.have.lengthOf(2);
        const user1 = users[0];
        const user2 = users[1];

        // ... with the proper values.
        expect(user1.firstName).to.equal('Donald');
        expect(user1.lastName).to.equal('Smith');
        expect(user1.isAdmin).to.equal(false);
        expect(user1.id).not.to.equal(undefined);

        expect(user2.firstName).to.equal('Victor');
        expect(user2.lastName).to.equal('Hugo');
        expect(user2.isAdmin).to.equal(true);
        expect(user2.id).not.to.equal(undefined);

        // The returned users should have the above fields.
        expect(result[0]).to.deep.equal({
          firstName: 'Donald',
          id: user1.id,
          isAdmin: false,
          lastName: 'Smith',
        });

        expect(result[1]).to.deep.equal({
          firstName: 'Victor',
          id: user2.id,
          isAdmin: true,
          lastName: 'Hugo',
        });
      });

      xit('should not replace an existing user (if an id is given).', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });
        await getManager(connectionName).save(user1);

        expect(user1.id).not.to.equal(undefined);

        await service.createMany([{
          firstName: 'John',
          id: user1.id,
          lastName: 'Smith'
        }]);

        const users = await getManager(connectionName).find(User);

        expect(users).to.be.an('array').and.to.have.lengthOf(2);
      });

    });

    describe('when findOne is called', () => {

      it('should return the suitable user from the database.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = getManager(connectionName).create(User, {
          firstName: 'Victor',
          isAdmin: true,
          lastName: 'Hugo',
        });

        await getManager(connectionName).save([ user1, user2 ]);

        const result = await service.findOne({ firstName: 'Victor' });

        expect(result).to.deep.equal({
          firstName: 'Victor',
          id: user2.id,
          isAdmin: true,
          lastName: 'Hugo',
        });
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return expect(service.findOne({ firstName: 'Jack' }))
          .to.be.rejectedWith(ObjectDoesNotExist);
      });

    });

    describe('when findMany is called', () => {

      it('should return all the suitable users from the database.', async () => {
        const user1 = getManager(connectionName).create(User, {
            firstName: 'Donald',
            lastName: 'Smith'
        });
        const user2 = getManager(connectionName).create(User, {
            firstName: 'Victor',
            isAdmin: true,
            lastName: 'Hugo',
        });

        await getManager(connectionName).save([ user1, user2 ]);

        // With an empty query
        let result = await service.findMany({});
        expect(result).to.be.an('array').and.to.have.lengthOf(2);
        expect(result[0]).to.deep.equal({
          firstName: 'Donald',
          id: user1.id,
          isAdmin: false,
          lastName: 'Smith',
        });

        expect(result[1]).to.deep.equal({
          firstName: 'Victor',
          id: user2.id,
          isAdmin: true,
          lastName: 'Hugo',
        });

        // With a non empty query
        result = await service.findMany({ firstName: 'Victor' });
        expect(result).to.be.an('array').and.to.have.lengthOf(1);
        expect(result[0]).to.deep.equal({
          firstName: 'Victor',
          id: user2.id,
          isAdmin: true,
          lastName: 'Hugo',
        });

      });

    });

    describe('when updateOne is called', () => {

      it('should update the suitable user.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = getManager(connectionName).create(User, {
          firstName: 'Victor',
          isAdmin: true,
          lastName: 'Hugo',
        });

        await getManager(connectionName).save([ user1, user2 ]);

        await service.updateOne({ firstName: 'Victor' }, { firstName: 'John' });

        // The suitable user should be updated in the database.
        const user = await getManager(connectionName).findOne(User, user2.id);
        if (!user) { throw new Error(); }
        expect(user.firstName).to.equal('John');

        // The other users should not be updated in the database.
        const userbis = await getManager(connectionName).findOne(User, user1.id);
        if (!userbis) { throw new Error(); }
        expect(userbis.firstName).to.equal('Donald');
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return expect(service.updateOne({ firstName: 'Jack' }, { firstName: 'Adele' }))
          .to.be.rejectedWith(ObjectDoesNotExist);
      });

    });

    describe('when removeOne is called', () => {

      it('should delete the suitable user.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });
        const user2 = getManager(connectionName).create(User, {
          firstName: 'Victor',
          lastName: 'Hugo',
        });

        await getManager(connectionName).save([ user1, user2 ]);

        await service.removeOne({ firstName: user2.firstName });

        const users = await getManager(connectionName).find(User);
        expect(users).to.be.an('array').and.to.have.lengthOf(1);
        expect(users[0].firstName).to.equal(user1.firstName);
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return expect(service.removeOne({ firstName: 'Jack' }))
          .to.be.rejectedWith(ObjectDoesNotExist);
      });

    });

  });

}

describe('EntitySerializer', () => {

  testSuite('mysql', 'mysql-connection');
  testSuite('mariadb', 'mariadb-connection');
  // We'll need to wait for this issue to be fixed before supporting both postgres and sqlite:
  // https://github.com/typeorm/typeorm/issues/1308
  // testSuite('sqlite', 'sqlite-connection');
  // testSuite('postgres', 'postgres-connection');

});
