import { expect } from 'chai';

import { Context, MethodPrimitiveBinding } from '../../interfaces';
import { ViewBinder } from './view.binder';
import { ViewService } from './view.interface';

describe('ViewBinder', () => {

  class MyViewBinder extends ViewBinder {
    // Make the method public for testing.
    public bind(service: ViewService): MethodPrimitiveBinding[] {
      return super.bind(service);
    }
  }
  let view: MyViewBinder;
  let mock: ViewService;

  before(() => {
    view = new MyViewBinder();
    mock = {
      render: (locals: { name: string }): string => {
        return locals.name;
      }
    };
  });

  describe('when bind(service: ViewService): MethodPrimitiveBinding[] is called with the mock service', () => {

    it('should return the proper MethodPrimitiveBinding array.', () => {
      const actual = view.bind(mock);
      expect(actual).to.be.an('array').and.to.have.lengthOf(1);

      const actualItem = actual[0];
      const ctx = { state: {} } as Context;
      ctx.state.name = 'foo';
      expect(actualItem.controllerMethodBinder(ctx)).to.equal('foo');
      expect(actualItem.controllerMethodName).to.equal('render');
      expect(actualItem.httpMethod).to.equal('GET');
      expect(actualItem.path).to.equal('/');
      expect(actualItem.successStatus).to.equal(200);
    });

  });

});
