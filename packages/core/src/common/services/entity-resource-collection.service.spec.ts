// std
import { fail, notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Column,
  createConnection,
  Entity,
  getConnection,
  getManager,
  PrimaryGeneratedColumn,
} from 'typeorm';

// FoalTS
import { ObjectDoesNotExist, PermissionDenied } from '../errors';
import { EntityResourceCollection } from './entity-resource-collection.service';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column()
  // @ts-ignore : Property 'firstName' has no initializer and is not definitely assigned in theconstructor.
  firstName: string;

  @Column()
  // @ts-ignore : Property 'lastName' has no initializer and is not definitely assigned in theconstructor.
  lastName: string;

  @Column({ default: false })
  // @ts-ignore : Property 'isAdmin' has no initializer and is not definitely assigned in theconstructor.
  isAdmin: boolean;
}

function testSuite(type: 'mysql'|'mariadb'|'postgres'|'sqlite', connectionName: string) {

  describe(`with ${type}`, () => {

    let service: EntityResourceCollection;

    before(() => {
      class UserService extends EntityResourceCollection {
        entityClass = User;
        allowedOperations: EntityResourceCollection['allowedOperations']
          = [ 'create', 'findById', 'find', 'modifyById', 'updateById', 'deleteById' ];
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

    describe('when create is called', () => {

      it('should throw a PermissionDenied if service.allowedOperations does not include "create".', () => {
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ /*'create',*/ 'findById', 'find', 'modifyById', 'updateById', 'deleteById' ];
          connectionName = connectionName;
        }
        const service = new UserService();

        return service.create(undefined, {}, {})
          .then(() => fail('service.create should rejects an error.'))
          .catch(err => ok(err instanceof PermissionDenied));
      });

      describe('with an object as data', () => {

        it('should create one user into the database and then return it.', async () => {
          await service.create(undefined, {
            firstName: 'Donald',
            lastName: 'Smith'
          }, {});

          const users = await getManager(connectionName).find(User);

          // A user should be created in the database ...
          ok(Array.isArray(users));
          strictEqual(users.length, 1);
          const user = users[0];

          // ... with the proper values.
          strictEqual(user.firstName, 'Donald');
          strictEqual(user.lastName, 'Smith');
          strictEqual(user.isAdmin, false);
          notStrictEqual(user.id, undefined);
        });

        xit('should not replace an existing user (if an id is given).', async () => {
          const user1 = getManager(connectionName).create(User, {
            firstName: 'Donald',
            lastName: 'Smith'
          });
          await getManager(connectionName).save(user1);

          notStrictEqual(user1.id, undefined);

          await service.create(undefined, {
            firstName: 'John',
            id: user1.id,
            lastName: 'Smith'
          }, {});

          const users = await getManager(connectionName).find(User);

          ok(Array.isArray(users));
          strictEqual(users.length, 2);
        });

      });

      describe('with an array as data', () => {

        it('should create several users into the database and then return them.', async () => {
          const result = await service.create(undefined, [
            {
              firstName: 'Donald',
              lastName: 'Smith'
            },
            {
              firstName: 'Victor',
              isAdmin: true,
              lastName: 'Hugo',
            }
          ], {});

          const users = await getManager(connectionName).find(User);

          // Two users should be created in the database ...
          ok(Array.isArray(users));
          strictEqual(users.length, 2);
          const user1 = users[0];
          const user2 = users[1];

          // ... with the proper values.
          strictEqual(user1.firstName, 'Donald');
          strictEqual(user1.lastName, 'Smith');
          strictEqual(user1.isAdmin, false);
          notStrictEqual(user1.id, undefined);

          strictEqual(user2.firstName, 'Victor');
          strictEqual(user2.lastName, 'Hugo');
          strictEqual(user2.isAdmin, true);
          notStrictEqual(user2.id, undefined);

          // The returned users should have the above fields.
          strictEqual((result[0] as any).firstName, 'Donald');
          strictEqual((result[0] as any).id, user1.id);
          strictEqual((result[0] as any).isAdmin, false);
          strictEqual((result[0] as any).lastName, 'Smith');

          strictEqual((result[1] as any).firstName, 'Victor');
          strictEqual((result[1] as any).id, user2.id);
          strictEqual((result[1] as any).isAdmin, true);
          strictEqual((result[1] as any).lastName, 'Hugo');
        });

        xit('should not replace an existing user (if an id is given).', async () => {
          const user1 = getManager(connectionName).create(User, {
            firstName: 'Donald',
            lastName: 'Smith'
          });
          await getManager(connectionName).save(user1);

          notStrictEqual(user1.id, undefined);

          await service.create(undefined, [{
            firstName: 'John',
            id: user1.id,
            lastName: 'Smith'
          }], {});

          const users = await getManager(connectionName).find(User);

          ok(Array.isArray(users));
          strictEqual(users.length, 2);
        });

      });

    });

    describe('when findById is called', () => {

      it('should throw a PermissionDenied if service.allowedOperations does not include "findById".', () => {
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'create', /*'findById',*/ 'find', 'modifyById', 'updateById', 'deleteById' ];
          connectionName = connectionName;
        }
        const service = new UserService();

        return service.findById(undefined, undefined, {})
          .then(() => fail('service.findById should rejects an error.'))
          .catch(err => ok(err instanceof PermissionDenied));
      });

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

        const result = await service.findById(undefined, user2.id, {});

        strictEqual((result as any).firstName, 'Victor');
        strictEqual((result as any).id, user2.id);
        strictEqual((result as any).isAdmin, true);
        strictEqual((result as any).lastName, 'Hugo');
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return service.findById(undefined, 3, {})
          .then(() => fail('The promise should be rejected.'))
          .catch(err => ok(err instanceof ObjectDoesNotExist));
      });

    });

    describe('when find is called', () => {

      it('should throw a PermissionDenied if service.allowedOperations does not include "find".', () => {
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'create', 'findById', /*'find',*/ 'modifyById', 'updateById', 'deleteById' ];
          connectionName = connectionName;
        }
        const service = new UserService();

        return service.find(undefined, { query: {} })
          .then(() => fail('service.find should rejects an error.'))
          .catch(err => ok(err instanceof PermissionDenied));
      });

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
        let result = await service.find(undefined, { query: {} });
        ok(Array.isArray(result));
        strictEqual(result.length, 2);

        strictEqual((result[0] as any).firstName, 'Donald');
        strictEqual((result[0] as any).id, user1.id);
        strictEqual((result[0] as any).isAdmin, false);
        strictEqual((result[0] as any).lastName, 'Smith');

        strictEqual((result[1] as any).firstName, 'Victor');
        strictEqual((result[1] as any).id, user2.id);
        strictEqual((result[1] as any).isAdmin, true);
        strictEqual((result[1] as any).lastName, 'Hugo');

        // With a non empty query
        result = await service.find(undefined, { query: { firstName: 'Victor' } });
        ok(Array.isArray(result));
        strictEqual(result.length, 1);

        strictEqual((result[0] as any).firstName, 'Victor');
        strictEqual((result[0] as any).id, user2.id);
        strictEqual((result[0] as any).isAdmin, true);
        strictEqual((result[0] as any).lastName, 'Hugo');

      });

    });

    describe('when modifyById is called', () => {

      it('should throw a PermissionDenied if service.allowedOperations does not include "modifyById".', () => {
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'create', 'findById', 'find', /*'modifyById',*/ 'updateById', 'deleteById' ];
          connectionName = connectionName;
        }
        const service = new UserService();

        return service.modifyById(undefined, undefined, {}, {})
          .then(() => fail('service.modifyById should rejects an error.'))
          .catch(err => ok(err instanceof PermissionDenied));
      });

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

        await service.modifyById(undefined, undefined, { firstName: 'John' }, { firstName: 'Victor' });

        // The suitable user should be updated in the database.
        const user = await getManager(connectionName).findOne(User, user2.id);
        if (!user) { throw new Error(); }
        strictEqual(user.firstName, 'John');

        // The other users should not be updated in the database.
        const userbis = await getManager(connectionName).findOne(User, user1.id);
        if (!userbis) { throw new Error(); }
        strictEqual(userbis.firstName, 'Donald');
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return service.modifyById(undefined, undefined, { firstName: 'Adele' }, { firstName: 'Jack' })
          .then(() => fail('The promise should be rejected.'))
          .catch(err => ok(err instanceof ObjectDoesNotExist));
      });

    });

    describe('when updateById is called', () => {

      it('should throw a PermissionDenied if service.allowedOperations does not include "updateById".', () => {
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'create', 'findById', 'find', 'modifyById', /*'updateById',*/ 'deleteById' ];
          connectionName = connectionName;
        }
        const service = new UserService();

        return service.updateById(undefined, undefined, {}, {})
          .then(() => fail('service.updateById should rejects an error.'))
          .catch(err => ok(err instanceof PermissionDenied));
      });

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

        await service.updateById(undefined, undefined, { firstName: 'John' }, { firstName: 'Victor' });

        // The suitable user should be updated in the database.
        const user = await getManager(connectionName).findOne(User, user2.id);
        if (!user) { throw new Error(); }
        strictEqual(user.firstName, 'John');

        // The other users should not be updated in the database.
        const userbis = await getManager(connectionName).findOne(User, user1.id);
        if (!userbis) { throw new Error(); }
        strictEqual(userbis.firstName, 'Donald');
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return service.updateById(undefined, undefined, { firstName: 'Adele' }, { firstName: 'Jack' })
          .then(() => fail('The promise should be rejected.'))
          .catch(err => ok(err instanceof ObjectDoesNotExist));
      });

    });

    describe('when deleteById is called', () => {

      it('should throw a PermissionDenied if service.allowedOperations does not include "deleteById".', () => {
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'create', 'findById', 'find', 'modifyById', 'updateById'/*, 'deleteById'*/ ];
          connectionName = connectionName;
        }
        const service = new UserService();

        return service.deleteById(undefined, undefined, {})
          .then(() => fail('service.deleteById should rejects an error.'))
          .catch(err => ok(err instanceof PermissionDenied));
      });

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

        await service.deleteById(undefined, user2.id, {});

        const users = await getManager(connectionName).find(User);

        ok(Array.isArray(users));
        strictEqual(users.length, 1);

        strictEqual(users[0].firstName, user1.firstName);
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return service.deleteById(undefined, 1, {})
          .then(() => fail('The promise should be rejected.'))
          .catch(err => ok(err instanceof ObjectDoesNotExist));
      });

    });

  });

}

describe('EntityResourceCollection', () => {

  testSuite('mysql', 'mysql-connection');
  testSuite('mariadb', 'mariadb-connection');
  // We'll need to wait for this issue to be fixed before supporting both postgres and sqlite:
  // https://github.com/typeorm/typeorm/issues/1308
  // testSuite('sqlite', 'sqlite-connection');
  // testSuite('postgres', 'postgres-connection');

});
