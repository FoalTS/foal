import * as Ajv from 'ajv';

import { Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiQueryParameter } from '../../openapi';
import { getAjvInstance } from '../utils';
import { extractProperties } from './extract-properties.util';

/**
 * Hook factory validating the query of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the query request.
 * @returns {HookDecorator} - The hook.
 */
export function ValidateQuery(schema: object, options: { openapi?: boolean } = {}): HookDecorator {
  if ((schema as any).type !== 'object') {
    throw new Error('ValidateQuery only accepts a schema of type "object".');
  }

  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);

  function validate(ctx: Context) {
    if (!isValid(ctx.request.query)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (!options.openapi) {
      return;
    }

    for (const property of extractProperties(schema)) {
      const apiQueryParameter: IApiQueryParameter = {
        in: 'query',
        name: property.name,
        schema: property.schema
      };
      if (property.required) {
        apiQueryParameter.required = true;
      }

      ApiParameter(apiQueryParameter)(target, propertyKey);
    }

    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
