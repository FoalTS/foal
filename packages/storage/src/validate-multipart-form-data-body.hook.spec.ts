// 3p
import { Context, createApp, ExpressApplication, HttpResponseOK, Post } from '@foal/core';
import * as request from 'supertest';

// FoalTS
import { MultipartFormDataSchema, ValidateMultipartFormDataBody } from './validate-multipart-form-data-body.hook';

describe('ValidateMultipartFormDataBody', () => {
  // Note: Unfortunatly, in order to have a multipart request object,
  // we need to create an Express server to test the hook.

  function createAppWithHook(schema: MultipartFormDataSchema): ExpressApplication {
    @ValidateMultipartFormDataBody(schema)
    class AppController {
      @Post('/')
      index(ctx: Context) {
        return new HttpResponseOK(ctx.request.body);
      }
    }
    return createApp(AppController);
  }

  it('should return an HttpResponseBadRequest if the request fields are not validated.', () => {
    const app = createAppWithHook({
      fields: {
        properties: {
          name: { type: 'boolean' }
        },
        type: 'object',
      }
    });

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

  it('should set the property request.body.fields with the validated fields.', () => {
    const app = createAppWithHook({
      fields: {
        properties: {
          name: { type: 'string' }
        },
        type: 'object',
      }
    });

    return request(app)
      .post('/')
      .field('name', 'hello')
      .expect(200)
      .expect({
        fields: {
          name: 'hello'
        }
      });
  });

});
