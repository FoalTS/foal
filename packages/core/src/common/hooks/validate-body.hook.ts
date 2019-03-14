import * as Ajv from 'ajv';

import { Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { getAjvInstance } from '../utils';

/**
 * Hook factory validating the body of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the body request.
 * @returns {HookDecorator} - The hook.
 */
export function ValidateBody(schema: object): HookDecorator {
  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);
  return Hook(ctx => {
    if (!isValid(ctx.request.body)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
