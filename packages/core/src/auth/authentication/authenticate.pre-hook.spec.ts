import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Column, createConnection, Entity, getConnection, getManager } from 'typeorm';

import {
  Context,
  getHookFunction,
  ServiceManager,
} from '../../core';
import { AbstractUser, Group, Permission } from '../entities';
import { authenticate } from './authenticate.pre-hook';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('authenticate', () => {

  @Entity()
  class User extends AbstractUser {
    @Column()
    // @ts-ignore : Property 'email' has no initializer and is not definitely assigned in theconstructor.
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
    const preHook = getHookFunction(authenticate(User));
    const ctx = new Context({});

    return expect(preHook(ctx, new ServiceManager()))
      .to.be.rejectedWith('authenticate pre-hook requires session management.');
  });

  it('should not throw an Error if the session does not have an `authentication.userId` property.', async () => {
    const preHook = getHookFunction(authenticate(User));
    const ctx = new Context({});

    ctx.request.session = {};
    await preHook(ctx, new ServiceManager());

    ctx.request.session.authentication = {};
    await preHook(ctx, new ServiceManager());
  });

  it('should set ctx.user to undefined if no user is found in the database matching the given id.', async () => {
    const hook = getHookFunction(authenticate(User));
    const ctx = new Context({});

    ctx.request.session = {
      authentication: {
        userId: 2
      }
    };
    await hook(ctx, new ServiceManager());

    expect(ctx.user).to.equal(undefined);
  });

  it('should add a user property (with all its groups and permissions) if a user matches'
      + ' the given id in the database.', async () => {
    const hook = getHookFunction(authenticate(User));
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
    expect(ctx.user.id).to.equal(1);
    expect((ctx.user as User).email).to.equal('john@foalts.org');

    expect(ctx.user.userPermissions).to.be.an('array').and.to.have.lengthOf(1);
    expect(ctx.user.userPermissions[0].codeName).to.equal('permission2');

    expect(ctx.user.groups).to.be.an('array').and.to.have.lengthOf(1);
    expect(ctx.user.groups[0].name).to.equal('group1');

    expect(ctx.user.groups[0].permissions).to.be.an('array').and.to.have.lengthOf(1);
    expect(ctx.user.groups[0].permissions[0].codeName).to.equal('permission1');
  });

});
