// std
import { strictEqual } from 'assert';
import { join } from 'path';
import { mkdirSync, readdirSync, unlinkSync, rmdirSync, readFileSync } from 'fs';

// 3p
import * as request from 'supertest';
import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';

// FoalTS
import { Context, dependency, Get, HttpResponseNotFound, HttpResponseRedirect, Post, render, Config, createApp, Hook } from '@foal/core';
import { Disk, ParseAndValidateFiles } from '@foal/storage';
import { createAndInitializeDataSource } from '../../../../common';

describe('Feature: Uploading and downloading files with a database.', () => {

  let dataSource: DataSource;

  beforeEach(() => {
    Config.set('settings.disk.driver', 'local');
    Config.set('settings.disk.local.directory', 'uploaded');

    mkdirSync('uploaded');
    mkdirSync('uploaded/images');
    mkdirSync('uploaded/images/profiles');
  });

  afterEach(async () => {
    Config.remove('settings.disk.driver');
    Config.remove('settings.disk.local.directory');

    if (dataSource) {
      await dataSource.destroy();
    }

    const contents = readdirSync('uploaded/images/profiles');
    for (const content of contents) {
      unlinkSync(join('uploaded/images/profiles', content));
    }
    rmdirSync('uploaded/images/profiles');
    rmdirSync('uploaded/images');
    rmdirSync('uploaded');
  });

  it('Example: A simple example.', async () => {

    let user: User;

    /* ======================= DOCUMENTATION BEGIN ======================= */

    @Entity()
    class User extends BaseEntity {

      @PrimaryGeneratedColumn()
      id: number;

      @Column({ nullable: true })
      profile: string;

    }

    @Hook(async (ctx: Context<User>) => {
      ctx.user = await User.findOneByOrFail({ id: user.id });
    })
    class AppController {

      @dependency
      disk: Disk;

      @Post('/profile')
      @ParseAndValidateFiles({
        profile: { required: true, saveTo: 'images/profiles' }
      })
      async uploadProfilePicture(ctx: Context<User>) {
        const user = ctx.user;
        if (user.profile) {
          await this.disk.delete(user.profile);
        }

        user.profile = ctx.files.get('profile')[0].path;
        await user.save();

        return new HttpResponseRedirect('/');
      }

      @Get('/profile')
      async downloadProfilePicture(ctx: Context<User>) {
        const { profile } = ctx.user;

        if (!profile) {
          return new HttpResponseNotFound();
        }

        return this.disk.createHttpResponse(profile);
      }

      @Get('/')
      index() {
        return render('./templates/index.html');
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    dataSource = await createAndInitializeDataSource([ User ]);

    user = new User();
    await user.save();

    const app = await createApp(AppController);

    await request(app)
      .get('/profile')
      .expect(404);

    const imageBuffer = readFileSync(join(process.cwd(), 'assets/common/file-storage/upload-and-download-files/image.test.png'));
    const image2Buffer = readFileSync(join(process.cwd(), 'assets/common/file-storage/upload-and-download-files/image.test2.png'));

    strictEqual(imageBuffer.equals(image2Buffer), false);

    await request(app)
      .post('/profile')
      .attach('profile', imageBuffer)
      .expect(302);

    strictEqual(readdirSync('uploaded/images/profiles').length, 1);

    await request(app)
      .get('/profile')
      .expect(200)
      .buffer(true)
      .then(response => {
        strictEqual(imageBuffer.equals(response.body), true)
      });


    await request(app)
      .post('/profile')
      .attach('profile', image2Buffer)
      .expect(302);

    strictEqual(readdirSync('uploaded/images/profiles').length, 1);

    await request(app)
      .get('/profile')
      .expect(200)
      .then(response => {
        strictEqual(image2Buffer.equals(response.body), true)
      });

  });

});
