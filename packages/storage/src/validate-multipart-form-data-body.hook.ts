// std
import { extname } from 'path';

// 3p
import { getAjvInstance, Hook, HookDecorator, HttpResponseBadRequest } from '@foal/core';
import * as Busboy from 'busboy';

// FoalTS
import { Disk } from './disk.service';

export interface MultipartFormDataSchema {
  fields?: {
    [key: string]: any;
  };
  files: {
    [key: string]: { required: boolean, multiple?: boolean, saveTo?: string }
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

export function ValidateMultipartFormDataBody(schema: MultipartFormDataSchema): HookDecorator {
  return Hook((ctx, services) => new Promise(resolve => {
    const fields: any = {};
    const files: any = {};
    for (const name in schema.files) {
      files[name] = schema.files[name].multiple ? [] : null;
    }

    let busboy: busboy.Busboy;
    try {
      busboy = new Busboy({ headers: ctx.request.headers });
    } catch (error) {
      return resolve(new HttpResponseBadRequest({ headers: {
        error: 'INVALID_MULTIPART_FORM_DATA_REQUEST',
        message: error.message
      }}));
    }
    busboy.on('field', (name, value) => fields[name] = value);
    busboy.on('file', (name, stream, filename) => {
      if (!(schema.files.hasOwnProperty(name))) {
        stream.on('data', () => {});
        // TODO: handle this error.
        stream.on('error', () => {});
        return;
      }
      const options = schema.files[name];

      const disk = services.get(Disk);
      const extension = extname(filename).replace('.', '');
      const promise = options.saveTo ? disk.write(options.saveTo, stream, { extension }) : streamToBuffer(stream);

      if (options.multiple) {
        files[name].push(promise);
        return;
      }

      files[name] = promise;
    });
    busboy.on('finish', () => resolve(validate()));

    async function validate() {
      // Wait for all saves to finish.
      // When busboy "finish" event is emitted, it means all busboy streams have ended.
      // It does not mean that other Disk streams/promises have ended/been resolved.
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
