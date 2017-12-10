import { Context, Injector, PreMiddleware, UnauthorizedError } from '@foal/core';
import { expect } from 'chai';

import { makeRestrictAccessToAuthenticatedMiddleware } from './restrict-access-to-authenticated.pre-hook';

describe('makeRestrictAccessToAuthenticatedMiddleware', () => {

  let middleware: PreMiddleware;
  let emptyContext: Context;

  before(() => {
    middleware = makeRestrictAccessToAuthenticatedMiddleware();
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

    it('does not throw any errors if the user is authenticated.', () => {
      const expected = () => middleware({
        ...emptyContext,
        user: {}
      }, new Injector());
      expect(expected).not.to.throw();
    });

  });

});
