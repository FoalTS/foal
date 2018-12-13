// std
import { fail, notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import { Column, createConnection, Entity, getConnection, getManager } from 'typeorm';

// FoalTS
import {
  Context,
  getHookFunction,
  HookFunction,
  HttpResponseRedirect,
  isHttpResponseRedirect,
  isHttpResponseUnauthorized,
  ServiceManager,
} from '../core';
import { AbstractUser, Group, Permission } from './entities';
import { LoginRequired } from './login-required.hook';

describe('LoginRequired', () => {
    // Optional : should return undefined and assign undefined to ctx.user;
  let hook: HookFunction;

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

  beforeEach(() => {
    hook = getHookFunction(LoginRequired({ userEntity: User }));
  });

  it('should throw an Error if there is no session.', () => {
    const ctx = new Context({});

    return (hook(ctx, new ServiceManager()) as Promise<any>)
      .then(() => fail('The promise should be rejected'))
      .catch(err => strictEqual(err.message, 'LoginRequired hook requires session management.'));
  });

  it('should return an HttpResponseUnauthorized object if the session does not have an '
      + '`authentication.userId` property.', async () => {
    let ctx = new Context({ session: {} });
    let response = await hook(ctx, new ServiceManager());

    ok(isHttpResponseUnauthorized(response), 'The response should be an instance of HttpResponseUnauthorized');

    ctx = new Context({ session: { authentication: {} } });
    response = await hook(ctx, new ServiceManager());

    ok(isHttpResponseUnauthorized(response), 'The response should be an instance of HttpResponseUnauthorized');
  });

  it('should return an HttpResponseRedirect object if the session does not have an '
      + '`authentication.userId` property and if options.redirect is defined.', async () => {
    hook = getHookFunction(LoginRequired({ redirect: '/foo', userEntity: User }));

    let ctx = new Context({ session: {} });
    let response = await hook(ctx, new ServiceManager());

    ok(isHttpResponseRedirect(response), 'The response should be an instance of HttpResponseRedirect');
    strictEqual((response as HttpResponseRedirect).path, '/foo');

    ctx = new Context({ session: { authentication: {} } });
    response = await hook(ctx, new ServiceManager());

    ok(isHttpResponseRedirect(response), 'The response should be an instance of HttpResponseRedirect');
    strictEqual((response as HttpResponseRedirect).path, '/foo');
  });

  it('should return an HttpResponseUnauthorized object if no user matches the given userId.', async () => {
    const ctx = new Context({
      session: {
        authentication: {
          userId: 2
        }
      }
    });
    const response = await hook(ctx, new ServiceManager());

    ok(isHttpResponseUnauthorized(response), 'The response should be an instance of HttpResponseUnauthorized');
  });

  it('should return an HttpResponseRedirect object if no user matches the given userId'
      + ' and if options.redirect is defined.', async () => {
    hook = getHookFunction(LoginRequired({ redirect: '/foo', userEntity: User }));

    const ctx = new Context({
      session: {
        authentication: {
          userId: 2
        }
      }
    });
    const response = await hook(ctx, new ServiceManager());

    ok(isHttpResponseRedirect(response), 'The response should be an instance of HttpResponseRedirect');
    strictEqual((response as HttpResponseRedirect).path, '/foo');
  });

  it('should return undefined and set ctx.user if a user matches the given id.', async () => {
    const ctx = new Context({
      session: {
        authentication: {
          userId: 1
        }
      }
    });
    const response = await hook(ctx, new ServiceManager());

    strictEqual(response, undefined);
    notStrictEqual(ctx.user, undefined);
    strictEqual((ctx.user as User).id, 1);
  });

  it('should add a user property (with all its groups and permissions) if a user matches'
      + ' the given id in the database.', async () => {
    // TODO: Move this test somewhere else.
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
