// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiHeaderParameter } from '../../openapi';
import { getAjvInstance } from '../utils';

/**
 * Hook - Validate a specific header against an AJV schema.
 *
 * @export
 * @param {string} name - Header name.
 * @param {object} [schema={ type: 'string' }] - Schema used to validate the header.
 * @param {{ openapi?: boolean, required?: boolean }} [options={}] - Options.
 * @param {boolean} [options.openapi] - Add OpenApi metadata.
 * @param {boolean} [options.required] - Specify is the header is optional.
 * @returns {HookDecorator} The hook.
 */
export function ValidateHeader(
  name: string, schema: object = { type: 'string' } , options: { openapi?: boolean, required?: boolean } = {}
): HookDecorator {
  const ajv = getAjvInstance();
  const required = options.required !== false;

  function validate(ctx: Context) {
    const headersSchema = {
      properties: {
        [name]: schema
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

    const apiHeaderParameter: IApiHeaderParameter = { in: 'header', name, schema };
    if (required) {
      apiHeaderParameter.required = required;
    }

    ApiParameter(apiHeaderParameter)(target, propertyKey);
    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
