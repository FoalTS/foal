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

  it('should return an HttpResponseBadRequest if the request fields are not validated.', () => {
    const actual = { body: null };
    const app = createAppWithHook({
      fields: {
        properties: {
          name: { type: 'boolean' }
        },
        type: 'object',
      }
    }, actual);

    return request(app)
      .post('/')
      .field('name', 'hello')
      .expect(400)
      .expect({
        body: [
          {
            dataPath: '.name',
            keyword: 'type',
            message: 'should be boolean',
            params: {
              type: 'boolean'
            },
            schemaPath: '#/properties/name/type',
          }
        ]
      });
  });

  it('should set the property request.body.fields with the validated fields.', async () => {
    const actual: { body: any } = { body: null };
    const app = createAppWithHook({
      fields: {
        properties: {
          name: { type: 'string' }
        },
        type: 'object',
      }
    }, actual);

    await request(app)
      .post('/')
      .field('name', 'hello')
      .expect(200);

    deepStrictEqual(actual.body.fields, {
      name: 'hello'
    });
  });

  it('should set the property request.body.files with the file buffers (single).', async () => {
    const actual: { body: any } = { body: null };
    const app = createAppWithHook({
      files: [ 'logo', 'screenshot' ]
    }, actual);

    await request(app)
      .post('/')
      .attach('logo', createReadStream('src/image.test.png'))
      .attach('screenshot', createReadStream('src/image.test2.png'))
      .expect(200);

    deepStrictEqual(actual.body.files.logo, readFileSync('src/image.test.png'));
    deepStrictEqual(actual.body.files.screenshot, readFileSync('src/image.test2.png'));
  });

  it('should set the property request.body.files with the file buffers (multiple).', async () => {
    const actual: { body: any } = { body: null };
    const app = createAppWithHook({
      files: [ ['images'] ]
    }, actual);

    await request(app)
      .post('/')
      .attach('images', createReadStream('src/image.test.png'))
      .attach('images', createReadStream('src/image.test2.png'))
      .expect(200);

    deepStrictEqual(actual.body.files.images, [
      readFileSync('src/image.test.png'),
      readFileSync('src/image.test2.png'),
    ]);
  });

  it('should return an HttpResponseBadRequest if a file is missing.', () => {
    const actual: { body: any } = { body: null };
    const app = createAppWithHook({
      files: [ ['images'], 'logo' ]
    }, actual);

    return request(app)
      .post('/')
      .field('hello', 'world')
      .expect(400)
      .expect({
        body: {
          error: 'MISSING_FILE',
          message: 'The file "logo" is missing.'
        }
      });
  });

  it('should return an HttpResponseBadRequest if an unexpected file is received.');

});
