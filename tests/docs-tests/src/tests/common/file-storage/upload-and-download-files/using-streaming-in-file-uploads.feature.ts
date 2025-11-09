// std
import { strictEqual } from 'assert';
import { mkdirSync, readdirSync, unlinkSync, rmdirSync, createReadStream } from 'fs';
import { join } from 'path';

// 3p
import * as request from 'supertest';

// FoalTS
import { Config, Context, createApp, HttpResponseOK, Post } from '@foal/core';
import { ParseAndValidateFiles } from '@foal/storage';

describe('Feature: Using streaming in file upload', () => {

  beforeEach(() => {
    Config.set('settings.disk.driver', 'local');
    Config.set('settings.disk.local.directory', 'uploaded');

    mkdirSync('uploaded');
    mkdirSync('uploaded/images');
    mkdirSync('uploaded/images/profiles');
  });

  afterEach(() => {
    Config.remove('settings.disk.driver');
    Config.remove('settings.disk.local.directory');

    const contents = readdirSync('uploaded/images/profiles');
    for (const content of contents) {
      unlinkSync(join('uploaded/images/profiles', content));
    }
    rmdirSync('uploaded/images/profiles');
    rmdirSync('uploaded/images');
    rmdirSync('uploaded');
  })

  it('Example: A simple example.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class UserController {

      @Post('/profile')
      @ParseAndValidateFiles({
        profile: { required: true, saveTo: 'images/profiles' }
      })
      uploadProfilePhoto(ctx: Context) {
        const { path } = ctx.files.get('profile')[0];
        // images/profiles/GxunLNJu3RXI9l7C7cQlBvXFQ+iqdxSRJmsR4TU+0Fo=.png
        return new HttpResponseOK({ path });
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(UserController);

    const path1 = join(process.cwd(), './assets/common/file-storage/upload-and-download-files/image.test.png');

    await request(app)
      .post('/profile')
      .attach('profile', createReadStream(path1))
      .expect(200)
      .then(response => {
        strictEqual(response.body.path.startsWith('images/profiles/'), true);
        strictEqual(response.body.path.endsWith('.png'), true);
      });
  });

});
