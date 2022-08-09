// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import {
  Context,
  getApiParameters,
  getApiResponses,
  getHookFunction,
  HttpResponseBadRequest,
  OpenApi,
  ServiceManager
} from '../../core';
import { ValidateQueryParam } from './validate-query-param.hook';

describe('ValidateQueryParam', () => {

  const services = new ServiceManager();

  describe('should validate the query parameter and', () => {

    it('should return an HttpResponseBadRequest object if the query parameter does not exist'
        + 'and options.required is undefined.', () => {
      const hook = getHookFunction(ValidateQueryParam('foo', {}));
      const ctx = new Context({ query: {} });

      const response = hook(ctx, services);
      if (!(response instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }

      deepStrictEqual(response.body, {
        query: [
          {
            instancePath: '',
            keyword: 'required',
            message: 'must have required property \'foo\'',
            params: {
              missingProperty: 'foo'
            },
            schemaPath: '#/required'
          }
        ]
      });
    });

    it('should return an HttpResponseBadRequest object if the query parameter does not exist'
        + 'and options.required is true.', () => {
      const hook = getHookFunction(ValidateQueryParam('foo', {}, { required: true }));
      const ctx = new Context({ query: {} });

      const response = hook(ctx, services);
      if (!(response instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }

      deepStrictEqual(response.body, {
        query: [
          {
            instancePath: '',
            keyword: 'required',
            message: 'must have required property \'foo\'',
            params: {
              missingProperty: 'foo'
            },
            schemaPath: '#/required'
          }
        ]
      });
    });

    it('should NOT return an HttpResponseBadRequest object if the query parameter does not exist'
        + 'and options.required is false.', () => {
      const hook = getHookFunction(ValidateQueryParam('foo', {}, { required: false }));
      const ctx = new Context({ query: {} });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

    describe('given schema is an object', () => {

      it('should return an HttpResponseBadRequest object if the schema does not validate the query parameter.', () => {
        const hook = getHookFunction(ValidateQueryParam('foo', { type: 'integer' }));
        const ctx = new Context({ query: { foo: 'a' } });

        const response = hook(ctx, services);
        if (!(response instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }

        deepStrictEqual(response.body, {
          query: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: {
                type: 'integer'
              },
              schemaPath: '#/properties/foo/type'
            }
          ]
        });
      });

      it('should NOT return an HttpResponseBadRequest object if the schema validates the query parameter.', () => {
        const hook = getHookFunction(ValidateQueryParam('foo', { type: 'integer' }));
        const ctx = new Context({ query: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

      it('should use the OpenAPI components to validate the query parameter.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {}
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              query: { type: 'integer' }
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateQueryParam('foo', {
          $ref: '#/components/schemas/query'
        })).bind(controller);
        const ctx = new Context({ query: { foo: 'a' } });

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
              schemaPath: '#/components/schemas/query/type',
            }
          ]
        });
      });

    });

    describe('given schema is a function', () => {

      it('should return an HttpResponseBadRequest object if the schema does not validate the query parameter.', () => {
        const hook = getHookFunction(ValidateQueryParam('foo', c => c.schema)).bind({ schema: { type: 'integer' } });
        const ctx = new Context({ query: { foo: 'a' } });

        const response = hook(ctx, services);
        if (!(response instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }

        deepStrictEqual(response.body, {
          query: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: {
                type: 'integer'
              },
              schemaPath: '#/properties/foo/type'
            }
          ]
        });
      });

      it('should NOT return an HttpResponseBadRequest object if the schema validates the query parameter.', () => {
        const hook = getHookFunction(ValidateQueryParam('foo', c => c.schema)).bind({ schema: { type: 'integer' } });
        const ctx = new Context({ query: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

      it('should use the OpenAPI components to validate the query parameter.', () => {
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
              query: { type: 'integer' }
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateQueryParam('foo', controller => controller.schema))
          .bind(controller);
        const ctx = new Context({ query: { foo: 'a' } });

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
              schemaPath: '#/components/schemas/query/type',
            }
          ]
        });
      });

    });

    it('should NOT return an HttpResponseBadRequest object if the schema validates the query parameter'
        + ' (default value).', () => {
      const hook = getHookFunction(ValidateQueryParam('foo'));
      const ctx = new Context({ query: { foo: 'aaa' } });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false.', () => {
      @ValidateQueryParam('foobar', { type: 'string' }, { required: false, openapi: false })
      @ValidateQueryParam('barfoo', { type: 'string' }, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('with the proper api parameters (object).', () => {
      @ValidateQueryParam('foobar', { type: 'string' }, { required: false })
      @ValidateQueryParam('barfoo', { type: 'string' })
      class Foobar {}

      const actual = getApiParameters(Foobar) || [];

      if (typeof actual[0] !== 'function') {
        throw new Error('The ApiParameter metadata (0) should be a function.');
      }
      deepStrictEqual(actual[0](new Foobar()), {
        in: 'query',
        name: 'foobar',
        schema: { type: 'string' }
      });

      if (typeof actual[1] !== 'function') {
        throw new Error('The ApiParameter metadata (1) should be a function.');
      }
      deepStrictEqual(actual[1](new Foobar()), {
        in: 'query',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      });
    });

    it('with the proper api parameters (function).', () => {
      @ValidateQueryParam('foobar', (controller: Foobar) => controller.schema, { required: false })
      @ValidateQueryParam('barfoo', (controller: Foobar) => controller.schema)
      class Foobar {
        schema = { type: 'string' };
      }

      const actual = getApiParameters(Foobar) || [];

      if (typeof actual[0] !== 'function') {
        throw new Error('The ApiParameter metadata (0) should be a function.');
      }
      deepStrictEqual(actual[0](new Foobar()), {
        in: 'query',
        name: 'foobar',
        schema: { type: 'string' }
      });

      if (typeof actual[1] !== 'function') {
        throw new Error('The ApiParameter metadata (1) should be a function.');
      }
      deepStrictEqual(actual[1](new Foobar()), {
        in: 'query',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      });
    });

    it('with the proper API responses.', () => {
      @ValidateQueryParam('foobar', { type: 'string' }, { required: false })
      @ValidateQueryParam('barfoo', { type: 'string' })
      class Foobar {}

      deepStrictEqual(getApiResponses(Foobar), {
        400: { description: 'Bad request.' }
      });
    });

  });

});
