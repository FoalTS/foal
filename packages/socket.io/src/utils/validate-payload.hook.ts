// 3p
import { getAjvInstance } from '@foal/core';

// FoalTS
import { WebsocketContext, WebsocketHook, WebsocketHookDecorator, WebsocketErrorResponse } from '../architecture';

/**
 * Hook factory validating the request payload against a AJV schema.
 *
 * @export
 * @param {(object | ((controller: any) => object))} schema - Schema used to validate the request payload.
 * @returns {WebsocketHookDecorator}
 */
export function ValidatePayload(schema: object | ((controller: any) => object)): WebsocketHookDecorator {
  let validateSchema: any;

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