// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Context, createController, getHttpMethod, getPath,
  isHttpResponseCreated, isHttpResponseNoContent,
  isHttpResponseNotFound, isHttpResponseOK
} from '@foal/core';
import { getConnection, getRepository } from '@foal/typeorm/node_modules/typeorm';

// App
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { createTestConnection } from '../../../common';

describe('ProductController', () => {

  let controller: ProductController;
  let product1: Product;
  let product2: Product;

  before(() => createTestConnection([ Product ]));

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
