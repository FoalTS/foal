import { HttpResponseBadRequest, PreHook } from '@foal/core';
import * as Ajv from 'ajv';

const defaultInstance = new Ajv();

export function validate(schema: object, ajv = defaultInstance): PreHook {
  const isValid = ajv.compile(schema);
  return ctx => {
    if (!isValid(ctx.body)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  };
}
