// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiHeaderParameter, IApiSchema } from '../../openapi';
import { getAjvInstance } from '../utils';
import { isFunction } from './is-function.util';

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
  const ajv = getAjvInstance();
  const required = options.required !== false;
  name = name.toLowerCase();

  function validate(this: any, ctx: Context) {
    const headersSchema = {
      properties: {
        [name]: isFunction(schema) ? schema(this) : schema
      },
      required: required ? [ name ] : [],
      type: 'object',
    };
    if (!ajv.validate(headersSchema, ctx.request.headers)) {
      return new HttpResponseBadRequest({ headers: ajv.errors });
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (options.openapi === false || (options.openapi === undefined && !Config.get('settings.openapi.useHooks'))) {
      return;
    }

    function makeParameter(schema: IApiSchema): IApiHeaderParameter {
      const result: IApiHeaderParameter = { in: 'header', name, schema };
      if (required) {
        result.required = required;
      }
      return result;
    }

    const apiHeaderParameter = isFunction(schema) ? (c: any) => makeParameter(schema(c)) : makeParameter(schema);

    ApiParameter(apiHeaderParameter)(target, propertyKey);
    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
