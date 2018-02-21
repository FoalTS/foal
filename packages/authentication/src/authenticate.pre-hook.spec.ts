import { ModelService } from '@foal/common';
import {
  createEmptyContext,
  getPreMiddleware,
  NotFoundError,
  ObjectType,
  Service,
  ServiceManager,
} from '@foal/core';
import { expect } from 'chai';

import { authenticate } from './authenticate.pre-hook';

describe('authenticate', () => {

  @Service()
  class UserModelService implements ModelService<any, ObjectType, ObjectType, any> {
    
    constructor() {}

    public createOne(): any {}
    public createMany(): any {}

    public findById(id): any {
      if (id === 1) {
        return {
          email: 'john@foalts.org',
          id: 1,
          password: 'strongPassword',
          username: 'John',
        };
      }
      throw new NotFoundError();
    }
    public findOne() {}
    public findAll(): any {}

    public findByIdAndUpdate(): any {}
    public findOneAndUpdate(): any {}
    public updateMany(): void {}

    public findByIdAndReplace(): any {}
    public findOneAndReplace(): any {}

    public findByIdAndRemove(): any {}
    public findOneAndRemove(): any {}

    public removeMany(): void {}
  }

  it('should throw an Error if there is no session.', async () => {
    const middleware = getPreMiddleware(authenticate(UserModelService));
    const ctx = createEmptyContext();
    
    try {
      await middleware(ctx, new ServiceManager());
      throw new Error('No error was thrown by the middleware');
    } catch (err) {
      expect(err).to.be.instanceOf(Error).with.property(
        'message',
        'authenticate pre-hook requires session management.'
      );
    }
  });

  it('should not throw an Error if the session does not have an `authentication.userId` property.', async () => {
    const middleware = getPreMiddleware(authenticate(UserModelService));
    const ctx = createEmptyContext();

    ctx.session = {};
    await middleware(ctx, new ServiceManager());

    ctx.session.authentication = {};
    await middleware(ctx, new ServiceManager());
  });

  it('should not throw an Error if no user is found in the database matching the given id.', async () => {
    const middleware = getPreMiddleware(authenticate(UserModelService));
    const ctx = createEmptyContext();

    ctx.session = {
      authentication: {
        userId: 2
      }
    };
    await middleware(ctx, new ServiceManager());
  });

  it('should add a user property if a user matches the given id in the database.', async () => {
    const middleware = getPreMiddleware(authenticate(UserModelService));
    const ctx = createEmptyContext();

    ctx.session = {
      authentication: {
        userId: 1
      }
    };
    await middleware(ctx, new ServiceManager());

    expect(ctx.user).to.deep.equal({
      email: 'john@foalts.org',
      id: 1,
      password: 'strongPassword',
      username: 'John',
    });
  });

});
