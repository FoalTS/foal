// 3p
import * as Ajv from 'ajv';

// FoalTS
import { Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiCookieParameter } from '../../openapi';
import { getAjvInstance } from '../utils';
import { extractProperties } from './extract-properties.util';

/**
 * Hook factory validating the cookies of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the cookies request.
 * @returns {HookDecorator} - The hook.
 */
export function ValidateCookies(schema: object, options: { openapi?: boolean } = {}): HookDecorator {
  if ((schema as any).type !== 'object') {
    throw new Error('ValidateCookies only accepts a schema of type "object".');
  }

  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);

  function validate(ctx: Context) {
    if (!isValid(ctx.request.cookies)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (!options.openapi) {
      return;
    }

    for (const property of extractProperties(schema)) {
      const apiCookieParameter: IApiCookieParameter = {
        in: 'cookie',
        name: property.name,
        schema: property.schema
      };
      if (property.required) {
        apiCookieParameter.required = true;
      }

      ApiParameter(apiCookieParameter)(target, propertyKey);
    }

    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
