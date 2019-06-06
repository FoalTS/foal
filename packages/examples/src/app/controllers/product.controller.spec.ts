// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Context, createController, getHttpMethod, getPath,
  isHttpResponseCreated, isHttpResponseNoContent,
  isHttpResponseNotFound, isHttpResponseOK
} from '@foal/core';
import { createConnection, getConnection, getConnectionOptions, getRepository } from 'typeorm';

// App
import { Product } from '../entities';
import { ProductController } from './product.controller';

describe('ProductController', () => {

  let controller: ProductController;
  let product1: Product;
  let product2: Product;

  before(async () => {
    const connectionOptions = await getConnectionOptions();
    Object.assign(connectionOptions, {
      database: './test_db.sqlite3',
      dropSchema: true,
      synchronize: true,
      type: 'sqlite',
    });
    await createConnection(connectionOptions);
  });

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

  describe('has a "get" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ProductController, 'get'), 'GET');
      strictEqual(getPath(ProductController, 'get'), undefined);
    });

    it('should return an HttpResponseOK object with the product list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.get(ctx);

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
      let response = await controller.get(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(product => product.id === product1.id));
      ok(response.body.find(product => product.id === product2.id));
      ok(!response.body.find(product => product.id === product3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.get(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(product => product.id === product1.id));
      ok(response.body.find(product => product.id === product2.id));
      ok(response.body.find(product => product.id === product3.id));
    });

  });

  describe('has a "getById" method that', () => {

    it('should handle requests at GET /:productId.', () => {
      strictEqual(getHttpMethod(ProductController, 'getById'), 'GET');
      strictEqual(getPath(ProductController, 'getById'), '/:productId');
    });

    it('should return an HttpResponseOK object if the product was found.', async () => {
      const ctx = new Context({
        params: {
          productId: product2.id
        }
      });
      const response = await controller.getById(ctx);

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
      const response = await controller.getById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "post" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(ProductController, 'post'), 'POST');
      strictEqual(getPath(ProductController, 'post'), undefined);
    });

    it('should create the product in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          text: 'Product 3',
        }
      });
      const response = await controller.post(ctx);

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

  describe('has a "patchById" method that', () => {

    it('should handle requests at PATCH /:productId.', () => {
      strictEqual(getHttpMethod(ProductController, 'patchById'), 'PATCH');
      strictEqual(getPath(ProductController, 'patchById'), '/:productId');
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
      const response = await controller.patchById(ctx);

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
      await controller.patchById(ctx);

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
      const response = await controller.patchById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "putById" method that', () => {

    it('should handle requests at PUT /:productId.', () => {
      strictEqual(getHttpMethod(ProductController, 'putById'), 'PUT');
      strictEqual(getPath(ProductController, 'putById'), '/:productId');
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
      const response = await controller.putById(ctx);

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
      await controller.putById(ctx);

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
      const response = await controller.putById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "deleteById" method that', () => {

    it('should handle requests at DELETE /:productId.', () => {
      strictEqual(getHttpMethod(ProductController, 'deleteById'), 'DELETE');
      strictEqual(getPath(ProductController, 'deleteById'), '/:productId');
    });

    it('should delete the product and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          productId: product2.id
        }
      });
      const response = await controller.deleteById(ctx);

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
      const response = await controller.deleteById(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const product = await getRepository(Product).findOne(product1.id);

      notStrictEqual(product, undefined);
    });

    it('should return an HttpResponseNotFound if the product was not fond.', async () => {
      const ctx = new Context({
        params: {
          productId: -1
        }
      });
      const response = await controller.deleteById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
