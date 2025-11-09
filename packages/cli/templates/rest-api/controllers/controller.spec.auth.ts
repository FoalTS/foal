// std
import { notStrictEqual, ok, strictEqual } from 'assert';

// 3p
import {
  Context, createController, getHttpMethod, getPath,
  isHttpResponseCreated, isHttpResponseNoContent,
  isHttpResponseNotFound, isHttpResponseOK
} from '@foal/core';
import { DataSource } from 'typeorm';

// App
import { /* upperFirstCamelName */, User } from '/* entitiesPath */';
import { createDataSource } from '/* createDataSourcePath */';
import { /* upperFirstCamelName */Controller } from './/* kebabName */.controller';

describe('/* upperFirstCamelName */Controller', () => {

  let dataSource: DataSource;
  let controller: /* upperFirstCamelName */Controller;
  let /* camelName */0: /* upperFirstCamelName */;
  let /* camelName */1: /* upperFirstCamelName */;
  let /* camelName */2: /* upperFirstCamelName */;
  let user1: User;
  let user2: User;

  before(async () => {
    dataSource = createDataSource();
    await dataSource.initialize();
  });

  after(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    controller = createController(/* upperFirstCamelName */Controller);

    await /* upperFirstCamelName */.clear();
    await User.clear();

    [ user1, user2 ] = await User.save([
      {},
      {},
    ]);

    [ /* camelName */0, /* camelName */1, /* camelName */2 ] = await /* upperFirstCamelName */.save([
      {
        owner: user1,
        text: '/* upperFirstCamelName */ 0',
      },
      {
        owner: user2,
        text: '/* upperFirstCamelName */ 1',
      },
      {
        owner: user2,
        text: '/* upperFirstCamelName */ 2',
      },
    ]);
  });

  describe('has a "find/* upperFirstCamelName */s" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'find/* upperFirstCamelName */s'), 'GET');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'find/* upperFirstCamelName */s'), undefined);
    });

    it('should return an HttpResponseOK object with the /* camelName */ list.', async () => {
      const ctx = new Context({ query: {} });
      ctx.user = user2;
      const response = await controller.find/* upperFirstCamelName */s(ctx);

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
      const /* camelName */3 = await /* upperFirstCamelName */.save({
        owner: user2,
        text: '/* upperFirstCamelName */ 3',
      });

      let ctx = new Context({
        query: {
          take: 2
        }
      });
      ctx.user = user2;
      let response = await controller.find/* upperFirstCamelName */s(ctx);

      strictEqual(response.body.length, 2);
      ok(response.body.find(/* camelName */ => /* camelName */.id === /* camelName */1.id));
      ok(response.body.find(/* camelName */ => /* camelName */.id === /* camelName */2.id));
      ok(!response.body.find(/* camelName */ => /* camelName */.id === /* camelName */3.id));

      ctx = new Context({
        query: {
          skip: 1
        }
      });
      ctx.user = user2;
      response = await controller.find/* upperFirstCamelName */s(ctx);

      strictEqual(response.body.length, 2);
      ok(!response.body.find(/* camelName */ => /* camelName */.id === /* camelName */1.id));
      ok(response.body.find(/* camelName */ => /* camelName */.id === /* camelName */2.id));
      ok(response.body.find(/* camelName */ => /* camelName */.id === /* camelName */3.id));
    });

  });

  describe('has a "find/* upperFirstCamelName */ById" method that', () => {

    it('should handle requests at GET /:/* camelName */Id.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'find/* upperFirstCamelName */ById'), 'GET');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'find/* upperFirstCamelName */ById'), '/:/* camelName */Id');
    });

    it('should return an HttpResponseOK object if the /* camelName */ was found.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      ctx.user = user2;
      const response = await controller.find/* upperFirstCamelName */ById(ctx);

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
      ctx.user = user2;
      const response = await controller.find/* upperFirstCamelName */ById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

    it('should return an HttpResponseNotFound object if the /* camelName */ belongs to another user.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: /* camelName */0.id
        }
      });
      ctx.user = user2;
      const response = await controller.find/* upperFirstCamelName */ById(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "create/* upperFirstCamelName */" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'create/* upperFirstCamelName */'), 'POST');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'create/* upperFirstCamelName */'), undefined);
    });

    it('should create the /* camelName */ in the database and return it through '
        + 'an HttpResponseCreated object.', async () => {
      const ctx = new Context({
        body: {
          text: '/* upperFirstCamelName */ 3',
        }
      });
      ctx.user = user2;
      const response = await controller.create/* upperFirstCamelName */(ctx);

      if (!isHttpResponseCreated(response)) {
        throw new Error('The returned value should be an HttpResponseCreated object.');
      }

      const /* camelName */ = await /* upperFirstCamelName */.findOne({
        relations: { owner: true },
        where: { text: '/* upperFirstCamelName */ 3' },
      });

      if (!/* camelName */) {
        throw new Error('No /* camelName */ 3 was found in the database.');
      }

      strictEqual(/* camelName */.text, '/* upperFirstCamelName */ 3');
      strictEqual(/* camelName */.owner.id, user2.id);

      strictEqual(response.body.id, /* camelName */.id);
      strictEqual(response.body.text, /* camelName */.text);
    });

  });

  describe('has a "modify/* upperFirstCamelName */" method that', () => {

    it('should handle requests at PATCH /:/* camelName */Id.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'modify/* upperFirstCamelName */'), 'PATCH');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'modify/* upperFirstCamelName */'), '/:/* camelName */Id');
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
      ctx.user = user2;
      const response = await controller.modify/* upperFirstCamelName */(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const /* camelName */ = await /* upperFirstCamelName */.findOneBy({ id: /* camelName */2.id });

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
      ctx.user = user2;
      await controller.modify/* upperFirstCamelName */(ctx);

      const /* camelName */ = await /* upperFirstCamelName */.findOneBy({ id: /* camelName */1.id });

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
      ctx.user = user2;
      const response = await controller.modify/* upperFirstCamelName */(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

    it('should return an HttpResponseNotFound if the object belongs to another user.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          /* camelName */Id: /* camelName */0.id
        }
      });
      ctx.user = user2;
      const response = await controller.modify/* upperFirstCamelName */(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "replace/* upperFirstCamelName */" method that', () => {

    it('should handle requests at PUT /:/* camelName */Id.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'replace/* upperFirstCamelName */'), 'PUT');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'replace/* upperFirstCamelName */'), '/:/* camelName */Id');
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
      ctx.user = user2;
      const response = await controller.replace/* upperFirstCamelName */(ctx);

      if (!isHttpResponseOK(response)) {
        throw new Error('The returned value should be an HttpResponseOK object.');
      }

      const /* camelName */ = await /* upperFirstCamelName */.findOneBy({ id: /* camelName */2.id });

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
      ctx.user = user2;
      await controller.replace/* upperFirstCamelName */(ctx);

      const /* camelName */ = await /* upperFirstCamelName */.findOneBy({ id: /* camelName */1.id });

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
      ctx.user = user2;
      const response = await controller.replace/* upperFirstCamelName */(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

    it('should return an HttpResponseNotFound if the object belongs to another user.', async () => {
      const ctx = new Context({
        body: {
          text: '',
        },
        params: {
          /* camelName */Id: /* camelName */0.id
        }
      });
      ctx.user = user2;
      const response = await controller.replace/* upperFirstCamelName */(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

  describe('has a "delete/* upperFirstCamelName */" method that', () => {

    it('should handle requests at DELETE /:/* camelName */Id.', () => {
      strictEqual(getHttpMethod(/* upperFirstCamelName */Controller, 'delete/* upperFirstCamelName */'), 'DELETE');
      strictEqual(getPath(/* upperFirstCamelName */Controller, 'delete/* upperFirstCamelName */'), '/:/* camelName */Id');
    });

    it('should delete the /* camelName */ and return an HttpResponseNoContent object.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      ctx.user = user2;
      const response = await controller.delete/* upperFirstCamelName */(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const /* camelName */ = await /* upperFirstCamelName */.findOneBy({ id: /* camelName */2.id });

      strictEqual(/* camelName */, null);
    });

    it('should not delete the other /* camelName */s.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: /* camelName */2.id
        }
      });
      ctx.user = user2;
      const response = await controller.delete/* upperFirstCamelName */(ctx);

      if (!isHttpResponseNoContent(response)) {
        throw new Error('The returned value should be an HttpResponseNoContent object.');
      }

      const /* camelName */ = await /* upperFirstCamelName */.findOneBy({ id: /* camelName */1.id });

      notStrictEqual(/* camelName */, null);
    });

    it('should return an HttpResponseNotFound if the /* camelName */ was not found.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: -1
        }
      });
      ctx.user = user2;
      const response = await controller.delete/* upperFirstCamelName */(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

    it('should return an HttpResponseNotFound if the /* camelName */ belongs to another user.', async () => {
      const ctx = new Context({
        params: {
          /* camelName */Id: /* camelName */0.id
        }
      });
      ctx.user = user2;
      const response = await controller.delete/* upperFirstCamelName */(ctx);

      if (!isHttpResponseNotFound(response)) {
        throw new Error('The returned value should be an HttpResponseNotFound object.');
      }
    });

  });

});
