// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  createController,
  getHttpMethod,
  getPath,
  HttpResponseBadRequest,
  HttpResponseNoContent,
  HttpResponseNotFound,
  HttpResponseRedirect,
  HttpResponseUnauthorized,
} from '../../core';
import { AbstractUser } from '../entities';
import { IAuthenticator } from './authenticator.interface';
import { LoginController, strategy } from './login.controller';

describe('strategy', () => {
  it('should create a strategy from the given parameters.', () => {
    const name = 'foo';

    class Authenticator implements IAuthenticator {
      authenticate() {
        return null;
      }
    }

    const schema = {};

    deepStrictEqual(strategy(name, Authenticator, schema), {
      authenticatorClass: Authenticator,
      name,
      schema,
    });
  });
});

describe('LoginController', () => {

  describe('has a "logout" method that', () => {
    class ConcreteController extends LoginController {
      strategies = [];
    }

    it('should handle requests at GET /logout.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'logout'), 'GET');
      strictEqual(getPath(ConcreteController, 'logout'), '/logout');
    });

    it('should delete ctx.session.authentication if it exists.', async () => {
      const ctx = new Context({});
      ctx.request.session = {
        authentication: {
          userId: 1
        }
      };

      const controller = createController(ConcreteController);
      await controller.logout(ctx);

      deepStrictEqual(ctx.request.session, {});
    });

    it('should not throw an error if ctx.session.authentication is undefined.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      const controller = createController(ConcreteController);
      await controller.logout(ctx);
    });

    it('should return an HttpResponseNoContent if redirect.logout is undefined.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      const controller = createController(ConcreteController);
      const response = await controller.logout(ctx);

      ok(response instanceof HttpResponseNoContent);
    });

    it('should return an HttpResponseRedirect if redirect.logout is not empty.', async () => {
      const ctx = new Context({});
      ctx.request.session = {};

      class ConcreteController2 extends LoginController {
        strategies = [];
        redirect = {
          logout: '/foo'
        };
      }

      const controller = createController(ConcreteController2);
      const response = await controller.logout(ctx);

      ok(response instanceof HttpResponseRedirect);
      strictEqual((response as HttpResponseRedirect).path, '/foo');
    });

  });

  describe('has a "login" method that', () => {
    const schema = {
      properties: {
        email: { type: 'string' }
      },
      type: 'object',
    };
    class Authenticator implements IAuthenticator {
      async authenticate(credentials: { email: string }) {
        if (credentials.hasOwnProperty('additionalField')) {
          throw new Error('authenticate was called with an unexpected additional field.');
        }
        return credentials.email === 'john@foalts.org' ? { id: 1 } as AbstractUser : null;
      }

    }

    class ConcreteController extends LoginController {
      strategies = [
        { name: 'email', authenticatorClass: Authenticator, schema }
      ];
    }

    it('should handle requests at POST /:strategy.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'login'), 'POST');
      strictEqual(getPath(ConcreteController, 'login'), '/:strategy');
    });

    it('should return an HttpResponseNotFound if no strategy with the given name is found.', async () => {
      const ctx = new Context({
        params: {
          strategy: 'foobar'
        }
      });

      const controller = createController(ConcreteController);
      const response = await controller.login(ctx);

      ok(response instanceof HttpResponseNotFound);
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

      const controller = createController(ConcreteController);
      const response = await controller.login(ctx);

      ok(response instanceof HttpResponseBadRequest);
      deepStrictEqual(response.content, [
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

      const controller = createController(ConcreteController);
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
        const controller = createController(ConcreteController);
        const response = await controller.login(ctx);

        ok(response instanceof HttpResponseNoContent);
      });

      it('should return an HttpResponseRedirect if redirect.success is not empty.', async () => {
        class ConcreteController2 extends LoginController {
          redirect = {
            success: '/foo'
          };
          strategies = [
            { name: 'email', authenticatorClass: Authenticator, schema }
          ];
        }

        const controller = createController(ConcreteController2);
        const response = await controller.login(ctx);

        ok(response instanceof HttpResponseRedirect);
        strictEqual((response as HttpResponseRedirect).path, '/foo');
      });

      it('should create or update ctx.session.authentication to include the userId.', async () => {
        const controller = createController(ConcreteController);
        await controller.login(ctx);

        deepStrictEqual(ctx.request.session.authentication, {
          userId: 1
        });

        ctx.request.session.authentication.foo = 'bar';

        await controller.login(ctx);

        deepStrictEqual(ctx.request.session.authentication, {
          foo: 'bar',
          userId: 1
        });
      });

    });

    describe('when the authenticator does not find a user fitting the given credentials (ctx.request.body)', () => {

      let ctx: Context;
      beforeEach(() => ctx = new Context({
        body: {
          email: 'mary@foalts.org'
        },
        params: {
          strategy: 'email'
        },
      }));

      it('should return an HttpResponseUnauthorized if redirect.failure is undefined.', async () => {
        const controller = createController(ConcreteController);
        const response = await controller.login(ctx);

        ok(response instanceof HttpResponseUnauthorized);
      });

      it('should return an HttpResponseRedirect if redirect.failure is not empty.', async () => {
        class ConcreteController2 extends LoginController {
          redirect = {
            failure: '/foo'
          };
          strategies = [
            { name: 'email', authenticatorClass: Authenticator, schema }
          ];
        }

        const controller = createController(ConcreteController2);
        const response = await controller.login(ctx);

        ok(response instanceof HttpResponseRedirect);
        strictEqual((response as HttpResponseRedirect).path, '/foo');
      });

    });

  });

});
