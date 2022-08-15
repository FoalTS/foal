// 3p
import { ValidateFunction } from 'ajv';

// FoalTS
import {
  ApiRequestBody,
  ApiResponse,
  Context,
  Hook,
  HookDecorator,
  HttpResponseBadRequest,
  OpenApi,
  ServiceManager
} from '../../core';
import { getAjvInstance } from './get-ajv-instance';
import { isFunction } from './helpers';

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
  let validateSchema: ValidateFunction|undefined;

  function validate(this: any, ctx: Context, services: ServiceManager) {
    if (!validateSchema) {
      const ajvSchema = isFunction(schema) ? schema(this) : schema;
      const components = services.get(OpenApi).getComponents(this);

      validateSchema = getAjvInstance().compile({
        ...ajvSchema,
        components
      });
    }

    if (!validateSchema(ctx.request.body)) {
      return new HttpResponseBadRequest({ body: validateSchema.errors });
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
