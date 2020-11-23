import { Context, createHttpResponseFile, Get, HttpResponseOK, Post } from '@foal/core';
import { parseForm } from '@foal/formidable/lib/parse-form';
import { IncomingForm } from 'formidable';

export class AppController {

  @Post('/upload')
  async upload(ctx: Context) {
    const form = new IncomingForm();
    form.uploadDir = 'uploaded';
    form.keepExtensions = true;
    const { fields, files } = await parseForm(form, ctx);

    return new HttpResponseOK(files.file1);
  }

  @Get('/download')
  download() {
    return createHttpResponseFile({
      directory: 'uploaded/',
      file: 'upload_2f5a6ea0c0c16e477ef5a474ddf91f1a.png'
    });
  }

}
