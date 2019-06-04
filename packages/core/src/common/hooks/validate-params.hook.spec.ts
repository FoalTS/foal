// std
import { deepStrictEqual, notStrictEqual, ok, strictEqual } from 'assert';

// FoalTS
import { Context, getHookFunction, HttpResponseBadRequest, ServiceManager } from '../../core';
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
      };

      const actual = hook(ctx, new ServiceManager());
      strictEqual(actual instanceof HttpResponseBadRequest, false);
    });

    it('should return an HttpResponseBadRequest if ctx.request.params is not validated by '
        + ' ajv for the given schema.', () => {
      const hook = getHookFunction(ValidateParams(schema));

      function context(params) {
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
      const ctx = new Context({});

      const actual = hook(ctx, new ServiceManager());
      ok(actual instanceof HttpResponseBadRequest);
      notStrictEqual((actual as HttpResponseBadRequest).body, undefined);
    });

  });

  describe('should define an API specification', () => {

    const schema = {
      properties: {
        barfoo: { type: 'string' },
        foobar: { type: 'string' },
      },
      required: [ 'barfoo' ],
      type: 'object',
    };

    it('unless options.openapi is undefined.', () => {
      @ValidateParams(schema)
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
    });

    it('unless options.openapi is false.', () => {
      @ValidateParams(schema, { openapi: false })
      class Foobar {}

      strictEqual(getApiParameters(Foobar), undefined);
    });

    it('if options.openapi is true (class decorator).', () => {
      @ValidateParams(schema, { openapi: true })
      class Foobar {}

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
    });

    it('if options.openapi is true (method decorator).', () => {
      class Foobar {
        @ValidateParams(schema, { openapi: true })
        foo() {}
      }

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
    });

  });

});
