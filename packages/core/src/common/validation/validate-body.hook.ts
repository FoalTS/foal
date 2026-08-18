// FoalTS
import {
  ApiRequestBody,
  ApiResponse,
  Context,
  Hook,
  HookDecorator,
  HttpResponseBadRequest,
  ServiceManager
} from '../../core';
import { createObjectValidator, isFunction } from './helpers';

/**
 * Hook factory validating the body of the request against a AJV schema.
 *
 * @export
 * @param {(object | ((controller: any) => object))} schema - Schema used to validate the request body.
 * @param {{ openapi?: boolean }} [options] - Options to add openapi metadata
 * @returns {HookDecorator} - The hook.
 */
export function ValidateBody(
  schema: object | ((controller: any) => object), options?: { openapi?: boolean }
): HookDecorator {
  const validateObject = createObjectValidator(schema);

  function validate(this: any, ctx: Context, services: ServiceManager) {
    const errors = validateObject.call(this, ctx.request.body, services);
    if (errors) {
      return new HttpResponseBadRequest({ body: errors });
    }
  }

  const openapi = [
    ApiRequestBody((c: any) => ({
      content: {
        'application/json': {
          schema: isFunction(schema) ? schema(c) : schema
        }
      },
      required: true
    })),
    ApiResponse(400, { description: 'Bad request.' })
  ];

  return Hook(validate, openapi, options);
}
