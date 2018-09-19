import * as Ajv from 'ajv';

import { Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { getAjvInstance } from '../utils/get-ajv-instance';

/**
 * Hook to validate the params of the request.
 *
 * @param schema Schema used to validate the params request.
 */
export function ValidateParams(schema: object): HookDecorator {
  const ajv = getAjvInstance();
  const isValid = ajv.compile(schema);
  return Hook(ctx => {
    if (!isValid(ctx.request.params)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
