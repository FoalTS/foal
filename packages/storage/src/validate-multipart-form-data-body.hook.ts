import { getAjvInstance, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import * as Busboy from 'busboy';

export interface MultipartFormDataSchema {
  fields?: {
    [key: string]: any;
  };
  files: {
    [key: string]: { required: boolean, multiple?: boolean, uploadTo?: string }
  };
}

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    // TODO: test this line.
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

function convertStream(stream: NodeJS.ReadableStream, uploadTo?: string): Promise<any> {
  return streamToBuffer(stream);
}

export function ValidateMultipartFormDataBody(schema: MultipartFormDataSchema): HookDecorator {
  return Hook(ctx => new Promise(resolve => {
    const fields: any = {};
    const files: any = {};
    for (const name in schema.files) {
      files[name] = schema.files[name].multiple ? [] : null;
    }

    const busboy = new Busboy({ headers: ctx.request.headers });
    busboy.on('field', (name, value) => fields[name] = value);
    busboy.on('file', async (name, stream) => {
      // if (!(schema.files.hasOwnProperty(name))) {
      //   // Maybe we must consume the stream.
      //   return;
      // }
      const options = schema.files[name];

      const promise = streamToBuffer(stream);
      // const promise = convertStream(stream, options.uploadTo);

      if (options.multiple) {
        files[name].push(promise);
        return;
      }

      files[name] = promise;
    });
    busboy.on('finish', () => resolve(validate()));

    async function validate() {
      // Wait for all uploads to finish.
      // When busboy "finish" event is emitted, it means all busboy streams have ended.
      // It does not mean that other upload streams/promises have ended/been resolved.
      // TODO: if this fails, delete all the uploaded files.
      for (const name in files) {
        if (Array.isArray(files[name])) {
          files[name] = await Promise.all(files[name]);
          continue;
        }
        files[name] = await files[name];
      }

      // Validate the fields
      const ajv = getAjvInstance();
      if (schema.fields && !ajv.validate(schema.fields, fields)) {
        // TODO: Delete each uploaded file.
        return new HttpResponseBadRequest({ body: ajv.errors });
      }

      // Validate the files
      for (const name in schema.files) {
        if ((files[name] === null || files[name].length === 0) && schema.files[name].required) {
          // TODO: Delete each uploaded file.
          return new HttpResponseBadRequest({
            body: {
              error: 'MISSING_FILE',
              message: `The file "${name}" is required.`
            }
          });
        }
      }

      ctx.request.body = { fields, files };
    }

    // TODO: Use pump instead. Add a reject here? Add a reject on on('file')?
    ctx.request.pipe(busboy);
  }));
}
