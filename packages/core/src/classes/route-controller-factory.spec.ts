import { expect } from 'chai';

import { Route } from '../interfaces';
import { route, RouteControllerFactory } from './route-controller-factory';

describe('route', () => {

  it('should be an instance of RouteControllerFactory', () => {
    expect(route).to.be.an.instanceOf(RouteControllerFactory);
  });

  describe('when attachHandler is called', () => {

    it('should return a controller with one "main" route matching the given parameters.', () => {
      const handler = () => {};
      const controller = route.attachHandler('POST', '/foo', handler);

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
