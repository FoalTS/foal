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
import { ValidateHeader } from './validate-header.hook';

describe('ValidateHeader', () => {

  const services = new ServiceManager();

  describe('should validate the header and', () => {

    it('should return an HttpResponseBadRequest object if the header does not exist'
        + 'and options.required is undefined.', () => {
      const hook = getHookFunction(ValidateHeader('foo', {}));
      const ctx = new Context({ headers: {} });

      const response = hook(ctx, services);
      if (!(response instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }

      deepStrictEqual(response.body, {
        headers: [
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

    it('should return an HttpResponseBadRequest object if the header does not exist'
        + 'and options.required is true.', () => {
      const hook = getHookFunction(ValidateHeader('foo', {}, { required: true }));
      const ctx = new Context({ headers: {} });

      const response = hook(ctx, services);
      if (!(response instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }

      deepStrictEqual(response.body, {
        headers: [
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

    it('should NOT return an HttpResponseBadRequest object if the header does not exist'
        + 'and options.required is false.', () => {
      const hook = getHookFunction(ValidateHeader('foo', {}, { required: false }));
      const ctx = new Context({ headers: {} });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

    describe('given schema is an object', () => {

      it('should return an HttpResponseBadRequest object if the schema does not validate the header.', () => {
        const hook = getHookFunction(ValidateHeader('foo', { type: 'integer' }));
        const ctx = new Context({ headers: { foo: 'a' } });

        const response = hook(ctx, services);
        if (!(response instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }

        deepStrictEqual(response.body, {
          headers: [
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

      it('should NOT return an HttpResponseBadRequest object if the schema validates the header.', () => {
        const hook = getHookFunction(ValidateHeader('foo', { type: 'integer' }));
        const ctx = new Context({ headers: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

      it('should NOT return an HttpResponseBadRequest object if the schema validates'
          + ' the header (case insensitive).', () => {
        const hook = getHookFunction(ValidateHeader('Authorization', { type: 'string' }));
        const ctx = new Context({ headers: { authorization: 'xxx' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

      it('should use the OpenAPI components to validate the header.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {}
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              header: { type: 'integer' }
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateHeader('foo', {
          $ref: '#/components/schemas/header'
        })).bind(controller);
        const ctx = new Context({ headers: { foo: 'a' } });

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          headers: [
            {
              instancePath: '/foo',
              keyword: 'type',
              message: 'must be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/header/type',
            }
          ]
        });
      });

    });

    describe('given schema is a function', () => {

      it('should return an HttpResponseBadRequest object if the schema does not validate the header.', () => {
        const hook = getHookFunction(ValidateHeader('foo', c => c.schema)).bind({ schema: { type: 'integer' } });
        const ctx = new Context({ headers: { foo: 'a' } });

        const response = hook(ctx, services);
        if (!(response instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }

        deepStrictEqual(response.body, {
          headers: [
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

      it('should NOT return an HttpResponseBadRequest object if the schema validates the header.', () => {
        const hook = getHookFunction(ValidateHeader('foo', c => c.schema)).bind({ schema: { type: 'integer' } });
        const ctx = new Context({ headers: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

    });

    it('should NOT return an HttpResponseBadRequest object if the schema validates the header (default value).', () => {
      const hook = getHookFunction(ValidateHeader('foo'));
      const ctx = new Context({ headers: { foo: 'aaa' } });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

    it('should use the OpenAPI components to validate the header.', () => {
      const services = new ServiceManager();
      const openApi = services.get(OpenApi);

      class ApiController {
        schema = {
          $ref: '#/components/schemas/header'
        };
      }
      const controller = new ApiController();

      openApi.addDocument(ApiController, {
        components: {
          schemas: {
            header: { type: 'integer' }
          }
        },
        info: {
          title: 'Api',
          version: '1.0.0',
        },
        openapi: '3.0.2',
        paths: {},
      }, [ controller ]);

      const hook = getHookFunction(ValidateHeader('foo',  controller => controller.schema))
        .bind(controller);
      const ctx = new Context({ headers: { foo: 'a' } });

      const actual = hook(ctx, services);
      if (!(actual instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }
      deepStrictEqual(actual.body, {
        headers: [
          {
            instancePath: '/foo',
            keyword: 'type',
            message: 'must be integer',
            params: { type: 'integer' },
            schemaPath: '#/components/schemas/header/type',
          }
        ]
      });
    });

  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false.', () => {
      @ValidateHeader('foobar', { type: 'string' }, { required: false, openapi: false })
      @ValidateHeader('barfoo', { type: 'string' }, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('with the proper api parameters (object).', () => {
      @ValidateHeader('foobar', { type: 'string' }, { required: false })
      @ValidateHeader('barfoo', { type: 'string' })
      class Foobar {}

      const actual = getApiParameters(Foobar) || [];

      if (typeof actual[0] !== 'function') {
        throw new Error('The ApiParameter metadata (0) should be a function.');
      }
      deepStrictEqual(actual[0](new Foobar()), {
        in: 'header',
        name: 'foobar',
        schema: { type: 'string' }
      });

      if (typeof actual[1] !== 'function') {
        throw new Error('The ApiParameter metadata (1) should be a function.');
      }
      deepStrictEqual(actual[1](new Foobar()), {
        in: 'header',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      });
    });

    it('with the proper api parameters (function).', () => {
      @ValidateHeader('foobar', (controller: Foobar) => controller.schema, { required: false })
      @ValidateHeader('barfoo', (controller: Foobar) => controller.schema)
      class Foobar {
        schema = { type: 'string' };
      }

      const actual = getApiParameters(Foobar) || [];

      if (typeof actual[0] !== 'function') {
        throw new Error('The ApiParameter metadata (0) should be a function.');
      }
      deepStrictEqual(actual[0](new Foobar()), {
        in: 'header',
        name: 'foobar',
        schema: { type: 'string' }
      });

      if (typeof actual[1] !== 'function') {
        throw new Error('The ApiParameter metadata (1) should be a function.');
      }
      deepStrictEqual(actual[1](new Foobar()), {
        in: 'header',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      });
    });

    it('with the proper API responses.', () => {
      @ValidateHeader('foobar', { type: 'string' }, { required: false })
      @ValidateHeader('barfoo', { type: 'string' })
      class Foobar {}

      deepStrictEqual(getApiResponses(Foobar), {
        400: { description: 'Bad request.' }
      });
    });

  });

});
