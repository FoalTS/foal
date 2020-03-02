import { getAjvInstance, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import * as Busboy from 'busboy';

export interface MultipartFormDataSchema {
  fields?: any;
  files?: (string | string[])[];
  directory?: string;
}

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

export function ValidateMultipartFormDataBody(schema: MultipartFormDataSchema): HookDecorator {
  return Hook(ctx => new Promise(resolve => {
    const fields: any = {};
    const files: { [key: string]: any } = {};
    for (const file of schema.files || []) {
      if (Array.isArray(file)) {
        files[file[0]] = [];
      } else {
        files[file] = null;
      }
    }

    const busboy = new Busboy({ headers: ctx.request.headers });
    busboy.on('field', (fieldName, val) => fields[fieldName] = val);
    busboy.on('file', async (fieldName, file) => {
      console.log(fieldName);
      if (Array.isArray(files[fieldName])) {
        files[fieldName].push(await streamToBuffer(file));
      } else {
        files[fieldName] = await streamToBuffer(file);
      }
    });
    busboy.on('finish', () => {
      const ajv = getAjvInstance();
      if (!ajv.validate(schema.fields || {}, fields)) {
        return resolve(new HttpResponseBadRequest({ body: ajv.errors }));
      }
      for (const key in files) {
        if (files[key] === null) {
          console.log(files);
          return resolve(new HttpResponseBadRequest({
            body: {
              error: 'MISSING_FILE',
              message: `The file "${key}" is missing.`
            }
          }));
        }
      }
      ctx.request.body = { fields, files };
      resolve();
    });

    ctx.request.pipe(busboy);
  }));
}
