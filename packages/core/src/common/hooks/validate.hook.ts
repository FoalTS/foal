import * as Ajv from 'ajv';

import { Hook, HookDecorator, HttpResponseBadRequest } from '../../core';

const defaultInstance = new Ajv();

export function Validate(schema: object, ajv = defaultInstance): HookDecorator {
  const isValid = ajv.compile(schema);
  return Hook(ctx => {
    if (!isValid(ctx.request.body)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
