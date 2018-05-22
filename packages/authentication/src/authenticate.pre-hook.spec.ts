import { IModelService, ObjectDoesNotExist } from '@foal/common';
import {
  createEmptyContext,
  Service,
  ServiceManager,
} from '@foal/core';
import { expect } from 'chai';

import { authenticate } from './authenticate.pre-hook';

describe('authenticate', () => {

  @Service()
  class UserModelService implements IModelService<any, object, object, any> {

    constructor() {}

    createOne(): any {}
    createMany(): any {}

    findById(id): any {
      if (id === 1) {
        return {
          email: 'john@foalts.org',
          id: 1,
          password: 'strongPassword',
          username: 'John',
        };
      }
      throw new ObjectDoesNotExist();
    }
    findOne() {}
    findAll(): any {}

    findByIdAndUpdate(): any {}
    findOneAndUpdate(): any {}
    updateMany(): void {}

    findByIdAndReplace(): any {}
    findOneAndReplace(): any {}

    findByIdAndRemove(): any {}
    findOneAndRemove(): any {}

    removeMany(): void {}
  }

  it('should throw an Error if there is no session.', async () => {
    const preHook = authenticate(UserModelService);
    const ctx = createEmptyContext();

    try {
      await preHook(ctx, new ServiceManager());
      throw new Error('No error was thrown by the middleware');
    } catch (err) {
      expect(err).to.be.instanceOf(Error).with.property(
        'message',
        'authenticate pre-hook requires session management.'
      );
    }
  });

  it('should not throw an Error if the session does not have an `authentication.userId` property.', async () => {
    const preHook = authenticate(UserModelService);
    const ctx = createEmptyContext();

    ctx.session = {};
    await preHook(ctx, new ServiceManager());

    ctx.session.authentication = {};
    await preHook(ctx, new ServiceManager());
  });

  it('should set ctx.user to null if no user is found in the database matching the given id.', async () => {
    const hook = authenticate(UserModelService);
    const ctx = createEmptyContext();

    ctx.session = {
      authentication: {
        userId: 2
      }
    };
    await hook(ctx, new ServiceManager());

    expect(ctx.user).to.equal(null);
  });

  it('should add a user property if a user matches the given id in the database.', async () => {
    const hook = authenticate(UserModelService);
    const ctx = createEmptyContext();

    ctx.session = {
      authentication: {
        userId: 1
      }
    };
    await hook(ctx, new ServiceManager());

    expect(ctx.user).to.deep.equal({
      email: 'john@foalts.org',
      id: 1,
      password: 'strongPassword',
      username: 'John',
    });
  });

});
