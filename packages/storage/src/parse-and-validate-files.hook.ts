// std
import { extname } from 'path';
import { finished, Readable } from 'stream';
import { promisify } from 'util';

// 3p
import {
  ApiRequestBody,
  Config,
  Context,
  File,
  getAjvInstance,
  Hook,
  HookDecorator,
  HttpResponseBadRequest,
  IApiRequestBody,
  IApiSchema,
  ServiceManager,
  streamToBuffer
} from '@foal/core';
import * as createBusboy from 'busboy';

// FoalTS
import { Disk } from './disk.service';

export interface FilesSchema {
  [key: string]: { required: boolean, multiple?: boolean, saveTo?: string }
}

export interface FieldsSchema {
  type: 'object',
  properties: {
    [key: string]: any;
  }
  [key: string]: any;
}

export function ParseAndValidateFiles(
  filesSchema: FilesSchema,
  fieldsSchema: FieldsSchema = { type: 'object', properties: {} },
  options: { openapi?: boolean } = {}
): HookDecorator {

  async function hook(ctx: Context, services: ServiceManager) {
    const disk = services.get(Disk);

    const fileSizeLimit = Config.get('settings.multipartRequests.fileSizeLimit', 'number');
    const fileNumberLimit = Config.get('settings.multipartRequests.fileNumberLimit', 'number');
    let busboy: any;
    try {
      busboy = createBusboy({
        headers: ctx.request.headers,
        limits: {
          fileSize: fileSizeLimit,
          files: fileNumberLimit
        }
      });
    } catch (error: any) {
      return new HttpResponseBadRequest({
        headers: {
          error: 'INVALID_MULTIPART_FORM_DATA_REQUEST',
          message: error.message
        }
      });
    }

    let sizeLimitReached: boolean | string = false;
    let numberLimitReached = false;
    const uploads: Promise<{ error?: Error }>[] = [];

    busboy.on('field', (name: string, value: string) => ctx.request.body[name] = value);
    busboy.on('file', (name: string, stream: Readable, info: { filename: string|undefined, encoding: string, mimeType: string }) => {
      const { filename, encoding, mimeType } = info;

      if (!(name in filesSchema)) {
        stream.resume();
        return;
      }

      stream.on('limit', () => sizeLimitReached = name);

      uploads.push(new Promise(async resolve => {
        try {
          const { saveTo } = filesSchema[name];

          const extension = extname(filename || '').replace('.', '');

          const file = new File({
            buffer: saveTo === undefined ? await streamToBuffer(stream) : undefined,
            encoding,
            filename,
            mimeType,
            path: saveTo !== undefined ? (await disk.write(saveTo, stream, { extension })).path : undefined,
          });

          ctx.files.push(name, file);
          resolve({});
        } catch (error: any) {
          stream.resume();
          resolve({ error });
        }
      }));
    });
    busboy.on('filesLimit', () => numberLimitReached = true);

    ctx.request.pipe(busboy);

    await promisify(finished)(busboy);

    async function deleteUploadedFiles() {
      await Promise.allSettled(ctx.files.getAll().map(({ path }) => path && disk.delete(path)));
    }

    // Wait for all saves to finish.
    // When busboy "finish" event is emitted, it means all busboy streams have ended.
    // It does not mean that other Disk streams/promises have ended/been resolved.
    const errors = (await Promise.all(uploads))
      .filter(({ error }) => !!error)
      .map(({ error }) => error);

    // We can only rely upon resolved promises to detect errors in the "finish" handlers.
    // Otherwise, we would attach a "catch" handler _after_ the promise may have been rejected.
    // The code below is an example of this problem:
    //    const promise = Promise.reject("error");
    //    setTimeout(() => {
    //      promise.catch(() => console.log("The promise is caught"));
    //    }, 1000)
    if (errors.length > 0) {
      throw errors[0];
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
    if (!ajv.validate(fieldsSchema, ctx.request.body)) {
      await deleteUploadedFiles();
      return new HttpResponseBadRequest({ body: ajv.errors });
    }

    // Validate the files
    for (const name in filesSchema) {
      if (filesSchema[name].required && ctx.files.get(name).length === 0) {
        await deleteUploadedFiles();
        return new HttpResponseBadRequest({
          body: {
            error: 'MISSING_FILE',
            message: `The file "${name}" is required.`
          }
        });
      }
      if (!filesSchema[name].multiple && ctx.files.get(name).length > 1) {
        await deleteUploadedFiles();
        return new HttpResponseBadRequest({
          body: {
            error: 'MULTIPLE_FILES_NOT_ALLOWED',
            message: `Uploading multiple "${name}" files is not allowed.`
          }
        });
      }
    }
  }

  const openApiSchema: IApiSchema = {
    ...fieldsSchema,
    required: fieldsSchema.required ? [ ...fieldsSchema.required ] : [],
    properties: { ...fieldsSchema.properties }
  }

  for (const key in filesSchema) {
    const file = filesSchema[key];
    if (file.required) {
      openApiSchema.required!.push(key);
    }
    if (file.multiple) {
      openApiSchema.properties![key] = {
        items: {
          format: 'binary',
          type: 'string',
        },
        type: 'array',
      };
    } else {
      openApiSchema.properties![key] = {
        format: 'binary',
        type: 'string',
      };
    }
  }

  const requestBody: IApiRequestBody = {
    content: {
      'multipart/form-data': {
        schema: openApiSchema
      }
    }
  };

  const openapi = [
    ApiRequestBody(requestBody)
  ];

  return Hook(hook, openapi, options);
}
