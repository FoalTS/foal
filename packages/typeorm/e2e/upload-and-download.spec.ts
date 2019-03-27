// std
import { existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, unlinkSync } from 'fs';
import { join } from 'path';

// 3p
import { Context, createApp, createHttpResponseFile, Get, HttpResponseNotFound, HttpResponseOK, Post } from '@foal/core';
import { parseForm } from '@foal/formidable';
import { strictEqual } from 'assert';
import { IncomingForm } from 'formidable';
import * as request from 'supertest';
import {
  BaseEntity, Column, createConnection, Entity,
  getConnection, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

// FoalTS

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

  after(() => getConnection().close());

  it('should work as expected.', async () => {
    let user: User;

    @Entity()
    class User extends BaseEntity {
      @PrimaryGeneratedColumn()
      id: number;
    }

    @Entity()
    class UploadedFile extends BaseEntity {

      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      path: string;

      @ManyToOne(type => User)
      user: User;

    }

    class AppController {

      @Post('/upload')
      async upload(ctx: Context) {
        const form = new IncomingForm();
        form.uploadDir = 'uploaded';
        form.keepExtensions = true;
        const { fields, files } = await parseForm(form, ctx);

        const file = new UploadedFile();
        file.user = user;
        file.path = files.file1.path;
        await file.save();

        return new HttpResponseOK();
      }

      @Get('/download')
      async download() {
        const file = await UploadedFile.findOne({ user });

        if (!file) {
          return new HttpResponseNotFound();
        }

        return createHttpResponseFile({
          directory: 'uploaded/',
          file: file.path,
          filename: 'download.png',
          forceDownload: true,
        });
      }

    }

    await createConnection({
      database: 'e2e_db.sqlite',
      dropSchema: true,
      entities: [ User, UploadedFile ],
      synchronize: true,
      type: 'sqlite',
    });

    user = new User();
    await user.save();

    const app = createApp(AppController);

    await request(app)
      .post('/upload')
      .attach('file1', 'e2e/test-image.png')
      .expect(200);

    const files = await UploadedFile.find({ user });

    strictEqual(files.length, 1);

    const file = files[0];

    if (!existsSync(file.path)) {
      throw new Error(`${file.path} not found`);
    }

    const image = readFileSync('e2e/test-image.png');

    await request(app)
      .get('/download')
      .expect(200)
      .expect('Content-Type', 'image/png')
      .expect('Content-Length', image.length.toString())
      .expect('Content-Disposition', 'attachement; filename="download.png"')
      .expect(image);

  });

});
