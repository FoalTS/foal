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
import { /* upperFirstCamelName */Controller } from './/* kebabName */.controller';
import { /* upperFirstCamelName */ } from './/* kebabName */.entity';

describe('/* upperFirstCamelName */Controller', () => {

  let controller: /* upperFirstCamelName */Controller;
  let /* camelName */1: /* upperFirstCamelName */;
  let /* camelName */2: /* upperFirstCamelName */;

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
    controller = createController(/* upperFirstCamelName */Controller);

    const repository = getRepository(/* upperFirstCamelName */);
    await repository.clear();
    [ /* camelName */1, /* camelName */2 ] = await repository.save([
      {
        text: '/* upperFirstCamelName */ 1'
      },
      {
        text: '/* upperFirstCamelName */ 2'
      },
    ]);
  });

  describe('has a "get" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'get'), 'GET');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'get'), undefined);
    });

    it('should return an HttpResponseOK object with the /* camelName */ list.', async () => {
      const ctx = new Context({ query: {} });
      const response = await controller.get(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      if (!Array.isArray(response.body)) {
        throw new Error('The response body should be an array of /* camelName */s.');
      }

      strictEqual(response.body.length, 2);
      ok(response.body.find(/* camelName */ => /* camelName */.text === /* camelName */1.text));
      ok(response.body.find(/* camelName */ => /* camelName */.text === /* camelName */2.text));
    });

    it('should support pagination', async () => {
      const /* camelName */3 = await getRepository(/* upperFirstCamelName */).save({
        text: '/* upperFirstCamelName */ 3',
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      let response = await controller.get(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(/* camelName */ => /* camelName */.id === /* camelName */1.id));
      ok(response.body.find(/* camelName */ => /* camelName */.id === /* camelName */2.id));
      ok(!response.body.find(/* camelName */ => /* camelName */.id === /* camelName */3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      response = await controller.get(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(/* camelName */ => /* camelName */.id === /* camelName */1.id));
      ok(response.body.find(/* camelName */ => /* camelName */.id === /* camelName */2.id));
      ok(response.body.find(/* camelName */ => /* camelName */.id === /* camelName */3.id));
    });

  });

  describe('has a "getById" method that', () => {

    it('should handle requests at GET /:/* camelName */Id.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'getById'), 'GET');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'getById'), '/:/* camelName */Id');
    });

    it('should return an HttpResponseOK object if the /* camelName */ was found.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      const response = await controller.getById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      strictEqual(response.body.id, /* camelName */2.id);
      strictEqual(response.body.text, /* camelName */2.text);
    });

    it('should return an HttpResponseNotFound object if the /* camelName */ was not found.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: -1
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
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'post'), 'POST');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'post'), undefined);
    });

    it('should create the /* camelName */ in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          text: '/* upperFirstCamelName */ 3',
        }
      });
      const response = await controller.post(ctx);

      if (!isHttpResponseCreated(response)) {
        throw new Error('The returned value should be an HttpResponseCreated object.');
      }

      const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne({ text: '/* upperFirstCamelName */ 3' });

      if (!/* camelName */) {
        throw new Error('No /* camelName */ 3 was found in the database.');
      }

      strictEqual(/* camelName */.text, '/* upperFirstCamelName */ 3');

      strictEqual(response.body.id, /* camelName */.id);
      strictEqual(response.body.text, /* camelName */.text);
    });

  });

  describe('has a "patchById" method that', () => {

    it('should handle requests at PATCH /:/* camelName */Id.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'patchById'), 'PATCH');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'patchById'), '/:/* camelName */Id');
    });

    it('should update the /* camelName */ in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: '/* upperFirstCamelName */ 2 (version 2)',
        },
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      const response = await controller.patchById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(/* camelName */2.id);

      if (!/* camelName */) {
        throw new Error();
      }

      strictEqual(/* camelName */.text, '/* upperFirstCamelName */ 2 (version 2)');

      strictEqual(response.body.id, /* camelName */.id);
      strictEqual(response.body.text, /* camelName */.text);
    });

    it('should not update the other /* camelName */s.', async () => {
      const ctx = new Context({
        body: {
          text: '/* upperFirstCamelName */ 2 (version 2)',
        },
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      await controller.patchById(ctx);

      const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(/* camelName */1.id);

      if (!/* camelName */) {
        throw new Error();
      }

      notStrictEqual(/* camelName */.text, '/* upperFirstCamelName */ 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          /* camelName */Id: -1
        }
      });
      const response = await controller.patchById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "putById" method that', () => {

    it('should handle requests at PUT /:/* camelName */Id.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'putById'), 'PUT');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'putById'), '/:/* camelName */Id');
    });

    it('should update the /* camelName */ in the database and return it through an HttpResponseOK object.', async () => {
      const ctx = new Context({
        body: {
          text: '/* upperFirstCamelName */ 2 (version 2)',
        },
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      const response = await controller.putById(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(/* camelName */2.id);

      if (!/* camelName */) {
        throw new Error();
      }

      strictEqual(/* camelName */.text, '/* upperFirstCamelName */ 2 (version 2)');

      strictEqual(response.body.id, /* camelName */.id);
      strictEqual(response.body.text, /* camelName */.text);
    });

    it('should not update the other /* camelName */s.', async () => {
      const ctx = new Context({
        body: {
          text: '/* upperFirstCamelName */ 2 (version 2)',
        },
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      await controller.putById(ctx);

      const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(/* camelName */1.id);

      if (!/* camelName */) {
        throw new Error();
      }

      notStrictEqual(/* camelName */.text, '/* upperFirstCamelName */ 2 (version 2)');
    });

    it('should return an HttpResponseNotFound if the object does not exist.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          /* camelName */Id: -1
        }
      });
      const response = await controller.putById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "deleteById" method that', () => {

    it('should handle requests at DELETE /:/* camelName */Id.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'deleteById'), 'DELETE');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'deleteById'), '/:/* camelName */Id');
    });

    it('should delete the /* camelName */ and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      const response = await controller.deleteById(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(/* camelName */2.id);

      strictEqual(/* camelName */, undefined);
    });

    it('should not delete the other /* camelName */s.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      const response = await controller.deleteById(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const /* camelName */ = await getRepository(/* upperFirstCamelName */).findOne(/* camelName */1.id);

      notStrictEqual(/* camelName */, undefined);
    });

    it('should return an HttpResponseNotFound if the /* camelName */ was not fond.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: -1
        }
      });
      const response = await controller.deleteById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
