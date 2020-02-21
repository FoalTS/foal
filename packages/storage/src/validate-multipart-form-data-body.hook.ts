import { getAjvInstance, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import * as Busboy from 'busboy';

export interface MultipartFormDataSchema {
  fields?: any;
  files?: (string | string[])[];
  directory?: string;
}

export function ValidateMultipartFormDataBody(schema: MultipartFormDataSchema): HookDecorator {
  return Hook(ctx => new Promise(resolve => {
    const fields: any = {};

    const busboy = new Busboy({ headers: ctx.request.headers });
    busboy.on('field', (fieldName, val) => fields[fieldName] = val);
    busboy.on('finish', () => {
      const ajv = getAjvInstance();
      if (!ajv.validate(schema.fields, fields)) {
        return resolve(new HttpResponseBadRequest({ body: ajv.errors }));
      }
      ctx.request.body = { fields };
      resolve();
    });

    ctx.request.pipe(busboy);
  }));
}
