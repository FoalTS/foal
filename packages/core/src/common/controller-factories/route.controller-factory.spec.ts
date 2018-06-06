import { expect } from 'chai';

import { HttpResponseOK, Route } from '../../core';
import { route } from './route.controller-factory';

describe('route', () => {

  describe('when it is called', () => {

    it('should return a controller with one "main" route matching the given parameters.', () => {
      const handler = () => new HttpResponseOK();
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
