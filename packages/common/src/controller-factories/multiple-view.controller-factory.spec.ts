import { createEmptyContext } from '@foal/core';
import { expect } from 'chai';

import { MultipleViewService } from '../services/multiple-view-service.interface';
import { multipleView, MultipleViewFactory } from './multiple-view.controller-factory';

describe('multipleView', () => {

  let mock: MultipleViewService;

  before(() => {
    mock = {
      names: () => [ 'view1', 'view2' ],
      render: (name: string, locals: { name: string }): string => {
        return `${name} ${locals.name}`;
      },
    };
  });

  it('should be an instance of MultipleViewFactory', () => {
    expect(multipleView).to.an.instanceOf(MultipleViewFactory);
  });

  describe('when getRoutes(service: MultipleViewService): Route[] is called with the mock service', () => {

    it('should return the proper Route array.', () => {
      const actual = multipleView.getRoutes(mock);
      expect(actual).to.be.an('array').and.to.have.lengthOf(2);

      let actualItem = actual[0];
      let ctx = createEmptyContext();
      ctx.state.name = 'foo';
      expect(actualItem.middleware(ctx)).to.equal('view1 foo');
      expect(actualItem.serviceMethodName).to.equal('render');
      expect(actualItem.httpMethod).to.equal('GET');
      expect(actualItem.path).to.equal('/view1');
      expect(actualItem.successStatus).to.equal(200);

      actualItem = actual[1];
      ctx = createEmptyContext();
      ctx.state.name = 'foo';
      expect(actualItem.middleware(ctx)).to.equal('view2 foo');
      expect(actualItem.serviceMethodName).to.equal('render');
      expect(actualItem.httpMethod).to.equal('GET');
      expect(actualItem.path).to.equal('/view2');
      expect(actualItem.successStatus).to.equal(200);
    });

  });

});
