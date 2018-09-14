import * as Ajv from 'ajv';

import { Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { getAjvInstance } from '../utils/get-ajv-instance';

export function ValidateQuery(schema: object, ajv = getAjvInstance()): HookDecorator {
  const isValid = ajv.compile(schema);
  return Hook(ctx => {
    if (!isValid(ctx.request.query)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
