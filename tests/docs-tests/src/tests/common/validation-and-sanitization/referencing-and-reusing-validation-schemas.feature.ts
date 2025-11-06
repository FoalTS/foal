// 3p
import * as request from 'supertest';

// FoalTS
import { Context, createApp, getAjvInstance, HttpResponseOK, Post, ValidateBody } from '@foal/core';

describe('Feature: Referencing and reusing validation schemas.', () => {

  afterEach(() => getAjvInstance().removeSchema('Product'));

  it('Example: A simple schema $ref.', async () => {

    /* ======================= DOCUMENTATION BEGIN ======================= */

    const productSchema = {
      additionalProperties: false,
      properties: {
        name: { type: 'string' }
      },
      required: [ 'name' ],
      type: 'object',
    };

    class ProductController {

      boot() {
        getAjvInstance()
          .addSchema(productSchema, 'Product');
      }

      @Post('/products')
      @ValidateBody({
        $ref: 'Product'
      })
      createProduct(ctx: Context) {
        // ...
        return new HttpResponseOK(ctx.request.body);
      }

    }

    /* ======================= DOCUMENTATION END ========================= */

    const app = await createApp(ProductController);

    await request(app)
      .post('/products')
      .send({})
      .expect(400)
      .expect({
        body: [
          {
            instancePath: '',
            keyword: 'required',
            message: 'must have required property \'name\'',
            params: {
              missingProperty: 'name'
            },
            schemaPath: 'Product/required'
          }
        ]
      });
  });

});
