import { createEmptyContext, ServiceManager } from '@foal/core';
import { expect } from 'chai';

import { ViewService } from '../services';
import { view, ViewControllerFactory } from './view.controller-factory';

describe('view', () => {

  class MockService implements ViewService {
    async render(locals: { name: string }): Promise<string> {
      return locals.name || 'bar';
    }
  }

  it('should be an instance of ViewControllerFactory.', () => {
    expect(view).to.an.instanceOf(ViewControllerFactory);
  });

  describe('when attachService is called', () => {
  
    it('should return a controller with a proper `default` route.', async () => {
      const controller = view.attachService('/', MockService);
      const actual = controller.getRoute('main');

      expect(actual.httpMethod).to.equal('GET');
      expect(actual.path).to.equal('/');
      
      const ctx = createEmptyContext();
      expect(await actual.middleHook(ctx, new ServiceManager())).to.equal('bar');
      
      ctx.state.locals = { name: 'foo' };
      expect(await actual.middleHook(ctx, new ServiceManager())).to.equal('foo');
    });

  });

});
