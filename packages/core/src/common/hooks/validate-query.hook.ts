import * as Ajv from 'ajv';

import { Hook, HookDecorator, HttpResponseBadRequest } from '../../core';

const defaultInstance = new Ajv();

export function ValidateQuery(schema: object, ajv = defaultInstance): HookDecorator {
  const isValid = ajv.compile(schema);
  return Hook(ctx => {
    if (!isValid(ctx.request.query)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
