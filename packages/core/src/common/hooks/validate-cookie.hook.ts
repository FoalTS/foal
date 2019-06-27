// 3p
import * as Ajv from 'ajv';

// FoalTS
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiCookieParameter } from '../../openapi';
import { getAjvInstance } from '../utils';
import { extractProperties } from './extract-properties.util';

/**
 * Hook - Validate a specific cookie against an AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the cookies request.
 * @param {{ openapi?: boolean }} [options={}] - Options to add openapi metadata
 * @returns {HookDecorator} - The hook.
 */
export function ValidateCookie(
  name: string, schema: object, options: { openapi?: boolean, required?: boolean } = {}
): HookDecorator {
  const ajv = getAjvInstance();
  const required = options.required !== false;

  function validate(ctx: Context) {
    const cookiesSchema = {
      properties: {
        [name]: schema
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

    const apiCookieParameter: IApiCookieParameter = { in: 'cookie', name, schema };
    if (required) {
      apiCookieParameter.required = required;
    }

    ApiParameter(apiCookieParameter)(target, propertyKey);
    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
