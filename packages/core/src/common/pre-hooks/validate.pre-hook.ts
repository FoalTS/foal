import * as Ajv from 'ajv';

import { HttpResponseBadRequest, PreHook } from '../../core';

const defaultInstance = new Ajv();

export function validate(schema: object, ajv = defaultInstance): PreHook {
  const isValid = ajv.compile(schema);
  return ctx => {
    if (!isValid(ctx.request.body)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  };
}
