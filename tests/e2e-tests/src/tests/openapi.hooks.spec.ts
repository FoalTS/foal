// std
import { deepStrictEqual } from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';

// 3p
import * as request from 'supertest';
import { parse } from 'yamljs';

// FoalTS
import { ApiDefineSchema, ApiInfo, createApp, createOpenApiDocument, Get, Post, ValidateBody } from '@foal/core';
import { JWTOptional, JWTRequired } from '@foal/jwt';

describe('Foal', () => {

  it('should generate OpenAPI spec from hooks.', () => {

    @ApiInfo({
      title: 'My API',
      version: '1.0.0'
    })
    @JWTRequired()
    class ApiController {
      @Post('/products')
      @ValidateBody({
        properties: {
          name: { type: 'string' }
        },
        type: 'object',
      })
      createProduct() {}
    }

    const yamlDocument = readFileSync(join(process.cwd(), './assets/openapi.hooks.yml'), 'utf8');
    const expectedDocument = parse(yamlDocument);

    const actualDocument = createOpenApiDocument(ApiController);

    deepStrictEqual(actualDocument, expectedDocument);

    // Test hook conflicts (Two calls of @JWT).

    @ApiInfo({
      title: 'My API',
      version: '1.0.0'
    })
    class ApiController2 {
      @Get('/products')
      @JWTOptional()
      readProducts() {}

      @Post('/products')
      @JWTRequired()
      @ValidateBody({
        properties: {
          name: { type: 'string' }
        },
        type: 'object',
      })
      createProduct() {}
    }

    const yamlDocument2 = readFileSync(join(process.cwd(), './assets/openapi.hooks2.yml'), 'utf8');
    const expectedDocument2 = parse(yamlDocument2);

    const actualDocument2 = createOpenApiDocument(ApiController2);

    deepStrictEqual(actualDocument2, expectedDocument2);

  });

  it('should support OpenAPI references in validation hooks.', async () => {
    @ApiInfo({
      title: 'My API',
      version: '1.0.0'
    })
    @ApiDefineSchema(
      'product', {
        properties: {
          name: { type: 'string' }
        },
        required: [ 'name'],
        type: 'object',
      }
    )
    class ApiController {
      @Post('/products')
      @ValidateBody({
        $ref: '#/components/schemas/product'
      })
      createProduct() {}
    }

    const app = await createApp(ApiController);
    return request(app)
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
            schemaPath: '#/components/schemas/product/required',
          }
        ]
      });
  });

});
