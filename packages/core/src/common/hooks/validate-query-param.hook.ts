// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiQueryParameter, IApiSchema } from '../../openapi';
import { getAjvInstance } from '../utils';

/**
 * Hook - Validate a specific query parameter against an AJV schema.
 *
 * @export
 * @param {string} name - Query parameter name.
 * @param {(object | ((controller: any) => object))} [schema={ type: 'string' }] - Schema used to
 * validate the query parameter.
 * @param {{ openapi?: boolean, required?: boolean }} [options={}] - Options.
 * @param {boolean} [options.openapi] - Add OpenApi metadata.
 * @param {boolean} [options.required] - Specify is the query is optional.
 * @returns {HookDecorator} The hook.
 */
export function ValidateQueryParam(
  name: string,
  schema: object | ((controller: any) => object) = { type: 'string' },
  options: { openapi?: boolean, required?: boolean } = {}
): HookDecorator {
  const ajv = getAjvInstance();
  const required = options.required !== false;

  function validate(this: any, ctx: Context) {
    const querySchema = {
      properties: {
        [name]: typeof schema === 'function' ? schema(this) : schema
      },
      required: required ? [ name ] : [],
      type: 'object',
    };
    if (!ajv.validate(querySchema, ctx.request.query)) {
      return new HttpResponseBadRequest({ query: ajv.errors });
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (options.openapi === false || (options.openapi === undefined && !Config.get('settings.openapi.useHooks'))) {
      return;
    }

    function makeParameter(schema: IApiSchema): IApiQueryParameter {
      const result: IApiQueryParameter = { in: 'query', name, schema };
      if (required) {
        result.required = required;
      }
      return result;
    }

    const apiQueryParameter = typeof schema === 'function' ? c => makeParameter(schema(c)) : makeParameter(schema);

    ApiParameter(apiQueryParameter)(target, propertyKey);
    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
