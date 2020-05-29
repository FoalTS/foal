// FoalTS
import { ApiParameter, ApiResponse, IApiHeaderParameter } from '../..';
import { Config, Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { getAjvInstance } from '../utils';
import { extractProperties } from './extract-properties.util';

/**
 * Hook factory validating the headers of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the headers request.
 * @param {{ openapi?: boolean }} [options={}] - Options to add openapi metadata
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
      return new HttpResponseBadRequest({ headers: isValid.errors });
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (options.openapi === false ||
      (options.openapi === undefined && !Config.get('settings.openapi.useHooks', 'boolean'))
    ) {
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

      ApiParameter(apiHeaderParameter)(target, propertyKey);
    }

    ApiResponse(400, { description: 'Bad request.' })(target, propertyKey);
  };
}
