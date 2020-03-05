// std
import { deepStrictEqual } from 'assert';
import { createReadStream, readFileSync } from 'fs';

// 3p
import { Context, createApp, ExpressApplication, HttpResponseOK, Post } from '@foal/core';
import * as request from 'supertest';

// FoalTS
import { MultipartFormDataSchema, ValidateMultipartFormDataBody } from './validate-multipart-form-data-body.hook';

describe('ValidateMultipartFormDataBody', () => {

  // Note: Unfortunatly, in order to have a multipart request object,
  // we need to create an Express server to test the hook.
  function createAppWithHook(schema: MultipartFormDataSchema, actual: { body: any }): ExpressApplication {
    @ValidateMultipartFormDataBody(schema)
    class AppController {
      @Post('/')
      index(ctx: Context) {
        actual.body = ctx.request.body;
        return new HttpResponseOK();
      }
    }
    return createApp(AppController);
  }

  // Maybe a "createMultipartRequest" function.

  it('should return an HttpResponseBadRequest if the request is not of type multipart/form-data');

  describe('should set ctx.request.body.fields with the fields', () => {

    it('when no schema is given in the hook.');

    it('when the fields are validated against the given schema.');

  });

  describe('when the fields are not validated against the given schema', () => {

    it('should return an HttpResponseBadRequest.');

    it('should not have uploaded the files.');

  });

  it('should ignore the upload of unexpected files.');

  describe('when a file is not uploaded and it is not required', () => {

    it('should set ctx.request.body.files with a "null" value if the option "multiple" is not defined.');

    it('should set ctx.request.body.files with a "null" value if the option "multiple" is "false".');

    it('should set ctx.request.body.files with an empty array if the option "multiple" is "true".');

  });

  describe('when a file is not uploaded but it is required', () => {

    it('should return an HttpResponseBadRequest (multiple === undefined).');

    it('should return an HttpResponseBadRequest (multiple === false).');

    it('should return an HttpResponseBadRequest (multiple === true).');

    it('should not have uploaded the other files.');

  });

  describe('when a file is uploaded and uploadTo is undefined', () => {

    it('should set ctx.request.files with the buffered file if the option "multiple" is not defined.');

    it('should set ctx.request.files with the buffered file if the option "multiple" is not "false".');

    it('should set ctx.request.files with an array of the buffered fileS if the option "multiple" is not "true".');

  });

  describe('when a file is uploaded and uploadTo is defined', () => {

    it('should save the file to the disk and set ctx.request.files with its path'
      + ' if the option "multiple" is not defined.');

    it('should save the file to the disk and set ctx.request.files with its path'
      + ' if the option "multiple" is not "false".');

    it('should save the file to the disk and set ctx.request.files with an array'
      + ' of the pathS  if the option "multiple" is not "true".');

  });

  // it('should return an HttpResponseBadRequest if the request fields are not validated.', () => {
  //   const actual = { body: null };
  //   const app = createAppWithHook({
  //     fields: {
  //       properties: {
  //         name: { type: 'boolean' }
  //       },
  //       type: 'object',
  //     }
  //   }, actual);

  //   return request(app)
  //     .post('/')
  //     .field('name', 'hello')
  //     .expect(400)
  //     .expect({
  //       body: [
  //         {
  //           dataPath: '.name',
  //           keyword: 'type',
  //           message: 'should be boolean',
  //           params: {
  //             type: 'boolean'
  //           },
  //           schemaPath: '#/properties/name/type',
  //         }
  //       ]
  //     });
  // });

  // it('should set the property request.body.fields with the validated fields.', async () => {
  //   const actual: { body: any } = { body: null };
  //   const app = createAppWithHook({
  //     fields: {
  //       properties: {
  //         name: { type: 'string' }
  //       },
  //       type: 'object',
  //     }
  //   }, actual);

  //   await request(app)
  //     .post('/')
  //     .field('name', 'hello')
  //     .expect(200);

  //   deepStrictEqual(actual.body.fields, {
  //     name: 'hello'
  //   });
  // });

  // it('should set the property request.body.files with the file buffers (single).', async () => {
  //   const actual: { body: any } = { body: null };
  //   const app = createAppWithHook({
  //     files: [ 'logo', 'screenshot' ]
  //   }, actual);

  //   await request(app)
  //     .post('/')
  //     .attach('logo', createReadStream('src/image.test.png'))
  //     .attach('screenshot', createReadStream('src/image.test2.png'))
  //     .expect(200);

  //   deepStrictEqual(actual.body.files.logo, readFileSync('src/image.test.png'));
  //   deepStrictEqual(actual.body.files.screenshot, readFileSync('src/image.test2.png'));
  // });

  // it('should set the property request.body.files with the file buffers (multiple).', async () => {
  //   const actual: { body: any } = { body: null };
  //   const app = createAppWithHook({
  //     files: [ ['images'] ]
  //   }, actual);

  //   await request(app)
  //     .post('/')
  //     .attach('images', createReadStream('src/image.test.png'))
  //     .attach('images', createReadStream('src/image.test2.png'))
  //     .expect(200);

  //   deepStrictEqual(actual.body.files.images, [
  //     readFileSync('src/image.test.png'),
  //     readFileSync('src/image.test2.png'),
  //   ]);
  // });

  // it('should return an HttpResponseBadRequest if a file is missing.', () => {
  //   const actual: { body: any } = { body: null };
  //   const app = createAppWithHook({
  //     files: [ ['images'], 'logo' ]
  //   }, actual);

  //   return request(app)
  //     .post('/')
  //     .field('hello', 'world')
  //     .expect(400)
  //     .expect({
  //       body: {
  //         error: 'MISSING_FILE',
  //         message: 'The file "logo" is missing.'
  //       }
  //     });
  // });

  // it('should return an HttpResponseBadRequest if an unexpected file is received.');

});
