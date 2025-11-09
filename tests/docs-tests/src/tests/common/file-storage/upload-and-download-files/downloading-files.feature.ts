// std
import { strictEqual } from 'assert';
import { mkdirSync, readdirSync, unlinkSync, rmdirSync, copyFileSync, readFileSync } from 'fs';
import { join } from 'path';

// 3p
import * as request from 'supertest';

// FoalTS
import { Config, createApp, dependency, Get } from '@foal/core';
import { Disk } from '@foal/storage';

describe('Feature: Downloading files', () => {

  beforeEach(() => {
    Config.set('settings.disk.driver', 'local');
    Config.set('settings.disk.local.directory', 'uploaded');

    mkdirSync('uploaded');
    mkdirSync('uploaded/avatars');

    copyFileSync(join(process.cwd(), 'assets/common/file-storage/upload-and-download-files/image.test.png'), 'uploaded/avatars/foo.png')
  });

  afterEach(() => {
    Config.remove('settings.disk.driver');
    Config.remove('settings.disk.local.directory');

    const contents = readdirSync('uploaded/avatars');
    for (const content of contents) {
      unlinkSync(join('uploaded/avatars', content));
    }
    rmdirSync('uploaded/avatars');
    rmdirSync('uploaded');
  })

  it('Example: A simple example.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class ApiController {

      @dependency
      disk: Disk;

      @Get('/download')
      download() {
        return this.disk.createHttpResponse('avatars/foo.png');
      }

      @Get('/download2')
      download2() {
        return this.disk.createHttpResponse('avatars/foo.png', {
          forceDownload: true,
          filename: 'avatar.png'
        });
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(ApiController);

    const expectedBuffer = readFileSync(join(process.cwd(), 'assets/common/file-storage/upload-and-download-files/image.test.png'));

    await request(app)
      .get('/download')
      .expect(200)
      .then(response => {
        strictEqual(expectedBuffer.equals(response.body), true);
      })

    await request(app)
      .get('/download2')
      .expect(200)
      .expect('Content-Disposition', 'attachment; filename="avatar.png"')
      .then(response => {
        strictEqual(expectedBuffer.equals(response.body), true);
      })
  });

});
