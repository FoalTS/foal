import {
  createEmptyContext,
  getPreMiddleware,
  HttpResponseMethodNotAllowed,
  ServiceManager
} from '@foal/core';
import { expect } from 'chai';

import { methodNotAllowed } from './method-not-allowed.pre-hook';

describe('methodNotAllowed', () => {

  it('should return an HttpResponseMethodNotAllowed.', () => {
    const middleware = getPreMiddleware(methodNotAllowed());
    expect(middleware(createEmptyContext(), new ServiceManager())).to.be.instanceOf(HttpResponseMethodNotAllowed);
  });

});
