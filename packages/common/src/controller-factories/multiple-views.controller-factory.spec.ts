import {
  createEmptyContext,
  HttpResponseOK,
  Service,
  ServiceManager
} from '@foal/core';
import { expect } from 'chai';

import { IMultipleViews } from '../services';
import { multipleViews, MultipleViewsFactory } from './multiple-views.controller-factory';

describe('multipleViews', () => {

  @Service()
  class MockService implements IMultipleViews {
    constructor() {}
    public async render(name: string, locals: { name?: string }): Promise<string> {
      return `${name} ${locals.name || 'bar'}`;
    }
  }

  it('should be an instance of MultipleViewsFactory', () => {
    expect(multipleViews).to.an.instanceOf(MultipleViewsFactory);
  });

  describe('when attachService is called', () => {

    it('should return a controller with proper routes.', async () => {
      const { controller } = multipleViews.attachService('/', MockService, {
        views: {
          bar: '/barfoo',
          foo: '/foo',
        }
      });
      const actual = controller.getRoute('foo');

      expect(actual.httpMethod).to.equal('GET');
      expect(actual.path).to.equal('/foo');

      const ctx = createEmptyContext();
      let result = await actual.handler(ctx, new ServiceManager());
      expect(result).to.be.an.instanceOf(HttpResponseOK)
        .with.property('content', 'foo bar');

      ctx.state.locals = { name: 'foobar' };
      result = await actual.handler(ctx, new ServiceManager());
      expect(result).to.be.an.instanceOf(HttpResponseOK)
        .with.property('content', 'foo foobar');

      const actual2 = controller.getRoute('bar');

      expect(actual2.httpMethod).to.equal('GET');
      expect(actual2.path).to.equal('/barfoo');

      const ctx2 = createEmptyContext();
      const result2 = await actual2.handler(ctx2, new ServiceManager());
      expect(result2).to.be.an.instanceOf(HttpResponseOK)
        .with.property('content', 'bar bar');
    });

  });

});
