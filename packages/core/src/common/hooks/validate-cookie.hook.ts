// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiCookieParameter, IApiSchema } from '../../openapi';
import { getAjvInstance } from '../utils';
import { isFunction } from './is-function.util';

/**
 * Hook - Validate a specific cookie against an AJV schema.
 *
 * @export
 * @param {string} name - Cookie name.
 * @param {(object | ((controller: any) => object))} [schema={ type: 'string' }] - Schema used to
 * validate the cookie.
 * @param {{ openapi?: boolean, required?: boolean }} [options={}] - Options.
 * @param {boolean} [options.openapi] - Add OpenApi metadata.
 * @param {boolean} [options.required] - Specify is the cookie is optional.
 * @returns {HookDecorator} The hook.
 */
export function ValidateCookie(
  name: string,
  schema: object | ((controller: any) => object) = { type: 'string' } ,
  options: { openapi?: boolean, required?: boolean } = {}
): HookDecorator {
  const ajv = getAjvInstance();
  const required = options.required !== false;

  function validate(this: any, ctx: Context) {
    const cookiesSchema = {
      properties: {
        [name]: isFunction(schema) ? schema(this) : schema
      },
      required: required ? [ name ] : [],
      type: 'object',
    };
    if (!ajv.validate(cookiesSchema, ctx.request.cookies)) {
      return new HttpResponseBadRequest({ cookies: ajv.errors });
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (options.openapi === false || (options.openapi === undefined && !Config.get('settings.openapi.useHooks'))) {
      return;
    }

    function makeParameter(schema: IApiSchema): IApiCookieParameter {
      const result: IApiCookieParameter = { in: 'cookie', name, schema };
      if (required) {
        result.required = required;
      }
      return result;
    }

    const apiCookieParameter = isFunction(schema) ? (c: any) => makeParameter(schema(c)) : makeParameter(schema);

    ApiParameter(apiCookieParameter)(target, propertyKey);
    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
