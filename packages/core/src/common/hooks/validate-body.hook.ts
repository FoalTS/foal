import * as Ajv from 'ajv';

import { Hook, HookDecorator, HttpResponseBadRequest } from '../../core';
import { getAjvInstance } from '../utils/get-ajv-instance';

export function ValidateBody(schema: object, ajv = getAjvInstance()): HookDecorator {
  const isValid = ajv.compile(schema);
  return Hook(ctx => {
    if (!isValid(ctx.request.body)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
