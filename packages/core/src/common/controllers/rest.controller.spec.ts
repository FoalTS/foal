// std
import { deepStrictEqual, fail, ok, strict, strictEqual } from 'assert';

// FoalTS
import { AbstractUser } from '../../auth';
import {
  Context,
  Controller,
  createController,
  getHttpMethod,
  getPath,
  HttpResponseCreated,
  HttpResponseMethodNotAllowed,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
  Service,
  ServiceManager
} from '../../core';
import { ObjectDoesNotExist } from '../errors';
import { IResourceCollection } from '../services';
import { RestController } from './rest.controller';

describe('RestController', () => {

  @Controller()
  class ConcreteController extends RestController {
    collectionClass = class {};
  }

  it('has a getQuery method that should return an empty object', () => {
    const controller = createController(ConcreteController);
    deepStrictEqual(controller.getQuery(new Context({})), {});
  });

  describe('has a "delete" method that', () => {

    it('should handle requests at DELETE /.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'delete'), 'DELETE');
      strictEqual(getPath(ConcreteController, 'delete'), '/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = createController(ConcreteController);
      ok(controller.delete() instanceof HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "deleteById" method that', () => {

    it('should handle requests at DELETE /:id.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'deleteById'), 'DELETE');
      strictEqual(getPath(ConcreteController, 'deleteById'), '/:id');
    });

    it('should return a HttpResponseNotImplemented if collection.deleteById is undefined.', async () => {
      @Service()
      class Collection implements Partial<IResourceCollection> {
        createMany() {}
        create() {}
        find() {}
        findById() {}
        // deleteById() {}
        updateById() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const controller = createController(ConcreteController);
      ok(await controller.deleteById(new Context({})) instanceof HttpResponseNotImplemented);
    });

    describe('when collection.deleteById is defined', () => {

      it('should return an HttpResponseOK if collection.deleteById resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        let deleteByIdQuery;
        let deleteByIdUser;
        let getQueryCtx;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async deleteById(user, id, query) {
            deleteByIdUser = user;
            deleteByIdQuery = query;
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;

          getQuery(ctx) {
            getQueryCtx = ctx;
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });
        ctx.user = {} as AbstractUser;

        const actual = await controller.deleteById(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(getQueryCtx, ctx);
        strictEqual(deleteByIdUser, ctx.user);
        deepStrictEqual(deleteByIdQuery, { foo: 'bar', id: 1 });
      });

      it('should return a HttpResponseNotFound if collection.deleteById rejects an ObjectDoesNotExist.', async () => {
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async deleteById(user, id, query) {
            throw new ObjectDoesNotExist();
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        const actual = await controller.deleteById(ctx);
        ok(actual instanceof HttpResponseNotFound);
      });

      it('should rejects an error if collection.deleteById rejects one which'
          + ' is not an ObjectDoesNotExist.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async deleteById(user, id, query) {
            throw err;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        return controller.deleteById(ctx)
          .then(() => fail('This promise should be rejected.'))
          .catch(error => strictEqual(error, err));
      });

    });

  });

  describe('has a "get" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'get'), 'GET');
      strictEqual(getPath(ConcreteController, 'get'), '/');
    });

    it('should return an HttpResponseNotImplemented if collection.find is undefined.', async () => {
      @Service()
      class Collection implements Partial<IResourceCollection> {
        createMany() {}
        create() {}
        // find() {}
        findById() {}
        deleteById() {}
        updateById() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const controller = createController(ConcreteController);
      ok(await controller.get(new Context({})) instanceof HttpResponseNotImplemented);
    });

    describe('when collection.find is defined', () => {

      it('should return an HttpResponseOK if collection.find resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        let findUser;
        let findQuery;
        let getQueryCtx;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async find(user, { query }) {
            findUser = user;
            findQuery = query;
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;

          getQuery(ctx) {
            getQueryCtx = ctx;
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({});
        ctx.user = {} as AbstractUser;

        const actual = await controller.get(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(getQueryCtx, ctx);
        strictEqual(findQuery, query);
        strictEqual(findUser, ctx.user);
      });

    });

  });

  describe('has a "getById" method that', () => {

    it('should handle requests at GET /:id.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'getById'), 'GET');
      strictEqual(getPath(ConcreteController, 'getById'), '/:id');
    });

    it('should return a HttpResponseNotImplemented if collection.findById is undefined.', async () => {

      @Service()
      class Collection implements Partial<IResourceCollection> {
        createMany() {}
        create() {}
        find() {}
        // findById() {}
        deleteById() {}
        updateById() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const controller = createController(ConcreteController);
      ok(await controller.getById(new Context({})) instanceof HttpResponseNotImplemented);
    });

    describe('when collection.findById is defined', () => {

      it('should return an HttpResponseOK if collection.findById resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        let findByIdUser;
        let findByIdQuery;
        let getQueryCtx;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async findById(user, id, query) {
            findByIdUser = user;
            findByIdQuery = query;
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;

          getQuery(ctx) {
            getQueryCtx = ctx;
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });
        ctx.user = {} as AbstractUser;

        const actual = await controller.getById(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(getQueryCtx, ctx);
        strictEqual(findByIdUser, ctx.user);
        deepStrictEqual(findByIdQuery, { foo: 'bar', id: 1 });
      });

      it('should return a HttpResponseNotFound if collection.findById rejects an ObjectDoesNotExist.', async () => {
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async findById(user, id, query) {
            throw new ObjectDoesNotExist();
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        const actual = await controller.getById(ctx);
        ok(actual instanceof HttpResponseNotFound);
      });

      it('should rejects an error if collection.findById rejects one which'
          + ' is not an ObjectDoesNotExist.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async findById(user, id, query) {
            throw err;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        return controller.getById(ctx)
          .then(() => fail('This promise should be rejected.'))
          .catch(error => strictEqual(error, err));
      });

    });

  });

  describe('has a "patch" method that', () => {

    it('should handle requests at PATCH /.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'patch'), 'PATCH');
      strictEqual(getPath(ConcreteController, 'patch'), '/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = createController(ConcreteController);
      ok(controller.patch() instanceof HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "patchById" method that', () => {

    it('should handle requests at PATCH /:id.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'patchById'), 'PATCH');
      strictEqual(getPath(ConcreteController, 'patchById'), '/:id');
    });

    it('should return a HttpResponseNotImplemented if collection.updateById is undefined.', async () => {
      @Service()
      class Collection implements Partial<IResourceCollection> {
        createMany() {}
        create() {}
        find() {}
        findById() {}
        deleteById() {}
        // updateById() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const controller = createController(ConcreteController);
      ok(await controller.patchById(new Context({})) instanceof HttpResponseNotImplemented);
    });

    describe('when collection.updateById is defined', () => {

      it('should return an HttpResponseOK if collection.updateById resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        let updateByIdUser;
        let updateByIdQuery;
        let updateByIdRecord;
        let getQueryCtx;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async updateById(user, id, query, record) {
            updateByIdUser = user;
            updateByIdQuery = query;
            updateByIdRecord = record;
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;

          getQuery(ctx) {
            getQueryCtx = ctx;
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          body: {
            foobar: 'foo'
          },
          params: {
            id: 1
          },
        });
        ctx.user = {} as AbstractUser;

        const actual = await controller.patchById(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(getQueryCtx, ctx);
        strictEqual(updateByIdUser, ctx.user);
        deepStrictEqual(updateByIdQuery, { foo: 'bar', id: 1 });
        strictEqual(updateByIdRecord, ctx.request.body);
      });

      it('should return a HttpResponseNotFound if collection.updateById rejects an ObjectDoesNotExist.', async () => {
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async updateById(user, id, query, record) {
            throw new ObjectDoesNotExist();
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          body: {
            foobar: 'foo'
          },
          params: {
            id: 1
          }
        });

        const actual = await controller.patchById(ctx);
        ok(actual instanceof HttpResponseNotFound);
      });

      it('should rejects an error if collection.updateById rejects one which'
          + ' is not an ObjectDoesNotExist.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async updateById(user, id, query, record) {
            throw err;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        return controller.patchById(ctx)
          .then(() => fail('This promise should be rejected.'))
          .catch(error => strictEqual(error, err));
      });

    });

  });

  describe('has a "post" method that', () => {

    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'post'), 'POST');
      strictEqual(getPath(ConcreteController, 'post'), '/');
    });

    it('should return a HttpResponseNotImplemented if collection.create is undefined.', async () => {
      @Service()
      class Collection implements Partial<IResourceCollection> {
        createMany() {}
        // create() {}
        find() {}
        findById() {}
        deleteById() {}
        updateById() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const controller = createController(ConcreteController);
      ok(await controller.post(new Context({})) instanceof HttpResponseNotImplemented);
    });

    it('should return an HttpResponseCreated if collection.create is defined.', async () => {
      const objects = [ { bar: 'bar' }];
      let createUser;
      let createRecord;
      @Service()
      class Collection implements Partial<IResourceCollection> {
        async create(user, record) {
          createUser = user;
          createRecord = record;
          return objects;
        }
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const services = new ServiceManager();
      const controller = new ConcreteController(services);

      const ctx = new Context({
        body: {
          foobar: 'foo'
        },
      });
      ctx.user = {} as AbstractUser;

      const actual = await controller.post(ctx);
      ok(actual instanceof HttpResponseCreated);
      strictEqual(actual.content, objects);
      strictEqual(createUser, ctx.user);
      strictEqual(createRecord, ctx.request.body);
    });

  });

  describe('has a "postById" method that', () => {

    it('should handle requests at POST /:id.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'postById'), 'POST');
      strictEqual(getPath(ConcreteController, 'postById'), '/:id');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = createController(ConcreteController);
      ok(controller.postById() instanceof HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "put" method that', () => {

    it('should handle requests at PUT /.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'put'), 'PUT');
      strictEqual(getPath(ConcreteController, 'put'), '/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = createController(ConcreteController);
      ok(controller.put() instanceof HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "putById" method that', () => {

    it('should handle requests at PUT /:id.', () => {
      strictEqual(getHttpMethod(ConcreteController, 'putById'), 'PUT');
      strictEqual(getPath(ConcreteController, 'putById'), '/:id');
    });

    it('should return a HttpResponseNotImplemented if collection.updateById is undefined.', async () => {
      @Service()
      class Collection implements Partial<IResourceCollection> {
        createMany() {}
        create() {}
        find() {}
        findById() {}
        deleteById() {}
        // updateById() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const controller = createController(ConcreteController);
      ok(await controller.putById(new Context({})) instanceof HttpResponseNotImplemented);
    });

    describe('when collection.updateById is defined', () => {

      it('should return an HttpResponseOK if collection.updateById resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        let updateByIdUser;
        let updateByIdQuery;
        let updateByIdRecord;
        let getQueryCtx;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async updateById(user, id, query, record) {
            updateByIdUser = user;
            updateByIdQuery = query;
            updateByIdRecord = record;
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;

          getQuery(ctx) {
            getQueryCtx = ctx;
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          body: {
            foobar: 'foo'
          },
          params: {
            id: 1
          },
        });
        ctx.user = {} as AbstractUser;

        const actual = await controller.putById(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(getQueryCtx, ctx);
        strictEqual(updateByIdUser, ctx.user);
        deepStrictEqual(updateByIdQuery, { foo: 'bar', id: 1 });
        strictEqual(updateByIdRecord, ctx.request.body);
      });

      it('should return a HttpResponseNotFound if collection.updateById rejects an ObjectDoesNotExist.', async () => {
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async updateById(user, id, query, record) {
            throw new ObjectDoesNotExist();
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          body: {
            foobar: 'foo'
          },
          params: {
            id: 1
          }
        });

        const actual = await controller.putById(ctx);
        ok(actual instanceof HttpResponseNotFound);
      });

      it('should rejects an error if collection.updateById rejects one which'
          + ' is not an ObjectDoesNotExist.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async updateById(user, id, query, record) {
            throw err;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          collectionClass = Collection;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        return controller.putById(ctx)
          .then(() => fail('This promise should be rejected.'))
          .catch(error => strictEqual(error, err));
      });

    });

  });

});
