import {
  createEmptyContext,
  HttpResponseNoContent,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  Service,
  ServiceManager,
} from '@foal/core';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import { IAuthenticator } from './authenticator.interface';
import { login } from './login.controller-factory';

chai.use(spies);
const expect = chai.expect;

describe('login', () => {

  @Service()
  class MockAuthenticatorService implements IAuthenticator<any> {
    constructor() {}

    authenticate(credentials: { username?: string }) {
      if (credentials.username === 'John') {
        return {
          id: 1,
          username: 'John',
        };
      }
      return null;
    }
  }

  describe('when it is called', () => {

    describe('should return a controller with a proper `main` route that', () => {

      it('should handle requests at POST /.', () => {
        const route = login('/foobar', MockAuthenticatorService).getRoute('main');

        expect(route.httpMethod).to.equal('POST');
        expect(route.path).to.equal('/foobar');
      });

      describe('when the authentication succeeds', () => {

        it('should return an HttpResponseNoContent if options.successRedirect is undefined.', async () => {
          const route = login('/', MockAuthenticatorService).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'John' };

          const response = await route.handler(ctx, new ServiceManager());

          expect(response).to.be.an.instanceOf(HttpResponseNoContent);
        });

        it('should return an HttpResponseRedirect if options.successRedirect is not empty.', async () => {
          const route = login('/', MockAuthenticatorService, {
            successRedirect: '/foo'
          }).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'John' };

          const response = await route.handler(ctx, new ServiceManager());

          expect(response).to.be.an.instanceOf(HttpResponseRedirect);
          expect((response as HttpResponseRedirect).path).to.equal('/foo');
        });

        it('should create or update ctx.session.authentication to include the userId.', async () => {
          const route = login('/', MockAuthenticatorService).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'John' };

          await route.handler(ctx, new ServiceManager());

          expect(ctx.session.authentication).to.deep.equal({
            userId: 1
          });

          ctx.session.authentication.foo = 'bar';

          await route.handler(ctx, new ServiceManager());

          expect(ctx.session.authentication).to.deep.equal({
            foo: 'bar',
            userId: 1
          });
        });

      });

      describe('when the authentication fails', () => {

        it('should return an HttpResponseUnauthorized if options.failureRedirect is undefined.', async () => {
          const route = login('/', MockAuthenticatorService).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'Jack' };

          const response = await route.handler(ctx, new ServiceManager());

          expect(response).to.be.an.instanceOf(HttpResponseUnauthorized);
          expect((response as HttpResponseUnauthorized).content).to.deep.equal({
            message: 'Bad credentials.'
          });
        });

        it('should return an HttpResponseRedirect if options.failureRedirect is not empty.', async () => {
          const route = login('/', MockAuthenticatorService, {
            failureRedirect: '/foo'
          }).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'Jack' };

          const response = await route.handler(ctx, new ServiceManager());

          expect(response).to.be.an.instanceOf(HttpResponseRedirect);
          expect((response as HttpResponseRedirect).path).to.equal('/foo');
        });

      });

    });

  });

});
