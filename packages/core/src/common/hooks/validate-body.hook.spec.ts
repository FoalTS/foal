// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getApiRequestBody,
  getApiResponses,
  getHookFunction,
  HttpResponseBadRequest,
  IApiSchema,
  OpenApi,
  ServiceManager
} from '../../core';
import { ValidateBody } from './validate-body.hook';

describe('ValidateBody', () => {

  const schema = {
    properties: {
      foo: { type: 'integer' }
    },
    type: 'object',
  };

  describe('should validate the request body and', () => {

    describe('given schema is an object', () => {

      it('should not return an HttpResponseBadRequest if ctx.request.body is validated '
          + ' by ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateBody(schema));
        const ctx = new Context({});
        ctx.request.body = {
          foo: 3
        };

        const actual = hook(ctx, new ServiceManager());
        strictEqual(actual instanceof HttpResponseBadRequest, false);
      });

      it('should return an HttpResponseBadRequest if ctx.request.body is not validated by '
          + ' ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateBody(schema));

        function context(body: any) {
          const ctx = new Context({});
          ctx.request.body = body;
          return ctx;
        }

        ok(hook(context(null), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context(undefined), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context('foo'), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context(3), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context(true), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context({ foo: 'a' }), new ServiceManager()) instanceof HttpResponseBadRequest);
      });

      it('should return an HttpResponseBadRequest with a defined `body` property if '
          + 'ctx.request.body is not validated by ajv.', () => {
        const hook = getHookFunction(ValidateBody(schema));
        const ctx = new Context({});

        const actual = hook(ctx, new ServiceManager());
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          body: [
            {
              instancePath: '',
              keyword: 'type',
              message: 'must be object',
              params: { type: 'object' },
              schemaPath: '#/type',
            }
          ]
        });
      });

      it('should use the OpenAPI components to validate the request body.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {}
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              user: schema as IApiSchema
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateBody({
          $ref: '#/components/schemas/user'
        })).bind(controller);
        const ctx = new Context({
          body: {
            foo: 'hello'
          }
        });

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          body: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/user/properties/foo/type',
            }
          ]
        });
      });

    });

    describe('given schema is a function', () => {

      it('should not return an HttpResponseBadRequest if ctx.request.body is validated '
          + ' by ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateBody(controller => controller.schema)).bind({ schema });
        const ctx = new Context({});
        ctx.request.body = {
          foo: 3
        };

        const actual = hook(ctx, new ServiceManager());
        strictEqual(actual instanceof HttpResponseBadRequest, false);
      });

      it('should return an HttpResponseBadRequest if ctx.request.body is not validated by '
          + ' ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateBody(controller => controller.schema)).bind({ schema });

        function context(body: any) {
          const ctx = new Context({});
          ctx.request.body = body;
          return ctx;
        }

        ok(hook(context(null), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context(undefined), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context('foo'), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context(3), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context(true), new ServiceManager()) instanceof HttpResponseBadRequest);
        ok(hook(context({ foo: 'a' }), new ServiceManager()) instanceof HttpResponseBadRequest);
      });

      it('should return an HttpResponseBadRequest with a defined `body` property if '
          + 'ctx.request.body is not validated by ajv.', () => {
        const hook = getHookFunction(ValidateBody(controller => controller.schema)).bind({ schema });
        const ctx = new Context({});

        const actual = hook(ctx, new ServiceManager());
        ok(actual instanceof HttpResponseBadRequest);
        notStrictEqual((actual as HttpResponseBadRequest).body, undefined);
      });

      it('should use the OpenAPI components to validate the request body.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {
          schema = {
            $ref: '#/components/schemas/user'
          };
        }
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              user: schema as IApiSchema
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateBody(controller => controller.schema)).bind(controller);
        const ctx = new Context({
          body: {
            foo: 'hello'
          }
        });

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          body: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/user/properties/foo/type',
            }
          ]
        });
      });

    });

  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false.', () => {
      @ValidateBody(schema, { openapi: false })
      class Foobar {}

      strictEqual(getApiRequestBody(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('with the proper request body (object).', () => {
      @ValidateBody(schema)
      class Foobar {}

      const actual = getApiRequestBody(Foobar);
      if (typeof actual !== 'function') {
        throw new Error('The ApiRequestBody metadata should be a function.');
      }

      deepStrictEqual(actual(new Foobar()), {
        content: {
          'application/json': { schema: schema as object }
        },
        required: true
      });
    });

    it('with the proper request body (function).', () => {
      @ValidateBody((controller: Foobar) => controller.schema)
      class Foobar {
        schema = schema;
      }

      const actual = getApiRequestBody(Foobar);
      if (typeof actual !== 'function') {
        throw new Error('The ApiRequestBody metadata should be a function.');
      }

      deepStrictEqual(actual(new Foobar()), {
        content: {
          'application/json': { schema: schema as object }
        },
        required: true
      });
    });

    it('with the proper API responses.', () => {
      @ValidateBody(schema)
      class Foobar {}

      deepStrictEqual(getApiResponses(Foobar), {
        400: { description: 'Bad request.' }
      });
    });

  });

});
