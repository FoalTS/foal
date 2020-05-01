// 3p
import { Context } from '@foal/core';

interface File {
  size: number;
  path: string;
  name: string;
  type: string;
  lastModifiedDate?: Date;
  hash?: string;

  toJSON(): any;
}

interface Fields {
  [key: string]: string|string[];
}

interface Files {
  [key: string]: File; // | File[];
}

/**
 * Promisify IncomingForm.parse.
 *
 * @export
 * @param {IncomingForm} form - The IncomingForm instance.
 * @param {Context} ctx - The Context instance.
 * @returns {Promise<{ fields: Fields, files: Files }>} The fields and files inside an object.
 */
export function parseForm(form: any, ctx: Context): Promise<{ fields: Fields, files: Files }> {
  return new Promise<{ fields: Fields, files: Files }>((resolve, reject) => {
    form.parse(ctx.request, (err: any, fields: Fields, files: Files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
}
