import * as chai from 'chai';
import * as spies from 'chai-spies';

import { ValidationError } from '../../common';
import {
  Context,
  HttpResponseBadRequest,
  HttpResponseNoContent,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  Service,
  ServiceManager,
} from '../../core';
import { IAuthenticator } from './authenticator.interface';
import { login } from './login.controller-factory';

chai.use(spies);
const expect = chai.expect;

describe('login', () => {

  @Service()
  class Authenticator implements IAuthenticator<any> {
    validate(credentials): { username: string, foo: string } {
      if (typeof credentials !== 'object' || credentials === null) {
        throw new ValidationError({ message: 'Credentials should be an object.' });
      }
      if (!credentials.hasOwnProperty('username') || typeof credentials.username !== 'string') {
        throw new ValidationError({
          message: 'Credentials should has a correct username property.'
        });
      }
      return { username: credentials.username, foo: 'bar' };
    }
    authenticate(credentials: { username: string }) {
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
        const route = login('/foobar', Authenticator).getRoute('main');

        expect(route.httpMethod).to.equal('POST');
        expect(route.path).to.equal('/foobar');
      });

      it('should call Authenticator.validate with ctx.request.body and use the returned value '
          + 'to call Authenticator.authenticate.', async () => {
        const route = login('/', Authenticator).getRoute('main');

        const ctx = new Context();
        ctx.session = {};
        ctx.request.body = { username: 'John' };

        const services = new ServiceManager();

        chai.spy.on(services.get(Authenticator), 'validate');
        chai.spy.on(services.get(Authenticator), 'authenticate');

        await route.handler(ctx, services);

        expect(services.get(Authenticator).validate)
          .to.have.been.called.with({ username: 'John' });
        expect(services.get(Authenticator).authenticate)
          .to.have.been.called.with({ username: 'John', foo: 'bar' });
      });

      it('should return an HttpResponseBadRequest if Authenticator.validate throw '
          + 'a ValidationError.', async () => {
        const route = login('/', Authenticator).getRoute('main');

        const ctx = new Context();
        ctx.session = {};
        ctx.request.body = {};

        const response = await route.handler(ctx, new ServiceManager());

        expect(response).to.be.an.instanceOf(HttpResponseBadRequest)
          .with.deep.property('content', {
            message: 'Credentials should has a correct username property.'
          });
      });

      describe('when the authentication succeeds', () => {

        it('should return an HttpResponseNoContent if options.successRedirect is undefined.', async () => {
          const route = login('/', Authenticator).getRoute('main');

          const ctx = new Context();
          ctx.session = {};
          ctx.request.body = { username: 'John' };

          const response = await route.handler(ctx, new ServiceManager());

          expect(response).to.be.an.instanceOf(HttpResponseNoContent);
        });

        it('should return an HttpResponseRedirect if options.successRedirect is not empty.', async () => {
          const route = login('/', Authenticator, {
            successRedirect: '/foo'
          }).getRoute('main');

          const ctx = new Context();
          ctx.session = {};
          ctx.request.body = { username: 'John' };

          const response = await route.handler(ctx, new ServiceManager());

          expect(response).to.be.an.instanceOf(HttpResponseRedirect);
          expect((response as HttpResponseRedirect).path).to.equal('/foo');
        });

        it('should create or update ctx.session.authentication to include the userId.', async () => {
          const route = login('/', Authenticator).getRoute('main');

          const ctx = new Context();
          ctx.session = {};
          ctx.request.body = { username: 'John' };

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
          const route = login('/', Authenticator).getRoute('main');

          const ctx = new Context();
          ctx.session = {};
          ctx.request.body = { username: 'Jack' };

          const response = await route.handler(ctx, new ServiceManager());

          expect(response).to.be.an.instanceOf(HttpResponseUnauthorized);
          expect((response as HttpResponseUnauthorized).content).to.deep.equal({
            message: 'Bad credentials.'
          });
        });

        it('should return an HttpResponseRedirect if options.failureRedirect is not empty.', async () => {
          const route = login('/', Authenticator, {
            failureRedirect: '/foo'
          }).getRoute('main');

          const ctx = new Context();
          ctx.session = {};
          ctx.request.body = { username: 'Jack' };

          const response = await route.handler(ctx, new ServiceManager());

          expect(response).to.be.an.instanceOf(HttpResponseRedirect);
          expect((response as HttpResponseRedirect).path).to.equal('/foo');
        });

      });

    });

  });

});
