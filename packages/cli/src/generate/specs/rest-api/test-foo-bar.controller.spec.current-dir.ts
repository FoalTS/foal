// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Context, createController, getHttpMethod, getPath,
  isHttpResponseCreated, isHttpResponseMethodNotAllowed, isHttpResponseNoContent,
  isHttpResponseNotFound, isHttpResponseOK
} from '@foal/core';
import { createConnection, getConnection, getConnectionOptions, getRepository } from 'typeorm';

// App
import { TestFooBarController } from './test-foo-bar.controller';
import { TestFooBar } from './test-foo-bar.entity';

describe('TestFooBarController', () => {

  let controller: TestFooBarController;
  let testFooBar1: TestFooBar;
  let testFooBar2: TestFooBar;

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
    controller = createController(TestFooBarController);

    const repository = getRepository(TestFooBar);
    await repository.clear();
    [ testFooBar1, testFooBar2 ] = await repository.save([
      {
        text: 'TestFooBar 1'
      },
      {
        text: 'TestFooBar 2'
      },
    ]);
  });

  describe('has a "get" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'get'), 'GET');
      strictEqual(getPath(TestFooBarController, 'get'), '/');
    });

    it('should return an HttpResponseOK object with the testFooBar list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.get(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of testFooBars.');
      }

      strictEqual(response.body.length, 2);
      ok(response.body.find(testFooBar => testFooBar.text === testFooBar1.text));
      ok(response.body.find(testFooBar => testFooBar.text === testFooBar2.text));
    });

    it('should support pagination', async () => {
      const testFooBar3 = await getRepository(TestFooBar).save({
        text: 'TestFooBar 3',
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.get(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(testFooBar => testFooBar.id === testFooBar1.id));
      ok(response.body.find(testFooBar => testFooBar.id === testFooBar2.id));
      ok(!response.body.find(testFooBar => testFooBar.id === testFooBar3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.get(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(testFooBar => testFooBar.id === testFooBar1.id));
      ok(response.body.find(testFooBar => testFooBar.id === testFooBar2.id));
      ok(response.body.find(testFooBar => testFooBar.id === testFooBar3.id));
    });

  });

  describe('has a "getById" method that', () => {

    it('should handle requests at GET /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'getById'), 'GET');
      strictEqual(getPath(TestFooBarController, 'getById'), '/:testFooBarId');
    });

    it('should return an HttpResponseOK object if the testFooBar was found.', async () => {
      const ctx = new Context({
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      const response = await controller.getById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      strictEqual(response.body.id, testFooBar2.id);
      strictEqual(response.body.text, testFooBar2.text);
    });

    it('should return an HttpResponseNotFound object if the testFooBar was not found.', async () => {
      const ctx = new Context({
        params: {
          testFooBarId: -1
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
      strictEqual(getHttpMethod(TestFooBarController, 'post'), 'POST');
      strictEqual(getPath(TestFooBarController, 'post'), '/');
    });

    it('should create the testFooBar in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          text: 'TestFooBar 3',
        }
      });
      const response = await controller.post(ctx);

      if (!isHttpResponseCreated(response)) {
        throw new Error('The returned value should be an HttpResponseCreated object.');
      }

      const testFooBar = await getRepository(TestFooBar).findOne({ text: 'TestFooBar 3' });

      if (!testFooBar) {
        throw new Error('No testFooBar 3 was found in the database.');
      }

      strictEqual(testFooBar.text, 'TestFooBar 3');

      strictEqual(response.body.id, testFooBar.id);
      strictEqual(response.body.text, testFooBar.text);
    });

  });

  describe('has a "postById" method that', () => {

    it('should handle requests at POST /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'postById'), 'POST');
      strictEqual(getPath(TestFooBarController, 'postById'), '/:testFooBarId');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      ok(isHttpResponseMethodNotAllowed(controller.postById()));
    });

  });

  describe('has a "patch" method that', () => {

    it('should handle requests at PATCH /.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'patch'), 'PATCH');
      strictEqual(getPath(TestFooBarController, 'patch'), '/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      ok(isHttpResponseMethodNotAllowed(controller.patch()));
    });

  });

  describe('has a "patchById" method that', () => {

    it('should handle requests at PATCH /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'patchById'), 'PATCH');
      strictEqual(getPath(TestFooBarController, 'patchById'), '/:testFooBarId');
    });

    it('should update the testFooBar in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: 'TestFooBar 2 (version 2)',
        },
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      const response = await controller.patchById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const testFooBar = await getRepository(TestFooBar).findOne(testFooBar2.id);

      if (!testFooBar) {
        throw new Error();
      }

      strictEqual(testFooBar.text, 'TestFooBar 2 (version 2)');

      strictEqual(response.body.id, testFooBar.id);
      strictEqual(response.body.text, testFooBar.text);
    });

    it('should not update the other testFooBars.', async () => {
      const ctx = new Context({
        body: {
          text: 'TestFooBar 2 (version 2)',
        },
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      await controller.patchById(ctx);

      const testFooBar = await getRepository(TestFooBar).findOne(testFooBar1.id);

      if (!testFooBar) {
        throw new Error();
      }

      notStrictEqual(testFooBar.text, 'TestFooBar 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          testFooBarId: -1
        }
      });
      const response = await controller.patchById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "put" method that', () => {

    it('should handle requests at PUT /.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'put'), 'PUT');
      strictEqual(getPath(TestFooBarController, 'put'), '/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      ok(isHttpResponseMethodNotAllowed(controller.put()));
    });

  });

  describe('has a "putById" method that', () => {

    it('should handle requests at PUT /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'putById'), 'PUT');
      strictEqual(getPath(TestFooBarController, 'putById'), '/:testFooBarId');
    });

    it('should update the testFooBar in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: 'TestFooBar 2 (version 2)',
        },
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      const response = await controller.putById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const testFooBar = await getRepository(TestFooBar).findOne(testFooBar2.id);

      if (!testFooBar) {
        throw new Error();
      }

      strictEqual(testFooBar.text, 'TestFooBar 2 (version 2)');

      strictEqual(response.body.id, testFooBar.id);
      strictEqual(response.body.text, testFooBar.text);
    });

    it('should not update the other testFooBars.', async () => {
      const ctx = new Context({
        body: {
          text: 'TestFooBar 2 (version 2)',
        },
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      await controller.putById(ctx);

      const testFooBar = await getRepository(TestFooBar).findOne(testFooBar1.id);

      if (!testFooBar) {
        throw new Error();
      }

      notStrictEqual(testFooBar.text, 'TestFooBar 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          testFooBarId: -1
        }
      });
      const response = await controller.putById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "delete" method that', () => {

    it('should handle requests at DELETE /.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'delete'), 'DELETE');
      strictEqual(getPath(TestFooBarController, 'delete'), '/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      ok(isHttpResponseMethodNotAllowed(controller.delete()));
    });

  });

  describe('has a "deleteById" method that', () => {

    it('should handle requests at DELETE /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'deleteById'), 'DELETE');
      strictEqual(getPath(TestFooBarController, 'deleteById'), '/:testFooBarId');
    });

    it('should delete the testFooBar and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      const response = await controller.deleteById(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const testFooBar = await getRepository(TestFooBar).findOne(testFooBar2.id);

      strictEqual(testFooBar, undefined);
    });

    it('should not delete the other testFooBars.', async () => {
      const ctx = new Context({
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      const response = await controller.deleteById(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const testFooBar = await getRepository(TestFooBar).findOne(testFooBar1.id);

      notStrictEqual(testFooBar, undefined);
    });

    it('should return an HttpResponseNotFound if the testFooBar was not fond.', async () => {
      const ctx = new Context({
        params: {
          testFooBarId: -1
        }
      });
      const response = await controller.deleteById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
