// std
import { deepStrictEqual, fail, notStrictEqual, ok, strictEqual } from 'assert';

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
import { AbstractUser } from '../../auth';
import { ObjectDoesNotExist, PermissionDenied } from '../errors';
import { EntityResourceCollection, middleware, Middleware } from './entity-resource-collection.service';

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

describe('middleware', () => {

  it('should return an object with a property, which value is the given middleware,'
      + ' for each given operation.', () => {
    const ware = () => {};

    const actual1 = middleware('findById', ware);
    deepStrictEqual(actual1, { findById: ware });

    const actual2 = middleware('create|updateById', ware);
    deepStrictEqual(actual2, { create: ware, updateById: ware });
  });

  it('should understand that "*" means "all operations".', () => {
    const ware = () => {};

    const actual = middleware('*', ware);
    deepStrictEqual(actual, {
      create: ware,
      deleteById: ware,
      find: ware,
      findById: ware,
      modifyById: ware,
      updateById: ware,
    });
  });

  it('should throw an Error if a given operation is invalid.', done => {
    const ware = () => {};

    try {
      const actual = middleware('foo', ware);
      done('middleware should throw an Error');
    } catch (err) {
      strictEqual(
        err.message,
        '"foo" is not a valid operation name.'
          + ' Allowed values are: *|create|find|findById|updateById|modifyById|deleteById'
      );
      done();
    }
  });
});

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

      it('should execute the "create" middlewares in the right order.', async () => {
        let str = '';
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          await Promise.resolve();
          str += 'a';
        };
        const middleware2: Middleware = async ({ user, resource, data, params }) => {};
        const middleware3: Middleware = async ({ user, resource, data, params }) => {
          str += 'b';
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'create' ];
          connectionName = connectionName;
          middlewares = [
            middleware('create', middleware1),
            middleware('find', middleware2),
            middleware('create', middleware3),
          ];
        }
        const service = new UserService();

        await service.create({} as AbstractUser, {
          firstName: 'Victor',
          lastName: 'Hugo',
        }, {});

        strictEqual(str, 'ab');
      });

      it('should call the "create" middlewares with the correct parameters.', async () => {
        let middlewareUser;
        let middlewareResource;
        let middlewareData;
        let middlewareParams;
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          middlewareUser = user;
          middlewareResource = resource;
          middlewareData = data;
          middlewareParams = params;
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'create' ];
          connectionName = connectionName;
          middlewares = [
            middleware('create', middleware1),
          ];
        }
        const service = new UserService();

        const user = {} as AbstractUser;
        const data = {
          firstName: 'Victor',
          lastName: 'Hugo',
        };
        const params = {};

        await service.create(user, data, params);

        strictEqual(middlewareUser, user, 'The middleware should be called with the user.');
        strictEqual(middlewareResource, undefined, 'The middleware should be called with undefined as resource.');
        strictEqual(middlewareData, data, 'The middleware should be called with the "data".');
        strictEqual(middlewareParams, params, 'The middleware should be called with the params.');
      });

      describe('with an object as data', () => {

        it('should create one user into the database.', async () => {
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

        it('should return a full representation of the created resource if params.fields is undefined.', async () => {
          const user = await service.create(undefined, {
            firstName: 'Donald',
            lastName: 'Smith'
          }, {}) as User;

          strictEqual(user.firstName, 'Donald');
          strictEqual(user.lastName, 'Smith');
          strictEqual(user.isAdmin, false);
          notStrictEqual(user.id, undefined);
        });

        it('should return a partial representation of the created resource if params.fields is defined.', async () => {
          const user = await service.create(undefined, {
            firstName: 'Donald',
            lastName: 'Smith'
          }, { fields: [ 'firstName', 'id' ]}) as User;

          strictEqual(user.firstName, 'Donald');
          strictEqual(user.lastName, undefined);
          strictEqual(user.isAdmin, undefined);
          notStrictEqual(user.id, undefined);
        });

      });

      describe('with an array as data', () => {

        it('should create several users into the database.', async () => {
          await service.create(undefined, [
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
        });

        it('should return a full representation of the created resource if params.fields is undefined.', async () => {
          const users = await service.create(undefined, [
            {
              firstName: 'Donald',
              lastName: 'Smith'
            },
            {
              firstName: 'Victor',
              isAdmin: true,
              lastName: 'Hugo',
            }
          ], {}) as User[];

          strictEqual(users[0].firstName, 'Donald');
          notStrictEqual(users[0].id, undefined);
          strictEqual(users[0].isAdmin, false);
          strictEqual(users[0].lastName, 'Smith');

          strictEqual(users[1].firstName, 'Victor');
          notStrictEqual(users[1].id, undefined);
          strictEqual(users[1].isAdmin, true);
          strictEqual(users[1].lastName, 'Hugo');
        });

        it('should return a partial representation of the created resources'
            + ' if params.fields is defined.', async () => {
          const users = await service.create(undefined, [
            {
              firstName: 'Donald',
              lastName: 'Smith'
            },
            {
              firstName: 'Victor',
              isAdmin: true,
              lastName: 'Hugo',
            }
          ], { fields: [ 'firstName', 'id' ]}) as User[];

          strictEqual(users[0].firstName, 'Donald');
          notStrictEqual(users[0].id, undefined);
          strictEqual(users[0].isAdmin, undefined);
          strictEqual(users[0].lastName, undefined);

          strictEqual(users[1].firstName, 'Victor');
          notStrictEqual(users[1].id, undefined);
          strictEqual(users[1].isAdmin, undefined);
          strictEqual(users[1].lastName, undefined);
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

      it('should execute the "findById" middlewares in the right order.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let str = '';
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          await Promise.resolve();
          str += 'a';
        };
        const middleware2: Middleware = async ({ user, resource, data, params }) => {};
        const middleware3: Middleware = async ({ user, resource, data, params }) => {
          str += 'b';
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'findById' ];
          connectionName = connectionName;
          middlewares = [
            middleware('findById', middleware1),
            middleware('create', middleware2),
            middleware('findById', middleware3),
          ];
        }
        const service = new UserService();

        await service.findById({} as AbstractUser, user1.id, {});

        strictEqual(str, 'ab');
      });

      it('should call the "findById" middlewares with the correct parameters.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let middlewareUser;
        let middlewareResource;
        let middlewareData;
        let middlewareParams;
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          middlewareUser = user;
          middlewareResource = resource;
          middlewareData = data;
          middlewareParams = params;
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'findById' ];
          connectionName = connectionName;
          middlewares = [
            middleware('findById', middleware1),
          ];
        }
        const service = new UserService();

        const user = {} as AbstractUser;
        const params = {};

        await service.findById(user, user1.id, params);

        strictEqual(middlewareUser, user, 'The middleware should be called with the user.');
        ok(middlewareResource instanceof User, 'The middleware should be called with the resource.');
        strictEqual(middlewareData, undefined, 'The middleware should be called with undefined as "data".');
        strictEqual(middlewareParams, params, 'The middleware should be called with the params.');
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

        return service.find(undefined, {})
          .then(() => fail('service.find should rejects an error.'))
          .catch(err => ok(err instanceof PermissionDenied));
      });

      it('should execute the "find" middlewares in the right order.', async () => {
        let str = '';
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          await Promise.resolve();
          str += 'a';
        };
        const middleware2: Middleware = async ({ user, resource, data, params }) => {};
        const middleware3: Middleware = async ({ user, resource, data, params }) => {
          str += 'b';
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'find' ];
          connectionName = connectionName;
          middlewares = [
            middleware('find', middleware1),
            middleware('create', middleware2),
            middleware('find', middleware3),
          ];
        }
        const service = new UserService();

        await service.find({} as AbstractUser, {});

        strictEqual(str, 'ab');
      });

      it('should call the "find" middlewares with the correct parameters.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let middlewareUser;
        let middlewareResource;
        let middlewareData;
        let middlewareParams;
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          middlewareUser = user;
          middlewareResource = resource;
          middlewareData = data;
          middlewareParams = params;
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'find' ];
          connectionName = connectionName;
          middlewares = [
            middleware('find', middleware1),
          ];
        }
        const service = new UserService();

        const user = {} as AbstractUser;
        const params = {};

        await service.find(user, params);

        strictEqual(middlewareUser, user, 'The middleware should be called with the user.');
        strictEqual(middlewareResource, undefined, 'The middleware should be called with undefined as resource.');
        strictEqual(middlewareData, undefined, 'The middleware should be called with undefined as "data".');
        strictEqual(middlewareParams, params, 'The middleware should be called with the params.');
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
        let result = await service.find(undefined, {});
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

      it('should execute the "modifyById" middlewares in the right order.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let str = '';
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          await Promise.resolve();
          str += 'a';
        };
        const middleware2: Middleware = async ({ user, resource, data, params }) => {};
        const middleware3: Middleware = async ({ user, resource, data, params }) => {
          str += 'b';
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'modifyById' ];
          connectionName = connectionName;
          middlewares = [
            middleware('modifyById', middleware1),
            middleware('create', middleware2),
            middleware('modifyById', middleware3),
          ];
        }
        const service = new UserService();

        await service.modifyById({} as AbstractUser, user1.id, {
          isAdmin: false
        }, {});

        strictEqual(str, 'ab');
      });

      it('should call the "modifyById" middlewares with the correct parameters.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let middlewareUser;
        let middlewareResource;
        let middlewareData;
        let middlewareParams;
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          middlewareUser = user;
          middlewareResource = resource;
          middlewareData = data;
          middlewareParams = params;
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'modifyById' ];
          connectionName = connectionName;
          middlewares = [
            middleware('modifyById', middleware1),
          ];
        }
        const service = new UserService();

        const user = {} as AbstractUser;
        const data = {
          isAdmin: false
        };
        const params = {};

        await service.modifyById(user, user1.id, data, params);

        strictEqual(middlewareUser, user, 'The middleware should be called with the user.');
        ok(middlewareResource instanceof User, 'The middleware should be called with the resource.');
        strictEqual(middlewareData, data, 'The middleware should be called with the data.');
        strictEqual(middlewareParams, params, 'The middleware should be called with the params.');
      });

      it('should update the suitable user and then return its new version.', async () => {
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

        const result = await service.modifyById(undefined, user2.id, { firstName: 'John' }, {});

        // The suitable user should be updated in the database.
        const user = await getManager(connectionName).findOne(User, user2.id);
        if (!user) { throw new Error(); }
        strictEqual(user.firstName, 'John');

        // The other users should not be updated in the database.
        const userbis = await getManager(connectionName).findOne(User, user1.id);
        if (!userbis) { throw new Error(); }
        strictEqual(userbis.firstName, 'Donald');

        // The value returned by the method should be the updated user.
        strictEqual((result as any).id, user2.id);
        strictEqual((result as any).firstName, 'John');
        strictEqual((result as any).isAdmin, true);
        strictEqual((result as any).lastName, 'Hugo');
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return service.modifyById(undefined, 3, { firstName: 'Adele' }, {})
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

      it('should execute the "updateById" middlewares in the right order.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let str = '';
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          await Promise.resolve();
          str += 'a';
        };
        const middleware2: Middleware = async ({ user, resource, data, params }) => {};
        const middleware3: Middleware = async ({ user, resource, data, params }) => {
          str += 'b';
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'updateById' ];
          connectionName = connectionName;
          middlewares = [
            middleware('updateById', middleware1),
            middleware('create', middleware2),
            middleware('updateById', middleware3),
          ];
        }
        const service = new UserService();

        await service.updateById({} as AbstractUser, user1.id, {
          isAdmin: false
        }, {});

        strictEqual(str, 'ab');
      });

      it('should call the "updateById" middlewares with the correct parameters.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let middlewareUser;
        let middlewareResource;
        let middlewareData;
        let middlewareParams;
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          middlewareUser = user;
          middlewareResource = resource;
          middlewareData = data;
          middlewareParams = params;
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'updateById' ];
          connectionName = connectionName;
          middlewares = [
            middleware('updateById', middleware1),
          ];
        }
        const service = new UserService();

        const user = {} as AbstractUser;
        const data = {
          isAdmin: false
        };
        const params = {};

        await service.updateById(user, user1.id, data, params);

        strictEqual(middlewareUser, user, 'The middleware should be called with the user.');
        ok(middlewareResource instanceof User, 'The middleware should be called with the resource.');
        strictEqual(middlewareData, data, 'The middleware should be called with the data.');
        strictEqual(middlewareParams, params, 'The middleware should be called with the params.');
      });

      it('should update the suitable user and then return its new version.', async () => {
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

        const result = await service.updateById(undefined, user2.id, { firstName: 'John' }, {});

        // The suitable user should be updated in the database.
        const user = await getManager(connectionName).findOne(User, user2.id);
        if (!user) { throw new Error(); }
        strictEqual(user.firstName, 'John');

        // The other users should not be updated in the database.
        const userbis = await getManager(connectionName).findOne(User, user1.id);
        if (!userbis) { throw new Error(); }
        strictEqual(userbis.firstName, 'Donald');

        // The value returned by the method should be the updated user.
        strictEqual((result as any).id, user2.id);
        strictEqual((result as any).firstName, 'John');
        strictEqual((result as any).isAdmin, true);
        strictEqual((result as any).lastName, 'Hugo');
      });

      it('should throw a ObjectDoesNotExist if no suitable user exists in the database.', () => {
        return service.updateById(undefined, 3, { firstName: 'Adele' }, {})
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

      it('should execute the "deleteById" middlewares in the right order.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let str = '';
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          await Promise.resolve();
          str += 'a';
        };
        const middleware2: Middleware = async ({ user, resource, data, params }) => {};
        const middleware3: Middleware = async ({ user, resource, data, params }) => {
          str += 'b';
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'deleteById' ];
          connectionName = connectionName;
          middlewares = [
            middleware('deleteById', middleware1),
            middleware('create', middleware2),
            middleware('deleteById', middleware3),
          ];
        }
        const service = new UserService();

        await service.deleteById({} as AbstractUser, user1.id, {});

        strictEqual(str, 'ab');
      });

      it('should call the "deleteById" middlewares with the correct parameters.', async () => {
        const user1 = getManager(connectionName).create(User, {
          firstName: 'Donald',
          lastName: 'Smith'
        });

        await getManager(connectionName).save([ user1 ]);

        let middlewareUser;
        let middlewareResource;
        let middlewareData;
        let middlewareParams;
        const middleware1: Middleware = async ({ user, resource, data, params }) => {
          middlewareUser = user;
          middlewareResource = resource;
          middlewareData = data;
          middlewareParams = params;
        };
        class UserService extends EntityResourceCollection {
          entityClass = User;
          allowedOperations: EntityResourceCollection['allowedOperations']
            = [ 'deleteById' ];
          connectionName = connectionName;
          middlewares = [
            middleware('deleteById', middleware1),
          ];
        }
        const service = new UserService();

        const user = {} as AbstractUser;
        const params = {};

        await service.deleteById(user, user1.id, params);

        strictEqual(middlewareUser, user, 'The middleware should be called with the user.');
        ok(middlewareResource instanceof User, 'The middleware should be called with the resource.');
        strictEqual(middlewareData, undefined, 'The middleware should be called with undefined as "data".');
        strictEqual(middlewareParams, params, 'The middleware should be called with the params.');
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
  testSuite('sqlite', 'sqlite-connection');
  testSuite('postgres', 'postgres-connection');

});
