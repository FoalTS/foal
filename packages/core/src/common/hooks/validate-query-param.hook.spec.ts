// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Class, Context, getHookFunction, HttpResponseBadRequest, ServiceManager } from '../../core';
import { getApiParameters, getApiResponses, IApiQueryParameter, IApiResponses } from '../../openapi';
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

    it('should NOT return an HttpResponseBadRequest object if the query parameter does not exist'
        + 'and options.required is false.', () => {
      const hook = getHookFunction(ValidateQueryParam('foo', {}, { required: false }));
      const ctx = new Context({ query: {} });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

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

    it('should NOT return an HttpResponseBadRequest object if the schema validates the query parameter.', () => {
      const hook = getHookFunction(ValidateQueryParam('foo', { type: 'integer' }));
      const ctx = new Context({ query: { foo: '3' } });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
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

    afterEach(() => delete process.env.SETTINGS_OPENAPI_USE_HOOKS);

    it('unless options.openapi is undefined and settings.openapi.useHooks is undefined.', () => {
      @ValidateQueryParam('foobar', { type: 'string' }, { required: false })
      @ValidateQueryParam('barfoo', { type: 'string' })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is undefined and settings.openapi.useHooks is false.', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'false';
      @ValidateQueryParam('foobar', { type: 'string' }, { required: false })
      @ValidateQueryParam('barfoo', { type: 'string' })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is false.', () => {
      @ValidateQueryParam('foobar', { type: 'string' }, { openapi: false, required: false })
      @ValidateQueryParam('barfoo', { type: 'string' }, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    function testClass(Foobar: Class) {
      const actual = getApiParameters(Foobar);
      const expected: IApiQueryParameter[] = [
        {
          in: 'query',
          name: 'foobar',
          schema: { type: 'string' }
        },
        {
          in: 'query',
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
      @ValidateQueryParam('foobar', { type: 'string' }, { openapi: true, required: false })
      @ValidateQueryParam('barfoo', { type: 'string' }, { openapi: true })
      class Foobar {}

      testClass(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (class decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      @ValidateQueryParam('foobar', { type: 'string' }, { required: false })
      @ValidateQueryParam('barfoo', { type: 'string' })
      class Foobar {}

      testClass(Foobar);
    });

    function testMethod(Foobar: Class) {
      const actual = getApiParameters(Foobar, 'foo');
      const expected: IApiQueryParameter[] = [
        {
          in: 'query',
          name: 'foobar',
          schema: { type: 'string' }
        },
        {
          in: 'query',
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
        @ValidateQueryParam('foobar', { type: 'string' }, { openapi: true, required: false })
        @ValidateQueryParam('barfoo', { type: 'string' }, { openapi: true })
        foo() {}
      }

      testMethod(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (method decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      class Foobar {
        @ValidateQueryParam('foobar', { type: 'string' }, { required: false })
        @ValidateQueryParam('barfoo', { type: 'string' })
        foo() {}
      }

      testMethod(Foobar);
    });

  });

});
