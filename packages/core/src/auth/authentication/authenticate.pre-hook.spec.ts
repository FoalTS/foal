import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Column, Connection, createConnection, Entity, getManager } from 'typeorm';

import {
  Context,
  Service,
  ServiceManager,
} from '../../core';
import { AbstractUser } from '../models';
import { authenticate } from './authenticate.pre-hook';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('authenticate', () => {

  @Entity()
  class User extends AbstractUser {
    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;
  }

  let connection: Connection;

  beforeEach(async () => {
    connection = await createConnection({
      database: 'test',
      dropSchema: true,
      entities: [ User ],
      password: 'test',
      synchronize: true,
      type: 'mysql',
      username: 'test',
    });
  });

  afterEach(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    const user = getManager().create(User, {
      email: 'john@foalts.org',
      id: 1,
      password: 'strongPassword',
      roles: [],
      username: 'John',
    });
    await user.save();
  });

  it('should throw an Error if there is no session.', () => {
    const preHook = authenticate(User);
    const ctx = new Context();

    return expect(preHook(ctx, new ServiceManager()))
      .to.be.rejectedWith('authenticate pre-hook requires session management.');
  });

  it('should not throw an Error if the session does not have an `authentication.userId` property.', async () => {
    const preHook = authenticate(User);
    const ctx = new Context();

    ctx.session = {};
    await preHook(ctx, new ServiceManager());

    ctx.session.authentication = {};
    await preHook(ctx, new ServiceManager());
  });

  it('should set ctx.user to undefined if no user is found in the database matching the given id.', async () => {
    const hook = authenticate(User);
    const ctx = new Context();

    ctx.session = {
      authentication: {
        userId: 2
      }
    };
    await hook(ctx, new ServiceManager());

    expect(ctx.user).to.equal(undefined);
  });

  it('should add a user property if a user matches the given id in the database.', async () => {
    const hook = authenticate(User);
    const ctx = new Context();

    ctx.session = {
      authentication: {
        userId: 1
      }
    };
    await hook(ctx, new ServiceManager());

    expect(ctx.user).to.deep.include({
      email: 'john@foalts.org',
      id: 1,
      password: 'strongPassword',
      roles: [],
      username: 'John',
    });
  });

});
