// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiQueryParameter } from '../../openapi';
import { getAjvInstance } from '../utils';

/**
 * Hook - Validate a specific query parameter against an AJV schema.
 *
 * @export
 * @param {string} name - Query parameter name.
 * @param {object} [schema={ type: 'string' }] - Schema used to validate the query parameter.
 * @param {{ openapi?: boolean, required?: boolean }} [options={}] - Options.
 * @param {boolean} [options.openapi] - Add OpenApi metadata.
 * @param {boolean} [options.required] - Specify is the query is optional.
 * @returns {HookDecorator} The hook.
 */
export function ValidateQueryParam(
  name: string, schema: object = { type: 'string' } , options: { openapi?: boolean, required?: boolean } = {}
): HookDecorator {
  const ajv = getAjvInstance();
  const required = options.required !== false;

  function validate(ctx: Context) {
    const querySchema = {
      properties: {
        [name]: schema
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

    const apiQueryParameter: IApiQueryParameter = { in: 'query', name, schema };
    if (required) {
      apiQueryParameter.required = required;
    }

    ApiParameter(apiQueryParameter)(target, propertyKey);
    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
