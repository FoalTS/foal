import {
  Context,
  getPreMiddleware,
  PreMiddleware,
  ServiceManager,
  UnauthorizedError
} from '@foal/core';
import { expect } from 'chai';

import { restrictAccessToAuthenticated } from './restrict-access-to-authenticated.pre-hook';

describe('restrictAccessToAuthenticated', () => {

  let middleware: PreMiddleware;
  let emptyContext: Context;

  before(() => {
    middleware = getPreMiddleware(restrictAccessToAuthenticated());
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

  it('should throw an UnauthorizedError if the user is not authenticated.', () => {
    const expected = () => middleware({
      ...emptyContext,
      user: undefined
    }, new ServiceManager());
    expect(expected).to.throw(UnauthorizedError);
  });

  it('should not throw any errors if the user is authenticated.', () => {
    const expected = () => middleware({
      ...emptyContext,
      user: {}
    }, new ServiceManager());
    expect(expected).not.to.throw();
  });

});
