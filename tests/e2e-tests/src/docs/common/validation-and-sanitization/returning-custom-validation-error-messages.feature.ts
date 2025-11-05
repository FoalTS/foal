// 3p
import ajvErrors from 'ajv-errors';
import * as request from 'supertest';

// FoalTS
import { Config, Context, createApp, getAjvInstance, HttpResponseOK, Post, ValidateBody } from '@foal/core';
import { _instanceWrapper } from '@foal/core/lib/common/validation/get-ajv-instance';

describe('Feature: Returning custom validation error messages', () => {

  beforeEach(() => {
    delete (_instanceWrapper as any).instance;
    Config.set('settings.ajv.allErrors', true);
  });

  afterEach(() => {
    delete (_instanceWrapper as any).instance;
    Config.remove('settings.ajv.allErrors');
  });

  it('Example: A simple custom error message.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    class AppController {

      init() {
        ajvErrors(getAjvInstance());
      }

      @Post('/products')
      @ValidateBody({
        additionalProperties: false,
        errorMessage: 'The submitted product is incorrect.',
        properties: {
          name: { type: 'string' }
        },
        required: [ 'name' ],
        type: 'object',
      })
      createProduct(ctx: Context) {
        // ...
        return new HttpResponseOK(ctx.request.body);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(AppController);

    await request(app)
      .post('/products')
      .send({})
      .expect(400)
      .expect({
        body: [
          {
            instancePath: '',
            keyword: 'errorMessage',
            message: 'The submitted product is incorrect.',
            params: {
              errors: [
                {
                  emUsed: true,
                  instancePath: '',
                  keyword: 'required',
                  message: 'must have required property \'name\'',
                  params: {
                    missingProperty: 'name'
                  },
                  schemaPath: '#/required'
                }
              ]
            },
            schemaPath: '#/errorMessage'
          }
        ]
      });

  });

});
