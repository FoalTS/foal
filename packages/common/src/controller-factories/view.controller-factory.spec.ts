import {
  createEmptyContext,
  Route
} from '@foal/core';
import { expect } from 'chai';

import { ViewService } from '../services';
import { view, ViewControllerFactory } from './view.controller-factory';

describe('view', () => {

  let mock: ViewService;

  before(() => {
    mock = {
      render: (locals: { name: string }): string => {
        return locals.name;
      }
    };
  });

  it('should be an instance of ViewControllerFactory', () => {
    expect(view).to.an.instanceOf(ViewControllerFactory);
  });

  describe('when getRoutes(service: ViewService): Route[] is called with the mock service', () => {

    it('should return the proper Route array.', () => {
      const actual = view.getRoutes(mock);
      expect(actual).to.be.an('array').and.to.have.lengthOf(1);

      const actualItem = actual[0];
      const ctx = createEmptyContext();
      ctx.state.name = 'foo';
      expect(actualItem.middleware(ctx)).to.equal('foo');
      expect(actualItem.serviceMethodName).to.equal('render');
      expect(actualItem.httpMethod).to.equal('GET');
      expect(actualItem.path).to.equal('/');
      expect(actualItem.successStatus).to.equal(200);
    });

  });

});
