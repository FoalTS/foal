// std
import { existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';

// 3p
import { Context, createApp, createHttpResponseFile, HttpResponseOK, Post } from '@foal/core';
import { IncomingForm } from 'formidable';
import * as request from 'supertest';

// FoalTS
import { parseForm } from '../src';

describe('Upload & Download Files', () => {

  before(() => {
    if (!existsSync('uploaded')) {
      mkdirSync('uploaded');
    }
  });

  after(() => {
    if (existsSync('e2e-test')) {
      rmdirSync('e2e-test');
    }
    if (existsSync('uploaded')) {
      const files = readdirSync('uploaded');
      for (const file of files) {
        unlinkSync(join('uploaded', file));
      }
      rmdirSync('uploaded');
    }
  });

  it('should work as expected.', async () => {
    class AppController {

      @Post('/upload')
      async upload(ctx: Context) {
        const form = new IncomingForm();
        form.uploadDir = 'uploaded';
        form.keepExtensions = true;
        const { files } = await parseForm(form, ctx);

        return new HttpResponseOK(files.file1.path);
      }

      @Post('/download')
      download(ctx: Context) {
        return createHttpResponseFile({
          directory: 'uploaded',
          file: ctx.request.body.filePath,
          filename: 'download.png',
          forceDownload: true,
        });
      }

    }

    const app = createApp(AppController);

    let filePath = '';
    await request(app)
      .post('/upload')
      .attach('file1', 'e2e/test-image.png')
      .expect(200)
      .then(data => filePath = data.text);

    if (!existsSync(filePath)) {
      throw new Error(`${filePath} not found`);
    }

    const image = readFileSync('e2e/test-image.png');

    await request(app)
      .post('/download')
      .send({ filePath })
      .expect(200)
      .expect('Content-Type', 'image/png')
      .expect('Content-Length', image.length.toString())
      .expect('Content-Disposition', 'attachement; filename="download.png"')
      .expect(image);

  });

});
