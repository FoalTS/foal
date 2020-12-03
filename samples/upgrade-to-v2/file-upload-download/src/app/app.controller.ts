import { Context, dependency, Get, HttpResponseOK, Post } from '@foal/core';
import { Disk, ValidateMultipartFormDataBody } from '@foal/storage';

export class AppController {

  @dependency
  disk: Disk;

  @Post('/upload')
  @ValidateMultipartFormDataBody({
    files: {
      file1: { required: true, saveTo: '.' },
    }
  })
  async upload(ctx: Context) {
    const { fields, files } = ctx.request.body;

    return new HttpResponseOK(files.file1);
  }

  @Get('/download')
  download() {
    return this.disk.createHttpResponse('Bkzi9dvrnb0vEM4dNDq74n38yvJu_tydY45KHIaPI48.png');
  }

}
