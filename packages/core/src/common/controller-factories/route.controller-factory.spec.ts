import { Route } from '@foal/core';
import { expect } from 'chai';

import { route } from './route.controller-factory';

describe('route', () => {

  describe('when it is called', () => {

    it('should return a controller with one "main" route matching the given parameters.', () => {
      const handler = () => {};
      const controller = route('POST', '/foo', handler);

      const expected: Route = {
        handler,
        httpMethod: 'POST',
        path: '/foo',
        postHooks: [],
        preHooks: []
      };
      expect(controller.getRoute('main')).to.deep.equal(expected);
    });

  });

});
