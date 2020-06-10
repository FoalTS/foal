// FoalTS
import { ValidateFunction } from 'ajv';
import { Context, Hook, HookDecorator, HttpResponseBadRequest, ServiceManager } from '../../core';
import { OpenApi } from '../../core/openapi';
import { ApiRequestBody, ApiResponse } from '../../openapi';
import { getAjvInstance } from '../utils';
import { isFunction } from './is-function.util';

/**
 * Hook factory validating the body of the request against a AJV schema.
 *
 * @export
 * @param {(object | ((controller: any) => object))} schema - Schema used to validate the body request.
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
