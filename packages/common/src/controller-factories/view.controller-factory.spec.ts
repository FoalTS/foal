import {
  createEmptyContext,
  HttpResponseOK,
  Service,
  ServiceManager
} from '@foal/core';
import { expect } from 'chai';

import { IView } from '../services';
import { view, ViewControllerFactory } from './view.controller-factory';

describe('view', () => {

  @Service()
  class MockService implements IView {
    constructor() {}
    public async render(locals: { name: string }): Promise<string> {
      return locals.name || 'bar';
    }
  }

  it('should be an instance of ViewControllerFactory.', () => {
    expect(view).to.an.instanceOf(ViewControllerFactory);
  });

  describe('when attachService is called', () => {

    it('should return a controller with a proper "main" route.', async () => {
      const { controller } = view.attachService('/', MockService);
      const actual = controller.getRoute('main');

      expect(actual.httpMethod).to.equal('GET');
      expect(actual.path).to.equal('/');

      const ctx = createEmptyContext();
      let result = await actual.handler(ctx, new ServiceManager());
      expect(result).to.be.an.instanceOf(HttpResponseOK).with.property('content', 'bar');

      ctx.state.locals = { name: 'foo' };
      result = await actual.handler(ctx, new ServiceManager());
      expect(result).to.be.an.instanceOf(HttpResponseOK).with.property('content', 'foo');
    });

  });

});
