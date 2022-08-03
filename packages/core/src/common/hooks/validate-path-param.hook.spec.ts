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
import { ValidatePathParam } from './validate-path-param.hook';

describe('ValidatePathParam', () => {

  const services = new ServiceManager();

  describe('should validate the path parameter and', () => {

    describe('given schema is an object', () => {

      it('should return an HttpResponseBadRequest object if the schema does not validate the path parameter.', () => {
        const hook = getHookFunction(ValidatePathParam('foo', { type: 'integer' }));
        const ctx = new Context({ params: { foo: 'a' } });

        const response = hook(ctx, services);
        if (!(response instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }

        deepStrictEqual(response.body, {
          pathParams: [
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

      it('should NOT return an HttpResponseBadRequest object if the schema validates the path parameter.', () => {
        const hook = getHookFunction(ValidatePathParam('foo', { type: 'integer' }));
        const ctx = new Context({ params: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

      it('should use the OpenAPI components to validate the path parameter.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {}
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              param: { type: 'integer' }
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidatePathParam('foo', {
          $ref: '#/components/schemas/param'
        })).bind(controller);
        const ctx = new Context({ params: { foo: 'a' } });

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          pathParams: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/param/type',
            }
          ]
        });
      });

    });

    describe('given schema is a function', () => {

      it('should return an HttpResponseBadRequest object if the schema does not validate the path parameter.', () => {
        const hook = getHookFunction(ValidatePathParam('foo', c => c.schema)).bind({ schema: { type: 'integer' } });
        const ctx = new Context({ params: { foo: 'a' } });

        const response = hook(ctx, services);
        if (!(response instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }

        deepStrictEqual(response.body, {
          pathParams: [
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

      it('should NOT return an HttpResponseBadRequest object if the schema validates the path parameter.', () => {
        const hook = getHookFunction(ValidatePathParam('foo', c => c.schema)).bind({ schema: { type: 'integer' } });
        const ctx = new Context({ params: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

      it('should use the OpenAPI components to validate the path parameter.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {
          schema = {
            $ref: '#/components/schemas/param'
          };
        }
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              param: { type: 'integer' }
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidatePathParam('foo', controller => controller.schema))
          .bind(controller);
        const ctx = new Context({ params: { foo: 'a' } });

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          pathParams: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/param/type',
            }
          ]
        });
      });

    });

  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false.', () => {
      @ValidatePathParam('barfoo', { type: 'string' }, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('with the proper api parameters (object).', () => {
      @ValidatePathParam('barfoo', { type: 'string' })
      class Foobar {}

      const actual = getApiParameters(Foobar) || [];

      if (typeof actual[0] !== 'function') {
        throw new Error('The ApiParameter metadata (0) should be a function.');
      }
      deepStrictEqual(actual[0](new Foobar()), {
        in: 'path',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      });
    });

    it('with the proper api parameters (function).', () => {
      @ValidatePathParam('barfoo', (controller: Foobar) => controller.schema)
      class Foobar {
        schema = { type: 'string' };
      }

      const actual = getApiParameters(Foobar) || [];

      if (typeof actual[0] !== 'function') {
        throw new Error('The ApiParameter metadata (0) should be a function.');
      }
      deepStrictEqual(actual[0](new Foobar()), {
        in: 'path',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      });
    });

    it('with the proper API responses.', () => {
      @ValidatePathParam('barfoo', { type: 'string' })
      class Foobar {}

      deepStrictEqual(getApiResponses(Foobar), {
        400: { description: 'Bad request.' }
      });
    });

  });

});
