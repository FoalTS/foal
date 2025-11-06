// std
import { strictEqual } from 'assert';
import { createReadStream } from 'fs';
import { join } from 'path';

// 3p
import * as request from 'supertest';

// FoalTS
import { Context, createApp, HttpResponseOK, Post } from '@foal/core';
import { ParseAndValidateFiles } from '@foal/storage';

describe('Feature: Adding fields in file uploads', () => {

  it('Example: A simple example.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class UserController {

      @Post('/profile')
      @ParseAndValidateFiles(
        {
          profile: { required: true }
        },
        {
          type: 'object',
          properties: {
            description: { type: 'string' }
          },
          required: ['description'],
          additionalProperties: false
        }
      )
      uploadProfilePhoto(ctx: Context) {
        const { path } = ctx.files.get('profile')[0];
        // images/profiles/GxunLNJu3RXI9l7C7cQlBvXFQ+iqdxSRJmsR4TU+0Fo=.png
        const { description } = ctx.request.body;
        return new HttpResponseOK({ path, description });
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(UserController);

    const path1 = join(process.cwd(), './assets/common/file-storage/upload-and-download-files/image.test.png');
    const description = 'hello world'

    await request(app)
      .post('/profile')
      .attach('profile', createReadStream(path1))
      .field('description', 'hello world')
      .expect(200)
      .then(response => {
        strictEqual(response.body.description, description)
      })

  });

});
