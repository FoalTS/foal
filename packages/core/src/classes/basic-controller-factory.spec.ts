import { expect } from 'chai';

import { Route } from '../interfaces';
import { basic, BasicControllerFactory } from './basic-controller-factory';

describe('basic', () => {

  it('should be an instance of BasicControllerFactory', () => {
    expect(basic).to.be.an.instanceOf(BasicControllerFactory);
  });

  describe('when attachHandlingFunction is called', () => {

    it('should return a controller with one "main" route matching the given parameters.', () => {
      const handlingFunction = () => {};
      const { controller } = basic.attachHandlingFunction('POST', '/foo', handlingFunction);

      const expected: Route = {
        handler: handlingFunction,
        httpMethod: 'POST',
        path: '/foo',
        postHooks: [],
        preHooks: []
      };
      expect(controller.getRoute('main')).to.deep.equal(expected);
    });

  });

});
