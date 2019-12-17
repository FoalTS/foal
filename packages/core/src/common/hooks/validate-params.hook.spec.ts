// std
import { deepStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { Class, Context, getHookFunction, HttpResponseBadRequest, ServiceManager } from '../../core';
import { getApiParameters, getApiResponses, IApiPathParameter, IApiResponses } from '../../openapi';
import { ValidateParams } from './validate-params.hook';

describe('ValidateParams', () => {

  describe('should validate the params and', () => {

    const schema = {
      properties: {
        foo: { type: 'integer' }
      },
      type: 'object',
    };

    it('should throw an error if the schema is not of "type" object (JSON schema).', () => {
      try {
        ValidateParams({ type: 'string' });
        throw new Error('An error should have been thrown.');
      } catch (error) {
        strictEqual(error.message, 'ValidateParams only accepts a schema of type "object".');
      }
    });

    it('should not return an HttpResponseBadRequest if ctx.request.params is validated '
        + ' by ajv for the given schema.', () => {
      const hook = getHookFunction(ValidateParams(schema));
      const ctx = new Context({});
      ctx.request.params = {
        foo: 3
      } as any;

      const actual = hook(ctx, new ServiceManager());
      strictEqual(actual instanceof HttpResponseBadRequest, false);
    });

    it('should return an HttpResponseBadRequest if ctx.request.params is not validated by '
        + ' ajv for the given schema.', () => {
      const hook = getHookFunction(ValidateParams(schema));

      function context(params: any) {
        const ctx = new Context({});
        ctx.request.params = params;
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
        + 'ctx.request.params is not validated by ajv.', () => {
      const hook = getHookFunction(ValidateParams(schema));
      const ctx = new Context({ params: { foo: 'xxx' } });

      const actual = hook(ctx, new ServiceManager());
      if (!(actual instanceof HttpResponseBadRequest)) {
        throw new Error('The hook should have returned an HttpResponseBadRequest object.');
      }

      deepStrictEqual(actual.body, {
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

  });

  describe('should define an API specification', () => {

    afterEach(() => delete process.env.SETTINGS_OPENAPI_USE_HOOKS);

    const schema = {
      properties: {
        barfoo: { type: 'string' },
        foobar: { type: 'string' },
      },
      required: [ 'barfoo' ],
      type: 'object',
    };

    it('unless options.openapi is undefined and settings.openapi.useHooks is undefined.', () => {
      @ValidateParams(schema)
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is undefined and settings.openapi.useHooks is false.', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'false';
      @ValidateParams(schema)
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is false.', () => {
      @ValidateParams(schema, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    function testClass(Foobar: Class) {
      const actual = getApiParameters(Foobar);
      const expected: IApiPathParameter[] = [
        {
          in: 'path',
          name: 'foobar',
          required: true,
          schema: { type: 'string' }
        },
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
      @ValidateParams(schema, { openapi: true })
      class Foobar {}

      testClass(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (class decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      @ValidateParams(schema)
      class Foobar {}

      testClass(Foobar);
    });

    function testMethod(Foobar: Class) {
      const actual = getApiParameters(Foobar, 'foo');
      const expected: IApiPathParameter[] = [
        {
          in: 'path',
          name: 'foobar',
          required: true,
          schema: { type: 'string' }
        },
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
        @ValidateParams(schema, { openapi: true })
        foo() {}
      }

      testMethod(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (method decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      class Foobar {
        @ValidateParams(schema)
        foo() {}
      }

      testMethod(Foobar);
    });

  });

});
