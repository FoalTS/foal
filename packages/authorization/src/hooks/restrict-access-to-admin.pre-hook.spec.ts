import { Context, ForbiddenError, Injector, PreMiddleware, UnauthorizedError } from '@foal/core';
import { expect } from 'chai';

import { makeRestrictAccessToAdminMiddleware } from './restrict-access-to-admin.pre-hook';

describe('makeRestrictAccessToAdminMiddleware', () => {

  let middleware: PreMiddleware;
  let emptyContext: Context;

  before(() => {
    middleware = makeRestrictAccessToAdminMiddleware();
    emptyContext = {
      body: undefined,
      getHeader: (field: string): string => '',
      params: {},
      query: {},
      result: undefined,
      session: undefined,
      state: {},
      user: undefined
    };
  });

  describe('when it is called should return a middleware that', () => {

    it('throws an UnauthorizedError if the user is not authenticated.', () => {
      const expected = () => middleware({
        ...emptyContext,
        user: undefined
      }, new Injector());
      expect(expected).to.throw(UnauthorizedError);
    });

    it('throws a ForbiddenError if the user is not an admin.', () => {
      const expected = () => middleware({
        ...emptyContext,
        user: {}
      }, new Injector());
      expect(expected).to.throw(ForbiddenError);
      const expected2 = () => middleware({
        ...emptyContext,
        user: { isAdmin: false }
      }, new Injector());
      expect(expected2).to.throw(ForbiddenError);
    });

    it('does not throw any errors if the user is authenticated and is an admin.', () => {
      const expected = () => middleware({
        ...emptyContext,
        user: { isAdmin: true }
      }, new Injector());
      expect(expected).not.to.throw();
    });

  });

});
