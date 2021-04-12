// 3p
import { getAjvInstance } from '@foal/core';
import { ValidateFunction } from 'ajv';

// FoalTS
import { WebsocketContext } from './websocket-context';
import { WebsocketHook, WebsocketHookDecorator } from './websocket-hooks';
import { WebsocketErrorResponse } from './websocket-responses';

export function ValidatePayload(schema: object | ((controller: any) => object)): WebsocketHookDecorator {
  let validateSchema: ValidateFunction|undefined;

  function validate(this: any, ctx: WebsocketContext) {
    if (!validateSchema) {
      const ajvSchema = typeof schema === 'function' ? schema(this) : schema;
      validateSchema = getAjvInstance().compile(ajvSchema);
    }

    if (!validateSchema(ctx.payload)) {
      return new WebsocketErrorResponse({
        code: 'VALIDATION_PAYLOAD_ERROR',
        payload: validateSchema.errors
      });
    }
  }

  return WebsocketHook(validate);
}