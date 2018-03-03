import {
  createEmptyContext,
  HttpResponseOK,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  ObjectType,
  Service,
  ServiceManager,
} from '@foal/core';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import { authentication, AuthenticationFactory } from './authentication.controller-factory';
import { AuthenticatorService } from './authenticator-service.interface';

chai.use(spies);
const expect = chai.expect;

describe('authentication', () => {

  @Service()
  class MockAuthenticatorService implements AuthenticatorService<any> {
    constructor() {}

    public authenticate(credentials: ObjectType) {
      if (credentials.username === 'John') {
        return {
          id: 1,
          username: 'John',
        };
      }
      return null;
    }
  }

  it('should be an instance of AuthenticationFactory', () => {
    expect(authentication).to.an.instanceOf(AuthenticationFactory);
  });

  describe('when attachService is called', () => {

    describe('should return a controller with a proper `main` route that', () => {

      it('should handles requests at POST /.', () => {
        const route = authentication.attachService('/', MockAuthenticatorService).getRoute('main');

        expect(route.httpMethod).to.equal('POST');
        expect(route.path).to.equal('/');
      });

      describe('when the authentication succeeds', () => {

        it('should return an HttpResponseOK with the matching user if options.successRedirect '
           + 'is undefined.', async () => {
          const route = authentication.attachService('/', MockAuthenticatorService).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'John' };

          const result = await route.handler(ctx, new ServiceManager());

          expect(result).to.be.an.instanceOf(HttpResponseOK);
          expect((result as HttpResponseOK).content).to.deep.equal({
            id: 1,
            username: 'John',
          });
        });

        it('should return an HttpResponseRedirect if options.successRedirect is not empty.', async () => {
          const route = authentication.attachService('/', MockAuthenticatorService, {
            successRedirect: '/foo'
          }).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'John' };

          const result = await route.handler(ctx, new ServiceManager());

          expect(result).to.be.an.instanceOf(HttpResponseRedirect);
          expect((result as HttpResponseRedirect).path).to.equal('/foo');
        });

        it('should create or update ctx.session.authentication to include the userId.', async () => {
          const route = authentication.attachService('/', MockAuthenticatorService).getRoute('main');

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
          const route = authentication.attachService('/', MockAuthenticatorService).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'Jack' };

          const result = await route.handler(ctx, new ServiceManager());

          expect(result).to.be.an.instanceOf(HttpResponseUnauthorized);
          expect((result as HttpResponseUnauthorized).content).to.deep.equal({
            message: 'Bad credentials.'
          });
        });

        it('should return an HttpResponseRedirect if options.failureRedirect is not empty.', async () => {
          const route = authentication.attachService('/', MockAuthenticatorService, {
            failureRedirect: '/foo'
          }).getRoute('main');

          const ctx = createEmptyContext();
          ctx.session = {};
          ctx.body = { username: 'Jack' };

          const result = await route.handler(ctx, new ServiceManager());

          expect(result).to.be.an.instanceOf(HttpResponseRedirect);
          expect((result as HttpResponseRedirect).path).to.equal('/foo');
        });

      });

    });

  });

});
