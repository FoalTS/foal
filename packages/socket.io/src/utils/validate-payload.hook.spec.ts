// std
import { ok, strictEqual, deepStrictEqual } from 'assert';

// 3p
import { ServiceManager } from '@foal/core';

// FoalTS
import { ValidatePayload } from './validate-payload.hook';
import { getWebsocketHookFunction, WebsocketContext, WebsocketErrorResponse } from '../architecture';

describe('ValidatePayload', () => {

  const schema = {
    properties: {
      foo: { type: 'integer' }
    },
    type: 'object',
  };

  describe('should validate the payload and', () => {

    describe('given schema is an object', () => {

      it('should not return a WebsocketErrorResponse if the payload is validated '
          + ' by ajv for the given schema.', () => {
        const hook = getWebsocketHookFunction(ValidatePayload(schema));
        const ctx = new WebsocketContext('default event', {
          foo: 3
        });

        const actual = hook(ctx, new ServiceManager());
        strictEqual(actual instanceof WebsocketErrorResponse, false);
      });

      it('should return a WebsocketErrorResponse if the payload is not validated by '
          + ' ajv for the given schema.', () => {
        const hook = getWebsocketHookFunction(ValidatePayload(schema));

        function context(payload: any) {
          return new WebsocketContext('default event', payload);
        }

        ok(hook(context(null), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context(undefined), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context('foo'), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context(3), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context(true), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context({ foo: 'a' }), new ServiceManager()) instanceof WebsocketErrorResponse);
      });

      it('should return a WebsocketErrorResponse with a defined `payload` property if '
          + 'the payload is not validated by ajv.', () => {
        const hook = getWebsocketHookFunction(ValidatePayload(schema));
        const ctx = new WebsocketContext('default event', undefined);

        const actual = hook(ctx, new ServiceManager());
        if (!(actual instanceof WebsocketErrorResponse)) {
          throw new Error('The hook should have returned a WebsocketErrorResponse object.');
        }
        deepStrictEqual(actual.payload, {
          code: 'VALIDATION_PAYLOAD_ERROR',
          payload: [
            {
              instancePath: '',
              keyword: 'type',
              message: 'must be object',
              params: { type: 'object' },
              schemaPath: '#/type',
            }
          ]
        });
      });

    });

    describe('given schema is a function', () => {

      it('should not return a WebsocketErrorResponse if the payload is validated '
          + ' by ajv for the given schema.', () => {
        const hook = getWebsocketHookFunction(ValidatePayload(controller => controller.schema)).bind({ schema });
        const ctx = new WebsocketContext('default event', {
          foo: 3
        });

        const actual = hook(ctx, new ServiceManager());
        strictEqual(actual instanceof WebsocketErrorResponse, false);
      });

      it('should return a WebsocketErrorResponse if the payload is not validated by '
          + ' ajv for the given schema.', () => {
        const hook = getWebsocketHookFunction(ValidatePayload(controller => controller.schema)).bind({ schema });

        function context(body: any) {
          return new WebsocketContext('default event', body);
        }

        ok(hook(context(null), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context(undefined), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context('foo'), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context(3), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context(true), new ServiceManager()) instanceof WebsocketErrorResponse);
        ok(hook(context({ foo: 'a' }), new ServiceManager()) instanceof WebsocketErrorResponse);
      });

      it('should return a WebsocketErrorResponse with a defined `payload` property if '
          + 'the payload is not validated by ajv.', () => {
        const hook = getWebsocketHookFunction(ValidatePayload(controller => controller.schema)).bind({ schema });
        const ctx = new WebsocketContext('default event', undefined);

        const actual = hook(ctx, new ServiceManager());
        if (!(actual instanceof WebsocketErrorResponse)) {
          throw new Error('The hook should have returned a WebsocketErrorResponse object.');
        }
        deepStrictEqual(actual.payload, {
          code: 'VALIDATION_PAYLOAD_ERROR',
          payload: [
            {
              instancePath: '',
              keyword: 'type',
              message: 'must be object',
              params: { type: 'object' },
              schemaPath: '#/type',
            }
          ]
        });
      });

    });

  });

});