import { Context, getPreMiddleware, MethodNotAllowedError, ServiceManager } from '@foal/core';
import { expect } from 'chai';

import { methodNotAllowed } from './method-not-allowed.pre-hook';

describe('methodNotAllowed', () => {

  it('should throw an MethodNotAllowedError.', () => {
    const middleware = getPreMiddleware(methodNotAllowed());
    expect(() => middleware({} as Context, new ServiceManager())).to.throw(MethodNotAllowedError);
  });

});
