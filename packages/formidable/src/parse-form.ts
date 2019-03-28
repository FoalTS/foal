// 3p
import { Context } from '@foal/core';
import { Fields, Files, IncomingForm } from 'formidable';

export function parseForm(form: IncomingForm, ctx: Context): Promise<{ fields: Fields, files: Files }> {
  return new Promise<{ fields: Fields, files: Files }>((resolve, reject) => {
    form.parse(ctx.request, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
}
