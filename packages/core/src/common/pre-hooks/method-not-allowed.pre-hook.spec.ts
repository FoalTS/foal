import {
  Context,
  HttpResponseMethodNotAllowed,
  ServiceManager
} from '@foal/core';
import { expect } from 'chai';

import { methodNotAllowed } from './method-not-allowed.pre-hook';

describe('methodNotAllowed', () => {

  it('should return an HttpResponseMethodNotAllowed.', () => {
    const hook = methodNotAllowed();
    expect(hook(new Context(), new ServiceManager())).to.be.instanceOf(HttpResponseMethodNotAllowed);
  });

});
