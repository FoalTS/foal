import { HttpResponseBadRequest, ObjectType, preHook } from '@foal/core';
import * as Ajv from 'ajv';

const defaultInstance = new Ajv();

export function validate(schema: ObjectType, ajv = defaultInstance) {
  const isValid = ajv.compile(schema);
  return preHook(ctx => {
    if (!isValid(ctx.body)) {
      return new HttpResponseBadRequest(isValid.errors as Ajv.ErrorObject[]);
    }
  });
}
