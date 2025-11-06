// std
import { strictEqual } from 'assert';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';

// 3p
import * as request from 'supertest';

// FoalTS
import { Context, Post, File, HttpResponseOK, createApp } from '@foal/core';
import { ParseAndValidateFiles } from '@foal/storage';

describe('Feature: Using buffers in file uploads', () => {

  it('Example: A simple example.', async () => {

    let actualProfileBuffer: Buffer|undefined;
    let actualImagesFiles: File[]|undefined;

    /* ======================= DOCUMENTATION BEGIN ======================= */


    class UserController {

      @Post('/profile')
      @ParseAndValidateFiles({
        profile: { required: true },
        images: { required: false, multiple: true }
      })
      uploadProfilePhoto(ctx: Context) {
        const { buffer } = ctx.files.get('profile')[0];
        const files = ctx.files.get('images');
        // tslint:disable-next-line:no-unused-variable
        for (const file of files) {
          // Do something with file.buffer
        }
        /* ======================= DOCUMENTATION END ========================= */
        actualProfileBuffer = buffer;
        actualImagesFiles = files;
        return new HttpResponseOK();
        /* ======================= DOCUMENTATION BEGIN ======================= */
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(UserController);

    const path1 = join(process.cwd(), './assets/common/file-storage/upload-and-download-files/image.test.png');
    const path2 = join(process.cwd(), './assets/common/file-storage/upload-and-download-files/image.test2.png');

    await request(app)
      .post('/profile')
      .attach('profile', createReadStream(path1))
      .attach('images', createReadStream(path1))
      .attach('images', createReadStream(path2))
      .expect(200);

    if (!actualProfileBuffer) {
      throw new Error('actualProfileBuffer is not defined.');
    }

    if (!actualImagesFiles) {
      throw new Error('actualImagesFiles is not defined.');
    }

    strictEqual(actualProfileBuffer.equals(readFileSync(path1)), true);

    strictEqual(actualImagesFiles.length, 2);
    strictEqual(actualImagesFiles[0].buffer.equals(readFileSync(path1)), true);
    strictEqual(actualImagesFiles[1].buffer.equals(readFileSync(path2)), true);
  });

});
