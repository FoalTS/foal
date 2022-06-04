---
title: REST API
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page gives an example of how to build a REST API in Foal with authentication and OpenAPI generation support.

## The API Behavior

Below is a table summarizing how the generated API works:

| *HTTP Method* | *CRUD* | *Entire Collection (e.g. `/products`)* | *Specific Item (e.g. `/products/{id}`)* |
| --- | --- | --- | --- |
| GET | Read | 200 (OK) - list of products | 200 (OK) - the product <br /> 404 (Not Found)|
| POST | Create | 201 (Created) - the created product <br /> 400 (Bad Request) - the validation error | Not implemented |
| PUT | Update/Replace | Not implemented | 200 (OK) - the updated product <br /> 400 (Bad Request) - the validation error <br /> 404 (Not Found) |
| PATCH | Update/Modify | Not implemented | 200 (OK) - the updated product <br /> 400 (Bad Request) - the validation error <br /> 404 (Not Found) |
| DELETE | Delete | Not implemented | 204 (No Content) <br /> 404 (Not Found) |

The `GET /products` routes also accept two optional query parameters `skip` and `take` to handle **pagination**. If the parameters are not valid numbers, the controller responds with a 400 (Bad Request) status.

- `skip` - offset from where items should be taken.
- `take` - max number of items that should be taken.

*Example:*
```
GET /products?skip=10&take=20
```

## The Code

<Tabs
  defaultValue="controller"
  values={[
    {label: 'product.controller.ts', value: 'controller'},
    {label: 'product.controller.spec.ts', value: 'controllerTest'},
    {label: 'api.controller.ts', value: 'apiController'},
    {label: 'product.entity.ts', value: 'entity'},
  ]}
>
<TabItem value="controller">

```typescript
import {
  ApiOperationDescription, ApiOperationId, ApiOperationSummary, ApiResponse,
  ApiUseTag, Context, Delete, Get, HttpResponseCreated,
  HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Patch, Post,
  Put, ValidateBody, ValidatePathParam, ValidateQueryParam
} from '@foal/core';
import { getRepository } from 'typeorm';

import { Product } from './product.entity';

const productSchema = {
  additionalProperties: false,
  properties: {
    text: { type: 'string', maxLength: 255 },
  },
  required: [ 'text' ],
  type: 'object',
};

@ApiUseTag('product')
export class ProductController {

  @Get()
  @ApiOperationId('findProducts')
  @ApiOperationSummary('Find products.')
  @ApiOperationDescription(
    'The query parameters "skip" and "take" can be used for pagination. The first ' +
    'is the offset and the second is the number of elements to be returned.'
  )
  @ApiResponse(400, { description: 'Invalid query parameters.' })
  @ApiResponse(200, { description: 'Returns a list of products.' })
  @ValidateQueryParam('skip', { type: 'number' }, { required: false })
  @ValidateQueryParam('take', { type: 'number' }, { required: false })
  async findProducts(ctx: Context) {
    const products = await getRepository(Product).find({
      skip: ctx.request.query.skip,
      take: ctx.request.query.take,
      where: {},
    });
    return new HttpResponseOK(products);
  }

  @Get('/:productId')
  @ApiOperationId('findProductById')
  @ApiOperationSummary('Find a product by ID.')
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Returns the product.' })
  @ValidatePathParam('productId', { type: 'number' })
  async findProductById(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    return new HttpResponseOK(product);
  }

  @Post()
  @ApiOperationId('createProduct')
  @ApiOperationSummary('Create a new product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(201, { description: 'Product successfully created. Returns the product.' })
  @ValidateBody(productSchema)
  async createProduct(ctx: Context) {
    const product = await getRepository(Product).save(ctx.request.body);
    return new HttpResponseCreated(product);
  }

  @Patch('/:productId')
  @ApiOperationId('modifyProduct')
  @ApiOperationSummary('Update/modify an existing product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Product successfully updated. Returns the product.' })
  @ValidatePathParam('productId', { type: 'number' })
  @ValidateBody({ ...productSchema, required: [] })
  async modifyProduct(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    Object.assign(product, ctx.request.body);

    await getRepository(Product).save(product);

    return new HttpResponseOK(product);
  }

  @Put('/:productId')
  @ApiOperationId('replaceProduct')
  @ApiOperationSummary('Update/replace an existing product.')
  @ApiResponse(400, { description: 'Invalid product.' })
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(200, { description: 'Product successfully updated. Returns the product.' })
  @ValidatePathParam('productId', { type: 'number' })
  @ValidateBody(productSchema)
  async replaceProduct(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    Object.assign(product, ctx.request.body);

    await getRepository(Product).save(product);

    return new HttpResponseOK(product);
  }

  @Delete('/:productId')
  @ApiOperationId('deleteProduct')
  @ApiOperationSummary('Delete a product.')
  @ApiResponse(404, { description: 'Product not found.' })
  @ApiResponse(204, { description: 'Product successfully deleted.' })
  @ValidatePathParam('productId', { type: 'number' })
  async deleteProduct(ctx: Context) {
    const product = await getRepository(Product).findOne(ctx.request.params.productId);

    if (!product) {
      return new HttpResponseNotFound();
    }

    await getRepository(Product).delete(ctx.request.params.productId);

    return new HttpResponseNoContent();
  }

}

```

</TabItem>
<TabItem value="controllerTest">

```typescript
// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Context, createController, getHttpMethod, getPath,
  isHttpResponseCreated, isHttpResponseNoContent,
  isHttpResponseNotFound, isHttpResponseOK
} from '@foal/core';
import { createConnection, getConnection, getRepository } from 'typeorm';

// App
import { Product } from './product.entity';
import { ProductController } from './product.controller';

describe('ProductController', () => {

  let controller: ProductController;
  let product1: Product;
  let product2: Product;

  before(() => createConnection());

  after(() => getConnection().close());

  beforeEach(async () => {
    controller = createController(ProductController);

    const repository = getRepository(Product);
    await repository.clear();
    [ product1, product2 ] = await repository.save([
      {
        text: 'Product 1'
      },
      {
        text: 'Product 2'
      },
    ]);
  });

  describe('has a "findProducts" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ProductController, 'findProducts'), 'GET');
      strictEqual(getPath(ProductController, 'findProducts'), undefined);
    });

    it('should return an HttpResponseOK object with the product list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.findProducts(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of products.');
      }

      strictEqual(response.body.length, 2);
      ok(response.body.find(product => product.text === product1.text));
      ok(response.body.find(product => product.text === product2.text));
    });

    it('should support pagination', async () => {
      const product3 = await getRepository(Product).save({
        text: 'Product 3',
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.findProducts(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(product => product.id === product1.id));
      ok(response.body.find(product => product.id === product2.id));
      ok(!response.body.find(product => product.id === product3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.findProducts(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(product => product.id === product1.id));
      ok(response.body.find(product => product.id === product2.id));
      ok(response.body.find(product => product.id === product3.id));
    });

  });

  describe('has a "findProductById" method that', () => {

    it('should handle requests at GET /:productId.', () => {
      strictEqual(getHttpMethod(ProductController, 'findProductById'), 'GET');
      strictEqual(getPath(ProductController, 'findProductById'), '/:productId');
    });

    it('should return an HttpResponseOK object if the product was found.', async () => {
      const ctx = new Context({
        params: {
          productId: product2.id
        }
      });
      const response = await controller.findProductById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      strictEqual(response.body.id, product2.id);
      strictEqual(response.body.text, product2.text);
    });

    it('should return an HttpResponseNotFound object if the product was not found.', async () => {
      const ctx = new Context({
        params: {
          productId: -1
        }
      });
      const response = await controller.findProductById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "createProduct" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(ProductController, 'createProduct'), 'POST');
      strictEqual(getPath(ProductController, 'createProduct'), undefined);
    });

    it('should create the product in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Product 3',
        }
      });
      const response = await controller.createProduct(ctx);

      if (!isHttpResponseCreated(response)) {
        throw new Error('The returned value should be an HttpResponseCreated object.');
      }

      const product = await getRepository(Product).findOne({ text: 'Product 3' });

      if (!product) {
        throw new Error('No product 3 was found in the database.');
      }

      strictEqual(product.text, 'Product 3');

      strictEqual(response.body.id, product.id);
      strictEqual(response.body.text, product.text);
    });

  });

  describe('has a "modifyProduct" method that', () => {

    it('should handle requests at PATCH /:productId.', () => {
      strictEqual(getHttpMethod(ProductController, 'modifyProduct'), 'PATCH');
      strictEqual(getPath(ProductController, 'modifyProduct'), '/:productId');
    });

    it('should update the product in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Product 2 (version 2)',
        },
        params: {
          productId: product2.id
        }
      });
      const response = await controller.modifyProduct(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const product = await getRepository(Product).findOne(product2.id);

      if (!product) {
        throw new Error();
      }

      strictEqual(product.text, 'Product 2 (version 2)');

      strictEqual(response.body.id, product.id);
      strictEqual(response.body.text, product.text);
    });

    it('should not update the other products.', async () => {
      const ctx = new Context({
        body: {
          text: 'Product 2 (version 2)',
        },
        params: {
          productId: product2.id
        }
      });
      await controller.modifyProduct(ctx);

      const product = await getRepository(Product).findOne(product1.id);

      if (!product) {
        throw new Error();
      }

      notStrictEqual(product.text, 'Product 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          productId: -1
        }
      });
      const response = await controller.modifyProduct(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "replaceProduct" method that', () => {

    it('should handle requests at PUT /:productId.', () => {
      strictEqual(getHttpMethod(ProductController, 'replaceProduct'), 'PUT');
      strictEqual(getPath(ProductController, 'replaceProduct'), '/:productId');
    });

    it('should update the product in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Product 2 (version 2)',
        },
        params: {
          productId: product2.id
        }
      });
      const response = await controller.replaceProduct(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const product = await getRepository(Product).findOne(product2.id);

      if (!product) {
        throw new Error();
      }

      strictEqual(product.text, 'Product 2 (version 2)');

      strictEqual(response.body.id, product.id);
      strictEqual(response.body.text, product.text);
    });

    it('should not update the other products.', async () => {
      const ctx = new Context({
        body: {
          text: 'Product 2 (version 2)',
        },
        params: {
          productId: product2.id
        }
      });
      await controller.replaceProduct(ctx);

      const product = await getRepository(Product).findOne(product1.id);

      if (!product) {
        throw new Error();
      }

      notStrictEqual(product.text, 'Product 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          productId: -1
        }
      });
      const response = await controller.replaceProduct(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "deleteProduct" method that', () => {

    it('should handle requests at DELETE /:productId.', () => {
      strictEqual(getHttpMethod(ProductController, 'deleteProduct'), 'DELETE');
      strictEqual(getPath(ProductController, 'deleteProduct'), '/:productId');
    });

    it('should delete the product and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          productId: product2.id
        }
      });
      const response = await controller.deleteProduct(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const product = await getRepository(Product).findOne(product2.id);

      strictEqual(product, undefined);
    });

    it('should not delete the other products.', async () => {
      const ctx = new Context({
        params: {
          productId: product2.id
        }
      });
      const response = await controller.deleteProduct(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const product = await getRepository(Product).findOne(product1.id);

      notStrictEqual(product, undefined);
    });

    it('should return an HttpResponseNotFound if the product was not found.', async () => {
      const ctx = new Context({
        params: {
          productId: -1
        }
      });
      const response = await controller.deleteProduct(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});

```

</TabItem>
<TabItem value="entity">

```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}

```

</TabItem>
<TabItem value="apiController">

```typescript
import { controller } from '@foal/core';
import { ProductController } from './product.controller';

export class ApiController {
  subControllers = [
    controller('/products', ProductController)
  ];
}

```

</TabItem>
</Tabs>

## Generating OpenAPI documentation

The generated controllers also have OpenAPI decorators on their methods to document the API.

In this way, when the [configuration key](../architecture/configuration.md) `settings.openapi.useHooks` is set to `true`, we can get a full documentation of the API using [Swagger UI](./openapi-and-swagger-ui.md)

![Example of documentation](./images/rest-openapi.png).