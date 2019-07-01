// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Class, Context, getHookFunction, HttpResponseBadRequest, ServiceManager } from '../../core';
import { getApiParameters, getApiResponses, IApiPathParameter, IApiResponses } from '../../openapi';
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

      it('should NOT return an HttpResponseBadRequest object if the schema validates the path parameter.', () => {
        const hook = getHookFunction(ValidatePathParam('foo', { type: 'integer' }));
        const ctx = new Context({ params: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
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

      it('should NOT return an HttpResponseBadRequest object if the schema validates the path parameter.', () => {
        const hook = getHookFunction(ValidatePathParam('foo', c => c.schema)).bind({ schema: { type: 'integer' } });
        const ctx = new Context({ params: { foo: '3' } });

        const response = hook(ctx, services);
        strictEqual(response, undefined);
      });

    });

  });

  describe('should define an API specification', () => {

    afterEach(() => delete process.env.SETTINGS_OPENAPI_USE_HOOKS);

    it('unless options.openapi is undefined and settings.openapi.useHooks is undefined.', () => {
      @ValidatePathParam('barfoo', { type: 'string' })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is undefined and settings.openapi.useHooks is false.', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'false';
      @ValidatePathParam('barfoo', { type: 'string' })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is false.', () => {
      @ValidatePathParam('barfoo', { type: 'string' }, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    function testClass(Foobar: Class) {
      const actual = getApiParameters(Foobar);
      const expected: IApiPathParameter[] = [
        {
          in: 'path',
          name: 'barfoo',
          required: true,
          schema: { type: 'string' }
        },
      ];
      deepStrictEqual(actual, expected);

      const actualResponses = getApiResponses(Foobar);
      const expectedResponses: IApiResponses = {
        400: { description: 'Bad request.' }
      };
      deepStrictEqual(actualResponses, expectedResponses);
    }

    it('if options.openapi is true (class decorator).', () => {
      @ValidatePathParam('barfoo', { type: 'string' }, { openapi: true })
      class Foobar {}

      testClass(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (class decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      @ValidatePathParam('barfoo', { type: 'string' })
      class Foobar {}

      testClass(Foobar);
    });

    function testMethod(Foobar: Class) {
      const actual = getApiParameters(Foobar, 'foo');
      const expected: IApiPathParameter[] = [
        {
          in: 'path',
          name: 'barfoo',
          required: true,
          schema: { type: 'string' }
        },
      ];
      deepStrictEqual(actual, expected);

      const actualResponses = getApiResponses(Foobar, 'foo');
      const expectedResponses: IApiResponses = {
        400: { description: 'Bad request.' }
      };
      deepStrictEqual(actualResponses, expectedResponses);
    }

    it('if options.openapi is true (method decorator).', () => {
      class Foobar {
        @ValidatePathParam('barfoo', { type: 'string' }, { openapi: true })
        foo() {}
      }

      testMethod(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (method decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      class Foobar {
        @ValidatePathParam('barfoo', { type: 'string' })
        foo() {}
      }

      testMethod(Foobar);
    });

    it('given schema is a function.', () => {
      class Foobar {
        schema = { type: 'string' };
        @ValidatePathParam('barfoo', c => c.schema, { openapi: true })
        foo() {}
      }

      const actual = getApiParameters(Foobar, 'foo');
      const expected: IApiPathParameter = {
        in: 'path',
        name: 'barfoo',
        required: true,
        schema: { type: 'string' }
      };
      if (actual === undefined) {
        throw new Error('The Api parameters metadata should be defined.');
      }
      const schemaFn = actual[0];
      if (typeof schemaFn !== 'function') {
        throw new Error('The Api parameter metadata should be a function.');
      }
      deepStrictEqual(schemaFn(new Foobar()), expected);
    });

  });

});
