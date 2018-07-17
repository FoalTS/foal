// 3p
import { expect } from 'chai';

// FoalTS
import {
  Context,
  getHttpMethod,
  getPath,
  HttpResponseBadRequest,
  HttpResponseNoContent,
  HttpResponseNotFound,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
  Service,
  ServiceManager
} from '../../core';
import { AbstractUser } from '../entities';
import { IAuthenticator } from './authenticator.interface';
import { LoginController, strategy } from './login.controller';

describe('strategy', () => {
  it('should create a strategy from the given parameters.', () => {
    const name = 'foo';

    @Service()
    class Authenticator implements IAuthenticator {
      authenticate() {
        return null;
      }
    }

    const schema = {};

    expect(strategy(name, Authenticator, schema)).to.deep.equal({
      authenticatorClass: Authenticator,
      name,
      schema,
    });
  });
});

describe('LoginController', () => {

  describe('has a "logout" method that', () => {
    // @Controller()
    // TODO: uncomment the above line.
    class ConcreteController extends LoginController {
      strategies = [];
    }

    it('should handle requests at GET /logout.', () => {
      expect(getHttpMethod(ConcreteController, 'logout')).to.equal('GET');
      expect(getPath(ConcreteController, 'logout')).to.equal('/logout');
    });

    it('should delete ctx.session.authentication if it exists.', async () => {
      const ctx = new Context({});
      ctx.request.session = {
        authentication: {
          userId: 1
        }
      };

      const controller = new ConcreteController(new ServiceManager());
      await controller.logout(ctx);

      expect(ctx.request.session).to.deep.equal({});
    });

    it('should not throw an error if ctx.session.authentication is undefined.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      const controller = new ConcreteController(new ServiceManager());
      await controller.logout(ctx);
    });

    it('should return an HttpResponseNoContent if redirect.logout is undefined.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      const controller = new ConcreteController(new ServiceManager());
      const response = await controller.logout(ctx);

      expect(response).to.be.an.instanceOf(HttpResponseNoContent);
    });

    it('should return an HttpResponseRedirect if redirect.logout is not empty.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      // @Controller()
      // TODO: uncomment the above line.
      class ConcreteController2 extends LoginController {
        strategies = [];
        redirect = {
          logout: '/foo'
        };
      }

      const controller = new ConcreteController2(new ServiceManager());
      const response = await controller.logout(ctx);

      expect(response).to.be.an.instanceOf(HttpResponseRedirect);
      expect((response as HttpResponseRedirect).path).to.equal('/foo');
    });

  });

  describe('has a "login" method that', () => {
    const schema = {
      properties: {
        email: { type: 'string' }
      },
      type: 'object',
    };
    @Service()
    class Authenticator implements IAuthenticator {
      async authenticate(credentials: { email: string }) {
        if (credentials.hasOwnProperty('additionalField')) {
          throw new Error('authenticate was called with an unexpected additional field.');
        }
        return credentials.email === 'john@foalts.org' ? { id: 1 } as AbstractUser : null;
      }

    }

    // @Controller()
    // TODO: uncomment the above line.
    class ConcreteController extends LoginController {
      strategies = [
        { name: 'email', authenticatorClass: Authenticator, schema }
      ];
    }

    it('should handle requests at POST /:strategy.', () => {
      expect(getHttpMethod(ConcreteController, 'login')).to.equal('POST');
      expect(getPath(ConcreteController, 'login')).to.equal('/:strategy');
    });

    it('should return an HttpResponseNotFound if no strategy with the given name is found.', async () => {
      const ctx = new Context({
        params: {
          strategy: 'foobar'
        }
      });

      const controller = new ConcreteController(new ServiceManager());
      const response = await controller.login(ctx);

      expect(response).to.be.an.instanceOf(HttpResponseNotFound);
    });

    it('should return an HttpResponseBadRequest with the ajv errors if ctx.request.body does'
        + ' not fit the schema.', async () => {
      const ctx = new Context({
        body: {
          email: 3
        },
        params: {
          strategy: 'email'
        },
      });

      const controller = new ConcreteController(new ServiceManager());
      const response = await controller.login(ctx);

      expect(response).to.be.an.instanceOf(HttpResponseBadRequest)
        .with.deep.property('content', [
          {
            dataPath: '.email',
            keyword: 'type',
            message: 'should be string',
            params: {
              type: 'string',
            },
            schemaPath: '#/properties/email/type',
          }
        ]);
    });

    it('should remove any additional field (ajv schema) before calling authenticator.authenticate'
        + ' if schema.additionalProperties === false', done => {
      // @Controller()
      // TODO: uncomment the above line.
      class ConcreteController extends LoginController {
        strategies = [
          {
            authenticatorClass: Authenticator,
            name: 'email',
            schema: { ...schema, additionalProperties: false }
          }
        ];
      }

      const ctx = new Context({
        body: {
          additionalField: 'foobar',
          email: 'a@foalts.org',
        },
        params: {
          strategy: 'email'
        },
      });

      const controller = new ConcreteController(new ServiceManager());
      controller.login(ctx)
        .then(response => {
          if (response instanceof HttpResponseBadRequest) {
            done(response);
            return;
          }
          done();
        })
        // Authenticator.authenticate rejects an Error if it was called with the field 'additionalField'.
        .catch(err => done(err));
    });

    describe('when the authenticator finds a user fitting the given credentials (ctx.request.body)', () => {

      let ctx: Context;
      beforeEach(() => ctx = new Context({
        body: {
          email: 'john@foalts.org'
        },
        params: {
          strategy: 'email'
        },
        session: {}
      }));

      it('should return an HttpResponseNoContent if redirect.success is undefined.', async () => {
        const controller = new ConcreteController(new ServiceManager());
        const response = await controller.login(ctx);

        expect(response).to.be.an.instanceOf(HttpResponseNoContent);
      });

      it('should return an HttpResponseRedirect if redirect.success is not empty.', async () => {
        // @Controller()
        // TODO: uncomment the above line.
        class ConcreteController2 extends LoginController {
          redirect = {
            success: '/foo'
          };
          strategies = [
            { name: 'email', authenticatorClass: Authenticator, schema }
          ];
        }

        const controller = new ConcreteController2(new ServiceManager());
        const response = await controller.login(ctx);

        expect(response).to.be.an.instanceOf(HttpResponseRedirect)
          .with.property('path', '/foo');
      });

      it('should create or update ctx.session.authentication to include the userId.', async () => {
        const controller = new ConcreteController(new ServiceManager());
        await controller.login(ctx);

        expect(ctx.request.session.authentication).to.deep.equal({
          userId: 1
        });

        ctx.request.session.authentication.foo = 'bar';

        await controller.login(ctx);

        expect(ctx.request.session.authentication).to.deep.equal({
          foo: 'bar',
          userId: 1
        });
      });

    });

    describe('when the authenticator does not find a user fitting the given credentials (ctx.request.body)', () => {

      let ctx: Context;
      beforeEach(() => ctx = new Context({
        body: {
          email: 'jack@foalts.org'
        },
        params: {
          strategy: 'email'
        },
      }));

      it('should return an HttpResponseUnauthorized if redirect.failure is undefined.', async () => {
        const controller = new ConcreteController(new ServiceManager());
        const response = await controller.login(ctx);

        expect(response).to.be.an.instanceOf(HttpResponseUnauthorized);
      });

      it('should return an HttpResponseRedirect if redirect.failure is not empty.', async () => {
        // @Controller()
        // TODO: uncomment the above line.
        class ConcreteController2 extends LoginController {
          redirect = {
            failure: '/foo'
          };
          strategies = [
            { name: 'email', authenticatorClass: Authenticator, schema }
          ];
        }

        const controller = new ConcreteController2(new ServiceManager());
        const response = await controller.login(ctx);

        expect(response).to.be.an.instanceOf(HttpResponseRedirect)
          .with.property('path', '/foo');
      });

    });

  });

});
