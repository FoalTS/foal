// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getApiParameters,
  getApiResponses,
  getHookFunction,
  HttpResponseBadRequest,
  IApiSchema,
  OpenApi,
  ServiceManager
} from '../../core';
import { ValidateQuery } from './validate-query.hook';

describe('ValidateQuery', () => {

  const services = new ServiceManager();

  const schema = {
    properties: {
      foo: { type: 'integer' }
    },
    type: 'object',
  };

  describe('should validate the request query and', () => {

    describe('given schema is an object', () => {

      it('should not return an HttpResponseBadRequest if ctx.request.query is validated '
          + ' by ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateQuery(schema));
        const ctx = new Context({});
        ctx.request.query = {
          foo: 3
        };

        const actual = hook(ctx, services);
        strictEqual(actual instanceof HttpResponseBadRequest, false);
      });

      it('should return an HttpResponseBadRequest if ctx.request.query is not validated by '
          + ' ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateQuery(schema));

        function context(query: any) {
          const ctx = new Context({});
          ctx.request.query = query;
          return ctx;
        }

        ok(hook(context(null), services) instanceof HttpResponseBadRequest);
        ok(hook(context(undefined), services) instanceof HttpResponseBadRequest);
        ok(hook(context('foo'), services) instanceof HttpResponseBadRequest);
        ok(hook(context(3), services) instanceof HttpResponseBadRequest);
        ok(hook(context(true), services) instanceof HttpResponseBadRequest);
        ok(hook(context({ foo: 'a' }), services) instanceof HttpResponseBadRequest);
      });

      it('should return an HttpResponseBadRequest with a defined `query` property if '
          + 'ctx.request.query is not validated by ajv.', () => {
        const hook = getHookFunction(ValidateQuery(schema));
        const ctx = new Context({});
        ctx.request.query = { foo: 'a' };

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          query: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: { type: 'integer' },
              schemaPath: '#/properties/foo/type',
            }
          ]
        });
      });

      it('should use the OpenAPI components to validate the request query.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {}
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              query: schema as IApiSchema
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateQuery({
          $ref: '#/components/schemas/query'
        })).bind(controller);
        const ctx = new Context({});
        ctx.request.query = {
          foo: 'hello'
        };

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          query: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/query/properties/foo/type',
            }
          ]
        });
      });

    });

    describe('given schema is a function', () => {

      it('should not return an HttpResponseBadRequest if ctx.request.query is validated '
          + ' by ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateQuery(controller => controller.schema)).bind({ schema });
        const ctx = new Context({});
        ctx.request.query = {
          foo: 3
        };

        const actual = hook(ctx, services);
        strictEqual(actual instanceof HttpResponseBadRequest, false);
      });

      it('should return an HttpResponseBadRequest if ctx.request.query is not validated by '
          + ' ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateQuery(controller => controller.schema)).bind({ schema });

        function context(query: any) {
          const ctx = new Context({});
          ctx.request.query = query;
          return ctx;
        }

        ok(hook(context(null), services) instanceof HttpResponseBadRequest);
        ok(hook(context(undefined), services) instanceof HttpResponseBadRequest);
        ok(hook(context('foo'), services) instanceof HttpResponseBadRequest);
        ok(hook(context(3), services) instanceof HttpResponseBadRequest);
        ok(hook(context(true), services) instanceof HttpResponseBadRequest);
        ok(hook(context({ foo: 'a' }), services) instanceof HttpResponseBadRequest);
      });

      it('should return an HttpResponseBadRequest with a defined `query` property if '
          + 'ctx.request.query is not validated by ajv.', () => {
        const hook = getHookFunction(ValidateQuery(controller => controller.schema)).bind({ schema });
        const ctx = new Context({});
        ctx.request.query = { foo: 'a' };

        const actual = hook(ctx, services);
        ok(actual instanceof HttpResponseBadRequest);
        notStrictEqual((actual as HttpResponseBadRequest).body, undefined);
      });

      it('should use the OpenAPI components to validate the request query.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {
          schema = {
            $ref: '#/components/schemas/query'
          };
        }
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              query: schema as IApiSchema
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateQuery(controller => controller.schema)).bind(controller);
        const ctx = new Context({});
        ctx.request.query = {
          foo: 'hello'
        };

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          query: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/query/properties/foo/type',
            }
          ]
        });
      });

    });

  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false.', () => {
      @ValidateQuery(schema, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('with one ApiParameter per property in the schema (object).', () => {
      @ValidateQuery({
        properties: {
          bar: { type: 'string' },
          foo: { type: 'integer' }
        },
        required: [ 'foo' ],
        type: 'object'
      })
      class Foobar {}

      const actual = getApiParameters(Foobar) || [];

      deepStrictEqual(actual, [
        { in: 'query', name: 'bar', schema: { type: 'string' } },
        { in: 'query', name: 'foo', required: true, schema: { type: 'integer' } },
      ]);
    });

    it('with no ApiParameter when the schema is a function.', () => {
      @ValidateQuery((controller: Foobar) => controller.schema)
      class Foobar {
        schema = schema;
      }

      strictEqual(getApiParameters(Foobar), undefined);
    });

    it('with the proper API responses.', () => {
      @ValidateQuery(schema)
      class Foobar {}

      deepStrictEqual(getApiResponses(Foobar), {
        400: { description: 'Bad request.' }
      });
    });

  });

});
