// std
import { deepStrictEqual, doesNotThrow, notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { Class, Context, getHookFunction, HttpResponseBadRequest, ServiceManager } from '../../core';
import { OpenApi } from '../../core/openapi';
import { getApiRequestBody, getApiResponses, IApiRequestBody, IApiResponses, IApiSchema } from '../../openapi';
import { ValidateBody } from './validate-body.hook';

describe('ValidateBody', () => {

  const schema = {
    properties: {
      foo: { type: 'integer' }
    },
    type: 'object',
  };

  describe('should validate the request body and', () => {

    describe('given schema is an object', () => {

      it('should not return an HttpResponseBadRequest if ctx.request.body is validated '
          + ' by ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateBody(schema));
        const ctx = new Context({});
        ctx.request.body = {
          foo: 3
        };

        const actual = hook(ctx, new ServiceManager());
        strictEqual(actual instanceof HttpResponseBadRequest, false);
      });

      it('should return an HttpResponseBadRequest if ctx.request.body is not validated by '
          + ' ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateBody(schema));

        function context(body: any) {
          const ctx = new Context({});
          ctx.request.body = body;
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
          + 'ctx.request.body is not validated by ajv.', () => {
        const hook = getHookFunction(ValidateBody(schema));
        const ctx = new Context({});

        const actual = hook(ctx, new ServiceManager());
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          body: [
            {
              dataPath: '',
              keyword: 'type',
              message: 'should be object',
              params: { type: 'object' },
              schemaPath: '#/type',
            }
          ]
        });
      });

      it('should use the OpenAPI components to validate the request body.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {}
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              user: schema as IApiSchema
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateBody({
          $ref: '#/components/schemas/user'
        })).bind(controller);
        const ctx = new Context({
          body: {
            foo: 'hello'
          }
        });

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          body: [
            {
              dataPath: '.foo',
              keyword: 'type',
              message: 'should be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/user/properties/foo/type',
            }
          ]
        });
      });

    });

    describe('given schema is a function', () => {

      it('should not return an HttpResponseBadRequest if ctx.request.body is validated '
          + ' by ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateBody(controller => controller.schema)).bind({ schema });
        const ctx = new Context({});
        ctx.request.body = {
          foo: 3
        };

        const actual = hook(ctx, new ServiceManager());
        strictEqual(actual instanceof HttpResponseBadRequest, false);
      });

      it('should return an HttpResponseBadRequest if ctx.request.body is not validated by '
          + ' ajv for the given schema.', () => {
        const hook = getHookFunction(ValidateBody(controller => controller.schema)).bind({ schema });

        function context(body: any) {
          const ctx = new Context({});
          ctx.request.body = body;
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
          + 'ctx.request.body is not validated by ajv.', () => {
        const hook = getHookFunction(ValidateBody(controller => controller.schema)).bind({ schema });
        const ctx = new Context({});

        const actual = hook(ctx, new ServiceManager());
        ok(actual instanceof HttpResponseBadRequest);
        notStrictEqual((actual as HttpResponseBadRequest).body, undefined);
      });

      it('should use the OpenAPI components to validate the request body.', () => {
        const services = new ServiceManager();
        const openApi = services.get(OpenApi);

        class ApiController {
          schema = {
            $ref: '#/components/schemas/user'
          };
        }
        const controller = new ApiController();

        openApi.addDocument(ApiController, {
          components: {
            schemas: {
              user: schema as IApiSchema
            }
          },
          info: {
            title: 'Api',
            version: '1.0.0',
          },
          openapi: '3.0.2',
          paths: {},
        }, [ controller ]);

        const hook = getHookFunction(ValidateBody(controller => controller.schema)).bind(controller);
        const ctx = new Context({
          body: {
            foo: 'hello'
          }
        });

        const actual = hook(ctx, services);
        if (!(actual instanceof HttpResponseBadRequest)) {
          throw new Error('The hook should have returned an HttpResponseBadRequest object.');
        }
        deepStrictEqual(actual.body, {
          body: [
            {
              dataPath: '.foo',
              keyword: 'type',
              message: 'should be integer',
              params: { type: 'integer' },
              schemaPath: '#/components/schemas/user/properties/foo/type',
            }
          ]
        });
      });

    });

  });

  describe('should define an API specification', () => {

    afterEach(() => delete process.env.SETTINGS_OPENAPI_USE_HOOKS);

    it('unless options.openapi is undefined and settings.openapi.useHooks is undefined.', () => {
      @ValidateBody(schema)
      class Foobar {}

      strictEqual(getApiRequestBody(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is undefined and settings.openapi.useHooks is false.', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'false';
      @ValidateBody(schema)
      class Foobar {}

      strictEqual(getApiRequestBody(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    it('unless options.openapi is false.', () => {
      @ValidateBody(schema, { openapi: false })
      class Foobar {}

      strictEqual(getApiRequestBody(Foobar), undefined);
      strictEqual(getApiResponses(Foobar), undefined);
    });

    function testClass(Foobar: Class) {
      const actualRequestBody = getApiRequestBody(Foobar);
      const expectedRequestBody: IApiRequestBody = {
        content: {
          'application/json': { schema: schema as object }
        },
        required: true
      };
      deepStrictEqual(actualRequestBody, expectedRequestBody);

      const actualResponses = getApiResponses(Foobar);
      const expectedResponses: IApiResponses = {
        400: { description: 'Bad request.' }
      };
      deepStrictEqual(actualResponses, expectedResponses);
    }

    it('if options.openapi is true (class decorator).', () => {
      @ValidateBody(schema, { openapi: true })
      class Foobar {}

      testClass(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (class decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      @ValidateBody(schema)
      class Foobar {}

      testClass(Foobar);
    });

    function testMethod(Foobar: Class) {
      const actualRequestBody = getApiRequestBody(Foobar, 'foo');
      const expectedRequestBody: IApiRequestBody = {
        content: {
          'application/json': { schema: schema as object }
        },
        required: true
      };
      deepStrictEqual(actualRequestBody, expectedRequestBody);

      const actualResponses = getApiResponses(Foobar, 'foo');
      const expectedResponses: IApiResponses = {
        400: { description: 'Bad request.' }
      };
      deepStrictEqual(actualResponses, expectedResponses);
    }

    it('if options.openapi is true (method decorator).', () => {
      class Foobar {
        @ValidateBody(schema, { openapi: true })
        foo() {}
      }

      testMethod(Foobar);
    });

    it('if options.openapi is undefined and settings.openapi.useHooks is true (method decorator).', () => {
      process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true';
      class Foobar {
        @ValidateBody(schema)
        foo() {}
      }

      testMethod(Foobar);
    });

    it('given schema is a function.', () => {
      class Foobar {
        schema = schema;
        @ValidateBody((controller: Foobar) => controller.schema, { openapi: true })
        foo() {}
      }

      const actualDynamicRequestBody = getApiRequestBody(Foobar, 'foo');
      const expectedRequestBody: IApiRequestBody = {
        content: {
          'application/json': { schema: schema as object }
        },
        required: true
      };
      if (typeof actualDynamicRequestBody !== 'function') {
        throw new Error('The ApiRequestBody metadata should be a function.');
      }
      deepStrictEqual(actualDynamicRequestBody(new Foobar()), expectedRequestBody);
    });

  });

});
