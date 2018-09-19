// std
import { fail, ok, strictEqual } from 'assert';

// 3p
import { Column, createConnection, Entity, getConnection, getManager } from 'typeorm';

// FoalTS
import {
  Context,
  getHookFunction,
  ServiceManager,
} from '../../core';
import { AbstractUser, Group, Permission } from '../entities';
import { Authenticate } from './authenticate.hook';

describe('Authenticate', () => {

  @Entity()
  class User extends AbstractUser {
    @Column()
    email: string;
  }

  beforeEach(() => createConnection({
    database: 'test',
    dropSchema: true,
    entities: [ User, Group, Permission ],
    password: 'test',
    synchronize: true,
    type: 'mysql',
    username: 'test',
  }));

  beforeEach(async () => {
    const permission1 = new Permission();
    permission1.codeName = 'permission1';
    permission1.name = '';

    const permission2 = new Permission();
    permission2.codeName = 'permission2';
    permission2.name = '';

    const group = new Group();
    group.name = 'group1';
    group.codeName = 'group1';
    group.permissions = [ permission1 ];

    const user = new User();
    user.email = 'john@foalts.org';
    user.id = 1;
    user.groups = [ group ];
    user.userPermissions = [ permission2 ];

    return getManager().save([ permission1, permission2, group, user ]);
  });

  afterEach(() => getConnection().close());

  it('should throw an Error if there is no session.', () => {
    const preHook = getHookFunction(Authenticate(User));
    const ctx = new Context({});

    return preHook(ctx, new ServiceManager())
      .then(() => fail('The promise should be rejected'))
      .catch(err => strictEqual(err.message, 'Authenticate hook requires session management.'));
  });

  it('should not throw an Error if the session does not have an `authentication.userId` property.', async () => {
    const preHook = getHookFunction(Authenticate(User));
    const ctx = new Context({});

    ctx.request.session = {};
    await preHook(ctx, new ServiceManager());

    ctx.request.session.authentication = {};
    await preHook(ctx, new ServiceManager());
  });

  it('should set ctx.user to undefined if no user is found in the database matching the given id.', async () => {
    const hook = getHookFunction(Authenticate(User));
    const ctx = new Context({});

    ctx.request.session = {
      authentication: {
        userId: 2
      }
    };
    await hook(ctx, new ServiceManager());

    strictEqual(ctx.user, undefined);
  });

  it('should add a user property (with all its groups and permissions) if a user matches'
      + ' the given id in the database.', async () => {
    const hook = getHookFunction(Authenticate(User));
    const ctx = new Context({});

    ctx.request.session = {
      authentication: {
        userId: 1
      }
    };
    await hook(ctx, new ServiceManager());

    if (!ctx.user) {
      throw new Error('ctx.user should be defined');
    }
    strictEqual(ctx.user.id, 1);
    strictEqual((ctx.user as User).email, 'john@foalts.org');

    ok(Array.isArray(ctx.user.userPermissions));
    strictEqual(ctx.user.userPermissions.length, 1);
    strictEqual(ctx.user.userPermissions[0].codeName, 'permission2');

    ok(Array.isArray(ctx.user.groups));
    strictEqual(ctx.user.groups.length, 1);
    strictEqual(ctx.user.groups[0].name, 'group1');

    ok(Array.isArray(ctx.user.groups[0].permissions));
    strictEqual(ctx.user.groups[0].permissions.length, 1);
    strictEqual(ctx.user.groups[0].permissions[0].codeName, 'permission1');
  });

});
