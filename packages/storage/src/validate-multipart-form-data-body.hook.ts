// std
import { extname } from 'path';
import { finished, Readable } from 'stream';
import { promisify } from 'util';

// 3p
import {
  ApiRequestBody,
  Config,
  Context,
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
import { File } from './file';

export interface MultipartFormDataSchema {
  fields?: {
    type: 'object',
    properties: {
      [key: string]: any;
    }
    [key: string]: any;
  };
  files: {
    [key: string]: { required: boolean, multiple?: boolean, saveTo?: string }
  };
}

async function convertRejectedPromise(fn: () => Promise<void>, errCallback: () => void): Promise<{ error?: any }> {
  try {
    await fn();
  } catch (error: any) {
    errCallback();
    return { error };
  }
  return {};
}

export function ValidateMultipartFormDataBody(
  filesSchema: MultipartFormDataSchema['files'],
  fieldsSchema: MultipartFormDataSchema['fields'] = { type: 'object', properties: {} },
  options: { openapi?: boolean } = {}
): HookDecorator {

  async function hook(ctx: Context, services: ServiceManager) {
    const fields: any = {};
    const files: any = {};
    for (const name in filesSchema) {
      files[name] = filesSchema[name].multiple ? [] : null;
    }

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
    let latestFileHasBeenUploaded: Promise<{ error?: any }> = Promise.resolve({});

    busboy.on('field', (name: string, value: string) => fields[name] = value);
    // tslint:disable-next-line: max-line-length
    busboy.on('file', (name: string, stream: Readable, info: { filename: string, encoding: string, mimeType: string }) => {
      const { filename, encoding, mimeType } = info;
      latestFileHasBeenUploaded = convertRejectedPromise(async () => {
        stream.on('limit', () => sizeLimitReached = name);

        if (!(filesSchema.hasOwnProperty(name))) {
          // Ignore unexpected files
          stream.on('data', () => { });
          // TODO: Test the line below.
          // Ignore errors of unexpected files.
          stream.on('error', () => { });
          return;
        }
        const options = filesSchema[name];

        const extension = extname(filename).replace('.', '');

        let path: string | undefined;
        let buffer: Buffer | undefined;
        if (options.saveTo) {
          path = (await disk.write(options.saveTo, stream, { extension })).path;
        } else {
          buffer = await streamToBuffer(stream);
        }
        const file = new File({
          buffer,
          encoding,
          filename,
          mimeType,
          path,
        });

        if (options.multiple) {
          files[name].push(file);
          return;
        }

        files[name] = file;
      }, () => stream.resume());
    });
    busboy.on('filesLimit', () => numberLimitReached = true);

    ctx.request.pipe(busboy);

    await promisify(finished)(busboy);

    async function deleteUploadedFiles() {
      for (const name in files) {
        if (!filesSchema[name].saveTo) {
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

    // Wait for all saves to finish.
    // When busboy "finish" event is emitted, it means all busboy streams have ended.
    // It does not mean that other Disk streams/promises have ended/been resolved.
    const { error } = await latestFileHasBeenUploaded;

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
    if (!ajv.validate(fieldsSchema, fields)) {
      await deleteUploadedFiles();
      return new HttpResponseBadRequest({ body: ajv.errors });
    }

    // Validate the files
    for (const name in filesSchema) {
      if ((files[name] === null || files[name].length === 0) && filesSchema[name].required) {
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
