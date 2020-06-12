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
import { ValidateCookie } from './validate-cookie.hook';

describe('ValidateCookie', () => {

  const services = new ServiceManager();

  describe('should validate the cookie and', () => {

    it('should return an HttpResponseBadRequest object if the cookie does not exist'
        + 'and options.required is undefined.', () => {
      const hook = getHookFunction(ValidateCookie('foo', {}));
      const ctx = new Context({ cookies: {} });

      const response = hook(ctx, services);
      if (!(response instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }

      deepStrictEqual(response.body, {
        cookies: [
          {
            dataPath: '',
            keyword: 'required',
            message: 'should have required property \'.foo\'',
            params: {
              missingProperty: '.foo'
            },
            schemaPath: '#/required'
          }
        ]
      });
    });

    it('should return an HttpResponseBadRequest object if the cookie does not exist'
        + 'and options.required is true.', () => {
      const hook = getHookFunction(ValidateCookie('foo', {}, { required: true }));
      const ctx = new Context({ cookies: {} });

      const response = hook(ctx, services);
      if (!(response instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }

      deepStrictEqual(response.body, {
        cookies: [
          {
            dataPath: '',
            keyword: 'required',
            message: 'should have required property \'.foo\'',
            params: {
              missingProperty: '.foo'
            },
            schemaPath: '#/required'
          }
        ]
      });
    });

    it('should NOT return an HttpResponseBadRequest object if the cookie does not exist'
        + 'and options.required is false.', () => {
      const hook = getHookFunction(ValidateCookie('foo', {}, { required: false }));
      const ctx = new Context({ cookies: {} });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

    describe('given schema is an object', () => {

      it('should return an HttpResponseBadRequest object if the schema does not validate the cookie.', () => {
        const hook = getHookFunction(ValidateCookie('foo', { type: 'integer' }));
        const ctx = new Context({ cookies: { foo: 'a' } });

        const response = hook(ctx, services);
        if (!(response instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }

        deepStrictEqual(response.body, {
          cookies: [
            {
              dataPath: '.foo',
              keyword: 'type',
              message: 'should be integer',
              params: {
                type: 'integer'
              },
              schemaPath: '#/properties/foo/type'
            }
          ]
        });
      });

      it('should NOT return an HttpResponseBadRequest object if the schema validates the cookie.', () => {
        const hook = getHookFunction(ValidateCookie('foo', { type: 'integer' }));
        const ctx = new Context({ cookies: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

      it('should use the OpenAPI components to validate the cookie.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {}
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              cookie: { type: 'integer' }
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateCookie('foo', {
          $ref: '#/components/schemas/cookie'
        })).bind(controller);
        const ctx = new Context({ cookies: { foo: 'a' } });

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          cookies: [
            {
              dataPath: '.foo',
              keyword: 'type',
              message: 'should be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/cookie/type',
            }
          ]
        });
      });

    });

    describe('given schema is a function', () => {

      it('should return an HttpResponseBadRequest object if the schema does not validate the cookie.', () => {
        const hook = getHookFunction(ValidateCookie('foo', c => c.schema)).bind({ schema: { type: 'integer' }});
        const ctx = new Context({ cookies: { foo: 'a' } });

        const response = hook(ctx, services);
        if (!(response instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }

        deepStrictEqual(response.body, {
          cookies: [
            {
              dataPath: '.foo',
              keyword: 'type',
              message: 'should be integer',
              params: {
                type: 'integer'
              },
              schemaPath: '#/properties/foo/type'
            }
          ]
        });
      });

      it('should NOT return an HttpResponseBadRequest object if the schema validates the cookie.', () => {
        const hook = getHookFunction(ValidateCookie('foo', c => c.schema)).bind({ schema: { type: 'integer' }});
        const ctx = new Context({ cookies: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

    });

    it('should NOT return an HttpResponseBadRequest object if the schema validates the cookie (default value).', () => {
      const hook = getHookFunction(ValidateCookie('foo'));
      const ctx = new Context({ cookies: { foo: 'aaa' } });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

    it('should use the OpenAPI components to validate the cookie.', () => {
      const services = new ServiceManager();
      const openApi = services.get(OpenApi);

      class ApiController {
        schema = {
          $ref: '#/components/schemas/cookie'
        };
      }
      const controller = new ApiController();

      openApi.addDocument(ApiController, {
        components: {
          schemas: {
            cookie: { type: 'integer' }
          }
        },
        info: {
          title: 'Api',
          version: '1.0.0',
        },
        openapi: '3.0.2',
        paths: {},
      }, [ controller ]);

      const hook = getHookFunction(ValidateCookie('foo', controller => controller.schema))
        .bind(controller);
      const ctx = new Context({ cookies: { foo: 'a' } });

      const actual = hook(ctx, services);
      if (!(actual instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }
      deepStrictEqual(actual.body, {
        cookies: [
          {
            dataPath: '.foo',
            keyword: 'type',
            message: 'should be integer',
            params: { type: 'integer' },
            schemaPath: '#/components/schemas/cookie/type',
          }
        ]
      });
    });

  });

  describe('should define an API specification', () => {

    it('unless options.openapi is false.', () => {
      @ValidateCookie('foobar', { type: 'string' }, { required: false, openapi: false })
      @ValidateCookie('barfoo', { type: 'string' }, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('with the proper api parameters (object).', () => {
      @ValidateCookie('foobar', { type: 'string' }, { required: false })
      @ValidateCookie('barfoo', { type: 'string' })
      class Foobar {}

      const actual = getApiParameters(Foobar) || [];

      if (typeof actual[0] !== 'function') {
        throw new Error('The ApiParameter metadata (0) should be a function.');
      }
      deepStrictEqual(actual[0](new Foobar()), {
        in: 'cookie',
        name: 'foobar',
        schema: { type: 'string' }
      });

      if (typeof actual[1] !== 'function') {
        throw new Error('The ApiParameter metadata (1) should be a function.');
      }
      deepStrictEqual(actual[1](new Foobar()), {
        in: 'cookie',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      });
    });

    it('with the proper api parameters (function).', () => {
      @ValidateCookie('foobar', (controller: Foobar) => controller.schema, { required: false })
      @ValidateCookie('barfoo', (controller: Foobar) => controller.schema)
      class Foobar {
        schema = { type: 'string' };
      }

      const actual = getApiParameters(Foobar) || [];

      if (typeof actual[0] !== 'function') {
        throw new Error('The ApiParameter metadata (0) should be a function.');
      }
      deepStrictEqual(actual[0](new Foobar()), {
        in: 'cookie',
        name: 'foobar',
        schema: { type: 'string' }
      });

      if (typeof actual[1] !== 'function') {
        throw new Error('The ApiParameter metadata (1) should be a function.');
      }
      deepStrictEqual(actual[1](new Foobar()), {
        in: 'cookie',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      });
    });

    it('with the proper API responses.', () => {
      @ValidateCookie('foobar', { type: 'string' }, { required: false })
      @ValidateCookie('barfoo', { type: 'string' })
      class Foobar {}

      deepStrictEqual(getApiResponses(Foobar), {
        400: { description: 'Bad request.' }
      });
    });

  });

});
