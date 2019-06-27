// std
import { deepStrictEqual, strictEqual } from 'assert';

// FoalTS
import { Class, Context, getHookFunction, HttpResponseBadRequest, ServiceManager } from '../../core';
import { getApiParameters, getApiResponses, IApiHeaderParameter, IApiResponses } from '../../openapi';
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

    it('should NOT return an HttpResponseBadRequest object if the header does not exist'
        + 'and options.required is false.', () => {
      const hook = getHookFunction(ValidateHeader('foo', {}, { required: false }));
      const ctx = new Context({ headers: {} });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

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

    it('should NOT return an HttpResponseBadRequest object if the schema validates the header.', () => {
      const hook = getHookFunction(ValidateHeader('foo', { type: 'integer' }));
      const ctx = new Context({ headers: { foo: '3' } });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

    it('should NOT return an HttpResponseBadRequest object if the schema validates the header (default value).', () => {
      const hook = getHookFunction(ValidateHeader('foo'));
      const ctx = new Context({ headers: { foo: 'aaa' } });

      const response = hook(ctx, services);
      strictEqual(response, undefined);
    });

  });

  describe('should define an API specification', () => {

    afterEach(() => delete process.env.SETTINGS_OPENAPI_USE_HOOKS);

    it('unless options.openapi is undefined and settings.openapi.useHooks is undefined.', () => {
      @ValidateHeader('foobar', { type: 'string' }, { required: false })
      @ValidateHeader('barfoo', { type: 'string' })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is undefined and settings.openapi.useHooks is false.', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'false';
      @ValidateHeader('foobar', { type: 'string' }, { required: false })
      @ValidateHeader('barfoo', { type: 'string' })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is false.', () => {
      @ValidateHeader('foobar', { type: 'string' }, { openapi: false, required: false })
      @ValidateHeader('barfoo', { type: 'string' }, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    function testClass(Foobar: Class) {
      const actual = getApiParameters(Foobar);
      const expected: IApiHeaderParameter[] = [
        {
          in: 'header',
          name: 'foobar',
          schema: { type: 'string' }
        },
        {
          in: 'header',
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
      @ValidateHeader('foobar', { type: 'string' }, { openapi: true, required: false })
      @ValidateHeader('barfoo', { type: 'string' }, { openapi: true })
      class Foobar {}

      testClass(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (class decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      @ValidateHeader('foobar', { type: 'string' }, { required: false })
      @ValidateHeader('barfoo', { type: 'string' })
      class Foobar {}

      testClass(Foobar);
    });

    function testMethod(Foobar: Class) {
      const actual = getApiParameters(Foobar, 'foo');
      const expected: IApiHeaderParameter[] = [
        {
          in: 'header',
          name: 'foobar',
          schema: { type: 'string' }
        },
        {
          in: 'header',
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
        @ValidateHeader('foobar', { type: 'string' }, { openapi: true, required: false })
        @ValidateHeader('barfoo', { type: 'string' }, { openapi: true })
        foo() {}
      }

      testMethod(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (method decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      class Foobar {
        @ValidateHeader('foobar', { type: 'string' }, { required: false })
        @ValidateHeader('barfoo', { type: 'string' })
        foo() {}
      }

      testMethod(Foobar);
    });

  });

});
