// std
import { ValidateFunction } from 'ajv';

// FoalTS
import {
  ApiParameter,
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
 * Hook - Validate a specific path parameter against an AJV schema.
 *
 * @export
 * @param {string} name - Path parameter name.
 * @param {(object | ((controller: any) => object))} schema - Schema used to
 * validate the path parameter.
 * @param {{ openapi?: boolean }} [options={}] - Options.
 * @param {boolean} [options.openapi] - Add OpenApi metadata.
 * @returns {HookDecorator} The hook.
 */
export function ValidatePathParam(
  name: string,
  schema: object | ((controller: any) => object),
  options: { openapi?: boolean } = {}
): HookDecorator {
  let validateSchema: ValidateFunction|undefined;

  function validate(this: any, ctx: Context, services: ServiceManager) {
    if (!validateSchema) {
      const ajvSchema = isFunction(schema) ? schema(this) : schema;
      const components = services.get(OpenApi).getComponents(this);

      validateSchema = getAjvInstance().compile({
        components,
        properties: {
          [name]: ajvSchema
        },
        required: [ name ],
        type: 'object',
      });
    }

    if (!validateSchema(ctx.request.params)) {
      return new HttpResponseBadRequest({ pathParams: validateSchema.errors });
    }
  }

  const openapi = [
    ApiParameter((c: any) => ({
      in: 'path',
      name,
      required: true,
      schema: isFunction(schema) ? schema(c) : schema,
    })),
    ApiResponse(400, { description: 'Bad request.' })
  ];

  return Hook(validate, openapi, options);
}
