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
import { TestFooBar } from '../entities';
import { TestFooBarController } from './test-foo-bar.controller';

describe('TestFooBarController', () => {

  let controller: TestFooBarController;
  let testFooBar1: TestFooBar;
  let testFooBar2: TestFooBar;

  before(() => createConnection());

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

  describe('has a "findTestFooBars" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'findTestFooBars'), 'GET');
      strictEqual(getPath(TestFooBarController, 'findTestFooBars'), undefined);
    });

    it('should return an HttpResponseOK object with the testFooBar list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.findTestFooBars(ctx);

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
      let response = await controller.findTestFooBars(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(testFooBar => testFooBar.id === testFooBar1.id));
      ok(response.body.find(testFooBar => testFooBar.id === testFooBar2.id));
      ok(!response.body.find(testFooBar => testFooBar.id === testFooBar3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.findTestFooBars(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(testFooBar => testFooBar.id === testFooBar1.id));
      ok(response.body.find(testFooBar => testFooBar.id === testFooBar2.id));
      ok(response.body.find(testFooBar => testFooBar.id === testFooBar3.id));
    });

  });

  describe('has a "findTestFooBarById" method that', () => {

    it('should handle requests at GET /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'findTestFooBarById'), 'GET');
      strictEqual(getPath(TestFooBarController, 'findTestFooBarById'), '/:testFooBarId');
    });

    it('should return an HttpResponseOK object if the testFooBar was found.', async () => {
      const ctx = new Context({
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      const response = await controller.findTestFooBarById(ctx);

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
      const response = await controller.findTestFooBarById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "createTestFooBar" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'createTestFooBar'), 'POST');
      strictEqual(getPath(TestFooBarController, 'createTestFooBar'), undefined);
    });

    it('should create the testFooBar in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          text: 'TestFooBar 3',
        }
      });
      const response = await controller.createTestFooBar(ctx);

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

  describe('has a "modifyTestFooBar" method that', () => {

    it('should handle requests at PATCH /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'modifyTestFooBar'), 'PATCH');
      strictEqual(getPath(TestFooBarController, 'modifyTestFooBar'), '/:testFooBarId');
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
      const response = await controller.modifyTestFooBar(ctx);

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
      await controller.modifyTestFooBar(ctx);

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
      const response = await controller.modifyTestFooBar(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "replaceTestFooBar" method that', () => {

    it('should handle requests at PUT /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'replaceTestFooBar'), 'PUT');
      strictEqual(getPath(TestFooBarController, 'replaceTestFooBar'), '/:testFooBarId');
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
      const response = await controller.replaceTestFooBar(ctx);

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
      await controller.replaceTestFooBar(ctx);

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
      const response = await controller.replaceTestFooBar(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "deleteTestFooBar" method that', () => {

    it('should handle requests at DELETE /:testFooBarId.', () => {
      strictEqual(getHttpMethod(TestFooBarController, 'deleteTestFooBar'), 'DELETE');
      strictEqual(getPath(TestFooBarController, 'deleteTestFooBar'), '/:testFooBarId');
    });

    it('should delete the testFooBar and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          testFooBarId: testFooBar2.id
        }
      });
      const response = await controller.deleteTestFooBar(ctx);

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
      const response = await controller.deleteTestFooBar(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const testFooBar = await getRepository(TestFooBar).findOne(testFooBar1.id);

      notStrictEqual(testFooBar, undefined);
    });

    it('should return an HttpResponseNotFound if the testFooBar was not found.', async () => {
      const ctx = new Context({
        params: {
          testFooBarId: -1
        }
      });
      const response = await controller.deleteTestFooBar(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
