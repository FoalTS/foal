// FoalTS
import { Context, Hook, HookDecorator, HttpResponseBadRequest, ServiceManager } from '../../core';
import { ApiParameter, ApiResponse, IApiHeaderParameter } from '../../openapi';
import { getAjvInstance } from '../utils';
import { isFunction } from './is-function.util';
import { ValidateFunction } from 'ajv';
import { OpenApi } from '../../core/openapi';

/**
 * Hook - Validate a specific header against an AJV schema.
 *
 * @export
 * @param {string} name - Header name.
 * @param {(object | ((controller: any) => object))} [schema={ type: 'string' }] - Schema used to
 * validate the header.
 * @param {{ openapi?: boolean, required?: boolean }} [options={}] - Options.
 * @param {boolean} [options.openapi] - Add OpenApi metadata.
 * @param {boolean} [options.required] - Specify is the header is optional.
 * @returns {HookDecorator} The hook.
 */
export function ValidateHeader(
  name: string,
  schema: object | ((controller: any) => object) = { type: 'string' },
  options: { openapi?: boolean, required?: boolean } = {}
): HookDecorator {
  const required = options.required ?? true;
  name = name.toLowerCase();
  
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
        required: required ? [ name ] : [],
        type: 'object',
      })
    }
    if (!validateSchema(ctx.request.headers)) {
      return new HttpResponseBadRequest({ headers: validateSchema.errors });
    }
  }

  const param: IApiHeaderParameter = { in: 'header', name };
  if (required) {
    param.required = required;
  }

  const openapi = [
    ApiParameter((c: any) => ({
      ...param,
      schema: isFunction(schema) ? schema(c) : schema
    })),
    ApiResponse(400, { description: 'Bad request.' })
  ]

  return Hook(validate, openapi, options);
}
