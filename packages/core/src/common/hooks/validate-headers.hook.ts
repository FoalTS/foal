// 3p
import * as Ajv from 'ajv';

// FoalTS
import { ApiParameter, IApiHeaderParameter } from '../..';
import { Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { getAjvInstance } from '../utils';
import { extractProperties } from './extract-properties.util';

/**
 * Hook factory validating the headers of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the headers request.
 * @returns {HookDecorator} - The hook.
 */
export function ValidateHeaders(schema: object, options: { openapi?: boolean } = {}): HookDecorator {
  if ((schema as any).type !== 'object') {
    throw new Error('ValidateHeaders only accepts a schema of type "object".');
  }

  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);

  function validate(ctx: Context) {
    if (!isValid(ctx.request.headers)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (!options.openapi) {
      return;
    }

    for (const property of extractProperties(schema)) {
      const apiHeaderParameter: IApiHeaderParameter = {
        in: 'header',
        name: property.name,
        schema: property.schema
      };
      if (property.required) {
        apiHeaderParameter.required = true;
      }
      if (propertyKey) {
        ApiParameter(apiHeaderParameter)(target, propertyKey);
      } else {
        ApiParameter(apiHeaderParameter)(target);
      }
    }
  };
}
