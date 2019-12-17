// std
import { deepStrictEqual } from 'assert';
import { readFileSync } from 'fs';
import { join } from 'path';

// 3p
import { parse } from 'yamljs';

// FoalTS
import { ApiInfo, createOpenApiDocument, Get, Post, ValidateBody } from '@foal/core';
import { JWTOptional, JWTRequired } from '@foal/jwt';

describe('Foal', () => {

  beforeEach(() => process.env.SETTINGS_OPENAPI_USE_HOOKS = 'true');

  afterEach(() => delete process.env.SETTINGS_OPENAPI_USE_HOOKS);

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

    const yamlDocument = readFileSync(join(__dirname, './assets/openapi.hooks.yml'), 'utf8');
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

    const yamlDocument2 = readFileSync(join(__dirname, './assets/openapi.hooks2.yml'), 'utf8');
    const expectedDocument2 = parse(yamlDocument2);

    const actualDocument2 = createOpenApiDocument(ApiController2);

    deepStrictEqual(actualDocument2, expectedDocument2);

  });

});
