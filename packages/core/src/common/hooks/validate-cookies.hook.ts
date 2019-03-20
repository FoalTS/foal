import * as Ajv from 'ajv';

import { Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { getAjvInstance } from '../utils';

/**
 * Hook factory validating the cookies of the request against a AJV schema.
 *
 * @export
 * @param {object} schema - Schema used to validate the cookies request.
 * @returns {HookDecorator} - The hook.
 */
export function ValidateCookies(schema: object): HookDecorator {
  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);
  return Hook(ctx => {
    if (!isValid(ctx.request.cookies)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
