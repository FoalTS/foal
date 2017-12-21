import {
  Context,
  Route
} from '@foal/core';
import { expect } from 'chai';

import { ViewService } from '../services';
import { ViewControllerFactory } from './view.controller-factory';

describe('ViewControllerFactory', () => {

  class MyViewControllerFactory extends ViewControllerFactory {
    // Make the method public for testing.
    public getRoutes(service: ViewService): Route[] {
      return super.getRoutes(service);
    }
  }
  let view: MyViewControllerFactory;
  let mock: ViewService;

  before(() => {
    view = new MyViewControllerFactory();
    mock = {
      render: (locals: { name: string }): string => {
        return locals.name;
      }
    };
  });

  describe('when getRoutes(service: ViewService): Route[] is called with the mock service', () => {

    it('should return the proper Route array.', () => {
      const actual = view.getRoutes(mock);
      expect(actual).to.be.an('array').and.to.have.lengthOf(1);

      const actualItem = actual[0];
      const ctx = { state: {} } as Context;
      ctx.state.name = 'foo';
      expect(actualItem.serviceMethodBinder(ctx)).to.equal('foo');
      expect(actualItem.serviceMethodName).to.equal('render');
      expect(actualItem.httpMethod).to.equal('GET');
      expect(actualItem.path).to.equal('/');
      expect(actualItem.successStatus).to.equal(200);
    });

  });

});
