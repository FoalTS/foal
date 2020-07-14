// std
import { extname } from 'path';

// 3p
import {
  ApiRequestBody, Config, getAjvInstance, Hook, HookDecorator, HttpResponseBadRequest, IApiRequestBody, IApiSchema
} from '@foal/core';
import * as Busboy from 'busboy';

// FoalTS
import { Disk } from './abstract-disk.service';

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

async function convertRejectedPromise(fn: () => Promise<void>, errCallback: () => void): Promise<{ error?: any }> {
  try {
    await fn();
  } catch (error) {
    errCallback();
    return { error };
  }
  return {};
}

const hook = (schema: MultipartFormDataSchema): HookDecorator => {
  return Hook((ctx, services) => new Promise((resolve, reject) => {
    const fields: any = {};
    const files: any = {};
    for (const name in schema.files) {
      files[name] = schema.files[name].multiple ? [] : null;
    }

    const disk = services.get(Disk as any) as Disk;

    const fileSizeLimit = Config.get2('settings.multipartRequests.fileSizeLimit', 'number');
    const fileNumberLimit = Config.get2('settings.multipartRequests.fileNumberLimit', 'number');
    let busboy: busboy.Busboy;
    try {
      busboy = new Busboy({
        headers: ctx.request.headers,
        limits: {
          fileSize: fileSizeLimit,
          files: fileNumberLimit
        }
      });
    } catch (error) {
      return resolve(new HttpResponseBadRequest({ headers: {
        error: 'INVALID_MULTIPART_FORM_DATA_REQUEST',
        message: error.message
      }}));
    }

    let sizeLimitReached: boolean|string = false;
    let numberLimitReached = false;
    let latestFileHasBeenUploaded: Promise<{ error?: any }> = Promise.resolve({});

    busboy.on('field', (name, value) => fields[name] = value);
    busboy.on('file', (name, stream, filename) => latestFileHasBeenUploaded = convertRejectedPromise(async () => {
      stream.on('limit', () => sizeLimitReached = name);

      if (!(schema.files.hasOwnProperty(name))) {
        // Ignore unexpected files
        stream.on('data', () => {});
        // TODO: Test the line below.
        // Ignore errors of unexpected files.
        stream.on('error', () => {});
        return;
      }
      const options = schema.files[name];

      const extension = extname(filename).replace('.', '');

      let file: any;
      if (options.saveTo) {
        file = await disk.write(options.saveTo, stream, { extension });
      } else {
        file = await streamToBuffer(stream);
      }

      if (options.multiple) {
        files[name].push(file);
        return;
      }

      files[name] = file;
    }, () => stream.resume()));
    busboy.on('filesLimit', () => numberLimitReached = true);
    busboy.on('finish', () => resolve(validate()));

    async function deleteUploadedFiles() {
      for (const name in files) {
        if (!schema.files[name].saveTo) {
          continue;
        }
        if (Array.isArray(files[name])) {
          await Promise.all(files[name].map(({ path }: { path: string }) => disk.delete(path)));
          continue;
        }
        if (files[name] !== null) {
          await disk.delete(files[name].path);
        }
      }
    }

    async function validate() {
      // Wait for all saves to finish.
      // When busboy "finish" event is emitted, it means all busboy streams have ended.
      // It does not mean that other Disk streams/promises have ended/been resolved.
      const { error } =  await latestFileHasBeenUploaded;

      // We can only rely upon resolved promises to detect errors in the "finish" handlers.
      // Otherwise, we would attach a "catch" handler _after_ the promise may have been rejected.
      // The code below is an example of this problem:
      //    const promise = Promise.reject("error");
      //    setTimeout(() => {
      //      promise.catch(() => console.log("The promise is caught"));
      //    }, 1000)
      if (error) {
        throw error;
      }

      if (sizeLimitReached) {
        await deleteUploadedFiles();
        return new HttpResponseBadRequest({
          body: {
            error: 'FILE_SIZE_LIMIT_REACHED',
            message: `The file "${sizeLimitReached}" is too large. The maximum file size is ${fileSizeLimit} bytes.`
          }
        });
      }

      if (numberLimitReached) {
        await deleteUploadedFiles();
        return new HttpResponseBadRequest({
          body: {
            error: 'FILE_NUMBER_LIMIT_REACHED',
            message: `Too many files updated. The maximum number of files allowed is ${fileNumberLimit}.`
          }
        });
      }

      // Validate the fields
      const ajv = getAjvInstance();
      const ajvSchema = {
        additionalProperties: false,
        properties: schema.fields,
        required: Object.keys(schema.fields || {}),
        type: 'object',
      };
      if (schema.fields && !ajv.validate(ajvSchema, fields)) {
        await deleteUploadedFiles();
        return new HttpResponseBadRequest({ body: ajv.errors });
      }

      // Validate the files
      for (const name in schema.files) {
        if ((files[name] === null || files[name].length === 0) && schema.files[name].required) {
          await deleteUploadedFiles();
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

    ctx.request.pipe(busboy);
    // TODO: Test the reject here
    busboy.on('error', reject);
  }));
};

export function ValidateMultipartFormDataBody(
  schema: MultipartFormDataSchema, options: { openapi?: boolean } = {}
): HookDecorator {
  return (target: any, propertyKey?: string) =>  {
    hook(schema)(target, propertyKey);

    if (options.openapi === false ||
      (options.openapi === undefined && !Config.get2('settings.openapi.useHooks', 'boolean'))
    ) {
      return;
    }

    const required = schema.fields ? Object.keys(schema.fields) : [];
    const properties: {
      [key: string]: IApiSchema;
    } = {
      ...schema.fields
    };

    for (const key in schema.files) {
      const file = schema.files[key];
      if (file.required) {
        required.push(key);
      }
      if (file.multiple) {
        properties[key] = {
          items: {
            format: 'binary',
            type: 'string',
          },
          type: 'array',
        };
      } else {
        properties[key] = {
          format: 'binary',
          type: 'string',
        };
      }
    }

    const requestBody: IApiRequestBody = {
      content: {
        'multipart/form-data': {
          schema: {
            properties,
            required,
            type: 'object',
          }
        }
      }
    };

    if (propertyKey) {
      ApiRequestBody(requestBody)(target, propertyKey);
    } else {
      ApiRequestBody(requestBody)(target);
    }
  };
}
