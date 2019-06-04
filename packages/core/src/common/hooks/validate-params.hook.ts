import * as Ajv from 'ajv';

import { Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiParameter, ApiResponse, IApiPathParameter } from '../../openapi';
import { getAjvInstance } from '../utils';
import { extractProperties } from './extract-properties.util';

/**
 * Hook factory validating the params of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the params request.
 * @returns {HookDecorator} - The hook.
 */
export function ValidateParams(schema: object, options: { openapi?: boolean } = {}): HookDecorator {
  if ((schema as any).type !== 'object') {
    throw new Error('ValidateParams only accepts a schema of type "object".');
  }

  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);

  function validate(ctx: Context) {
    if (!isValid(ctx.request.params)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (!options.openapi) {
      return;
    }

    for (const property of extractProperties(schema)) {
      const apiPathParameter: IApiPathParameter = {
        in: 'path',
        name: property.name,
        required: true,
        schema: property.schema
      };

      ApiParameter(apiPathParameter)(target, propertyKey);
    }

    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
