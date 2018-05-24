import {
  createEmptyContext,
  HttpResponseNoContent,
  HttpResponseRedirect,
  ServiceManager
} from '@foal/core';
import { expect } from 'chai';

import { logout } from './logout.controller-factory';

describe('logout', () => {

  describe('when it is called', () => {

    describe('should return a controller with a proper `main` route that', () => {

      it('should handle requests at GET / if options.httpMethod is undefined.', () => {
        const route = logout('/foobar').getRoute('main');

        expect(route.httpMethod).to.equal('GET');
        expect(route.path).to.equal('/foobar');
      });

      it('should handle requests at GET / if options.httpMethod equals "GET".', () => {
        const route = logout('/foobar', {
          httpMethod: 'GET'
        }).getRoute('main');

        expect(route.httpMethod).to.equal('GET');
        expect(route.path).to.equal('/foobar');
      });

      it('should handle requests at POST / if options.httpMethod equals "POST".', () => {
        const route = logout('/foobar', {
          httpMethod: 'POST'
        }).getRoute('main');

        expect(route.httpMethod).to.equal('POST');
        expect(route.path).to.equal('/foobar');
      });

      it('should delete ctx.session.authentication if it exists.', async () => {
        const route = logout('/').getRoute('main');

        const ctx = createEmptyContext();
        ctx.session = {
          authentication: {
            userId: 1
          }
        };

        await route.handler(ctx, new ServiceManager());

        expect(ctx.session).to.deep.equal({});
      });

      it('should not throw an error if ctx.session.authentication is undefined.', async () => {
        const route = logout('/').getRoute('main');

        const ctx = createEmptyContext();
        ctx.session = {};

        await route.handler(ctx, new ServiceManager());
      });

      it('should return an HttpResponseNoContent if options.redirect is undefined.', async () => {
        const route = logout('/').getRoute('main');

        const ctx = createEmptyContext();
        ctx.session = {};

        const result = await route.handler(ctx, new ServiceManager());

        expect(result).to.be.an.instanceOf(HttpResponseNoContent);
      });

      it('should return an HttpResponseRedirect if options.redirect is not empty.', async () => {
        const route = logout('/', {
          redirect: '/foo'
        }).getRoute('main');

        const ctx = createEmptyContext();
        ctx.session = {};

        const result = await route.handler(ctx, new ServiceManager());

        expect(result).to.be.an.instanceOf(HttpResponseRedirect);
        expect((result as HttpResponseRedirect).path).to.equal('/foo');
      });

    });

  });

});
