// 3p
import * as Ajv from 'ajv';

// FoalTS
import { Context, Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { ApiRequestBody, IApiRequestBody } from '../../openapi';
import { getAjvInstance } from '../utils';

/**
 * Hook factory validating the body of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the body request.
 * @returns {HookDecorator} - The hook.
 */
export function ValidateBody(schema: object, options: { openapi?: boolean } = {}): HookDecorator {
  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);

  function validate(ctx: Context) {
    if (!isValid(ctx.request.body)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  }

  return (target: any, propertyKey?: string) =>  {
    Hook(validate)(target, propertyKey);

    if (!options.openapi) {
      return;
    }

    const requestBody: IApiRequestBody = {
      content: {
        'application/json': { schema }
      },
      required: true
    };

    if (propertyKey) {
      ApiRequestBody(requestBody)(target, propertyKey);
    } else {
      ApiRequestBody(requestBody)(target);
    }
  };
}
