// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Class, Context, getHookFunction, HttpResponseBadRequest, ServiceManager } from '../../core';
import { getApiParameters, getApiResponses, IApiCookieParameter, IApiResponses } from '../../openapi';
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

  });

  describe('should define an API specification', () => {

    afterEach(() => delete process.env.SETTINGS_OPENAPI_USE_HOOKS);

    it('unless options.openapi is undefined and settings.openapi.useHooks is undefined.', () => {
      @ValidateCookie('foobar', { type: 'string' }, { required: false })
      @ValidateCookie('barfoo', { type: 'string' })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is undefined and settings.openapi.useHooks is false.', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'false';
      @ValidateCookie('foobar', { type: 'string' }, { required: false })
      @ValidateCookie('barfoo', { type: 'string' })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is false.', () => {
      @ValidateCookie('foobar', { type: 'string' }, { openapi: false, required: false })
      @ValidateCookie('barfoo', { type: 'string' }, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    function testClass(Foobar: Class) {
      const actual = getApiParameters(Foobar);
      const expected: IApiCookieParameter[] = [
        {
          in: 'cookie',
          name: 'foobar',
          schema: { type: 'string' }
        },
        {
          in: 'cookie',
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
      @ValidateCookie('foobar', { type: 'string' }, { openapi: true, required: false })
      @ValidateCookie('barfoo', { type: 'string' }, { openapi: true })
      class Foobar {}

      testClass(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (class decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      @ValidateCookie('foobar', { type: 'string' }, { required: false })
      @ValidateCookie('barfoo', { type: 'string' })
      class Foobar {}

      testClass(Foobar);
    });

    function testMethod(Foobar: Class) {
      const actual = getApiParameters(Foobar, 'foo');
      const expected: IApiCookieParameter[] = [
        {
          in: 'cookie',
          name: 'foobar',
          schema: { type: 'string' }
        },
        {
          in: 'cookie',
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
        @ValidateCookie('foobar', { type: 'string' }, { openapi: true, required: false })
        @ValidateCookie('barfoo', { type: 'string' }, { openapi: true })
        foo() {}
      }

      testMethod(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (method decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      class Foobar {
        @ValidateCookie('foobar', { type: 'string' }, { required: false })
        @ValidateCookie('barfoo', { type: 'string' })
        foo() {}
      }

      testMethod(Foobar);
    });

  });

});
