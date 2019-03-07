import * as Ajv from 'ajv';

import { Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { getAjvInstance } from '../utils';

/**
 * Hook factory validating the headers of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the headers request.
 * @returns {HookDecorator} - The hook.
 */
export function ValidateHeaders(schema: object): HookDecorator {
  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);
  return Hook(ctx => {
    if (!isValid(ctx.request.headers)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
