// std
import { deepStrictEqual, fail, ok, strictEqual } from 'assert';

// FoalTS
import { AbstractUser } from '../../auth';
import {
  Context,
  Controller,
  createController,
  getHttpMethod,
  getPath,
  HttpResponseBadRequest,
  HttpResponseCreated,
  HttpResponseForbidden,
  HttpResponseMethodNotAllowed,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
  Service,
  ServiceManager
} from '../../core';
import { ObjectDoesNotExist, PermissionDenied, ValidationError } from '../errors';
import { CollectionParams, IResourceCollection } from '../services';
import { RestController } from './rest.controller';

describe('RestController', () => {

  @Controller()
  class ConcreteController extends RestController {
    collectionClass = class {};
  }

  it('has a extendParams method that should return the given params', () => {
    const controller = createController(ConcreteController);
    const params: CollectionParams = {};
    strictEqual(controller.extendParams(new Context({}), params), params);
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
        create() {}
        find() {}
        findById() {}
        // deleteById() {}
        modifyById() {}
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
        const objects = [ { bar: 'bar' } ];
        let deleteByIdParams;
        let deleteByIdId;
        let deleteByIdUser;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async deleteById(user, id, params) {
            deleteByIdUser = user;
            deleteByIdId = id;
            deleteByIdParams = params;
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
          params: {
            id: 1
          }
        });
        ctx.user = {} as AbstractUser;

        const actual = await controller.deleteById(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(deleteByIdUser, ctx.user);
        strictEqual(deleteByIdId, ctx.request.params.id);
        deepStrictEqual(deleteByIdParams, {});
      });

      function testErrors(errorClass, httpResponseClass) {
        it(`should return a ${httpResponseClass.name} if collection.deleteById rejects`
            + ` a ${errorClass.name}.`, async () => {
          const content = {};
          @Service()
          class Collection implements Partial<IResourceCollection> {
            async deleteById() {
              throw new errorClass(content);
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
          ok(actual instanceof httpResponseClass);
          strictEqual(actual.content, content);
        });
      }

      testErrors(ObjectDoesNotExist, HttpResponseNotFound);
      testErrors(ValidationError, HttpResponseBadRequest);
      testErrors(PermissionDenied, HttpResponseForbidden);

      it('should rejects an error if collection.deleteById rejects one which'
          + ' is not an ObjectDoesNotExist, a ValidationError nor a PermissionDenied.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async deleteById(user, id, params) {
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
        create() {}
        // find() {}
        findById() {}
        deleteById() {}
        modifyById() {}
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
        const objects = [ { bar: 'bar' } ];
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

          extendParams(ctx, params: CollectionParams) {
            getQueryCtx = ctx;
            return { ...params, query };
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

      function testErrors(errorClass, httpResponseClass) {
        it(`should return a ${httpResponseClass.name} if collection.find rejects`
            + ` a ${errorClass.name}.`, async () => {
          const content = {};
          @Service()
          class Collection implements Partial<IResourceCollection> {
            async find() {
              throw new errorClass(content);
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

          const actual = await controller.get(ctx);
          ok(actual instanceof httpResponseClass);
          strictEqual(actual.content, content);
        });
      }

      testErrors(ValidationError, HttpResponseBadRequest);
      testErrors(PermissionDenied, HttpResponseForbidden);

      it('should rejects an error if collection.find rejects one which'
          + ' is not a ValidationError nor a PermissionDenied.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async find() {
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

        return controller.get(ctx)
          .then(() => fail('This promise should be rejected.'))
          .catch(error => strictEqual(error, err));
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
        create() {}
        find() {}
        // findById() {}
        deleteById() {}
        modifyById() {}
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
        const objects = [ { bar: 'bar' }];
        let findByIdUser;
        let findByIdId;
        let findByIdParams;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async findById(user, id, params) {
            findByIdUser = user;
            findByIdId = id;
            findByIdParams = params;
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
          params: {
            id: 1
          }
        });
        ctx.user = {} as AbstractUser;

        const actual = await controller.getById(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(findByIdUser, ctx.user);
        strictEqual(findByIdId, ctx.request.params.id);
        deepStrictEqual(findByIdParams, {});
      });

      function testErrors(errorClass, httpResponseClass) {
        it(`should return a ${httpResponseClass.name} if collection.findById rejects`
            + ` a ${errorClass.name}.`, async () => {
          const content = {};
          @Service()
          class Collection implements Partial<IResourceCollection> {
            async findById() {
              throw new errorClass(content);
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
          ok(actual instanceof httpResponseClass);
          strictEqual(actual.content, content);
        });
      }

      testErrors(ObjectDoesNotExist, HttpResponseNotFound);
      testErrors(ValidationError, HttpResponseBadRequest);
      testErrors(PermissionDenied, HttpResponseForbidden);

      it('should rejects an error if collection.findById rejects one which'
          + ' is not an ObjectDoesNotExist, a ValidationError nor a PermissionDenied.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async findById(user, id, params) {
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

    it('should return a HttpResponseNotImplemented if collection.modifyById is undefined.', async () => {
      @Service()
      class Collection implements Partial<IResourceCollection> {
        create() {}
        find() {}
        findById() {}
        deleteById() {}
        // modifyById() {}
        updateById() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const controller = createController(ConcreteController);
      ok(await controller.patchById(new Context({ params: { id: 1 }})) instanceof HttpResponseNotImplemented);
    });

    describe('when collection.modifyById is defined', () => {

      it('should return an HttpResponseOK if collection.modifyById resolves.', async () => {
        const objects = [ { bar: 'bar' }];
        let modifyByIdUser;
        let modifyByIdId;
        let modifyByIdData;
        let modifyByIdParams;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async modifyById(user, id, data, params) {
            modifyByIdUser = user;
            modifyByIdId = id;
            modifyByIdData = data;
            modifyByIdParams = params;
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
          params: {
            id: 1
          },
        });
        ctx.user = {} as AbstractUser;

        const actual = await controller.patchById(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(modifyByIdUser, ctx.user);
        strictEqual(modifyByIdId, ctx.request.params.id);
        strictEqual(modifyByIdData, ctx.request.body);
        deepStrictEqual(modifyByIdParams, {});
      });

      function testErrors(errorClass, httpResponseClass) {
        it(`should return a ${httpResponseClass.name} if collection.modifyById rejects`
            + ` a ${errorClass.name}.`, async () => {
          const content = {};
          @Service()
          class Collection implements Partial<IResourceCollection> {
            async modifyById() {
              throw new errorClass(content);
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

          const actual = await controller.patchById(ctx);
          ok(actual instanceof httpResponseClass);
          strictEqual(actual.content, content);
        });
      }

      testErrors(ObjectDoesNotExist, HttpResponseNotFound);
      testErrors(ValidationError, HttpResponseBadRequest);
      testErrors(PermissionDenied, HttpResponseForbidden);

      it('should rejects an error if collection.modifyById rejects one which'
          + ' is not an ObjectDoesNotExist, a ValidationError nor a PermissionDenied.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async modifyById(user, id, data, params) {
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
        // create() {}
        find() {}
        findById() {}
        deleteById() {}
        modifyById() {}
        updateById() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        collectionClass = Collection;
      }

      const controller = createController(ConcreteController);
      ok(await controller.post(new Context({})) instanceof HttpResponseNotImplemented);
    });

    describe('when collection.create is defined', () => {

      it('should return an HttpResponseCreated if collection.create resolves.', async () => {
        const objects = [ { bar: 'bar' } ];
        let createUser;
        let createData;
        let createParams;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async create(user, data, params) {
            createUser = user;
            createData = data;
            createParams = params;
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
        strictEqual(createData, ctx.request.body);
        deepStrictEqual(createParams, {});
      });

      function testErrors(errorClass, httpResponseClass) {
        it(`should return a ${httpResponseClass.name} if collection.create rejects`
            + ` a ${errorClass.name}.`, async () => {
          const content = {};
          @Service()
          class Collection implements Partial<IResourceCollection> {
            async create() {
              throw new errorClass(content);
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

          const actual = await controller.post(ctx);
          ok(actual instanceof httpResponseClass);
          strictEqual(actual.content, content);
        });
      }

      testErrors(ValidationError, HttpResponseBadRequest);
      testErrors(PermissionDenied, HttpResponseForbidden);

      it('should rejects an error if collection.create rejects one which'
          + ' is not a ValidationError nor a PermissionDenied.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async create() {
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

        return controller.post(ctx)
          .then(() => fail('This promise should be rejected.'))
          .catch(error => strictEqual(error, err));
      });

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
        create() {}
        find() {}
        findById() {}
        deleteById() {}
        modifyById() {}
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
        const objects = [ { bar: 'bar' }];
        let updateByIdUser;
        let updateByIdId;
        let updateByIdData;
        let updateByIdParams;
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async updateById(user, id, data, params) {
            updateByIdUser = user;
            updateByIdId = id;
            updateByIdData = data;
            updateByIdParams = params;
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
          params: {
            id: 1
          },
        });
        ctx.user = {} as AbstractUser;

        const actual = await controller.putById(ctx);
        ok(actual instanceof HttpResponseOK);
        strictEqual(actual.content, objects);
        strictEqual(updateByIdUser, ctx.user);
        strictEqual(updateByIdId, ctx.request.params.id);
        strictEqual(updateByIdData, ctx.request.body);
        deepStrictEqual(updateByIdParams, {});
      });

      function testErrors(errorClass, httpResponseClass) {
        it(`should return a ${httpResponseClass.name} if collection.updateById rejects`
            + ` a ${errorClass.name}.`, async () => {
          const content = {};
          @Service()
          class Collection implements Partial<IResourceCollection> {
            async updateById() {
              throw new errorClass(content);
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

          const actual = await controller.putById(ctx);
          ok(actual instanceof httpResponseClass);
          strictEqual(actual.content, content);
        });
      }

      testErrors(ObjectDoesNotExist, HttpResponseNotFound);
      testErrors(ValidationError, HttpResponseBadRequest);
      testErrors(PermissionDenied, HttpResponseForbidden);

      it('should rejects an error if collection.updateById rejects one which'
          + ' is not an ObjectDoesNotExist, a ValidationError nor a PermissionDenied.', () => {
        const err = new Error();
        @Service()
        class Collection implements Partial<IResourceCollection> {
          async updateById(user, id, data, params) {
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
