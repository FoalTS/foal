// 3p
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as spies from 'chai-spies';

// FoalTS
import {
  Context,
  Controller,
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
import { ISerializer } from '../services';
import { RestController } from './rest.controller';

chai.use(spies);
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('RestController', () => {

  @Controller()
  class ConcreteController extends RestController {
    serializerClass = class {};
  }

  it('has a getQuery method that should return an empty object', () => {
    const controller = new ConcreteController(new ServiceManager());
    expect(controller.getQuery(new Context({}))).to.deep.equal({});
  });

  describe('has a "delete" method that', () => {

    it('should handle requests at DELETE /.', () => {
      expect(getHttpMethod(ConcreteController, 'delete')).to.equal('DELETE');
      expect(getPath(ConcreteController, 'delete')).to.equal('/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = new ConcreteController(new ServiceManager());
      expect(controller.delete()).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "deleteById" method that', () => {

    it('should handle requests at DELETE /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'deleteById')).to.equal('DELETE');
      expect(getPath(ConcreteController, 'deleteById')).to.equal('/:id');
    });

    it('should return a HttpResponseNotImplemented if serializer.removeOne is undefined.', async () => {
      @Service()
      class Serializer implements Partial<ISerializer> {
        createMany() {}
        createOne() {}
        findMany() {}
        findOne() {}
        // removeOne() {}
        updateOne() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        serializerClass = Serializer;
      }

      const controller = new ConcreteController(new ServiceManager());
      expect(await controller.deleteById(new Context({}))).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

    describe('when serializer.removeOne is defined', () => {

      it('should return an HttpResponseOK if serializer.removeOne resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        @Service()
        class Serializer implements Partial<ISerializer> {
          async removeOne(query) {
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;

          getQuery(ctx) {
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);
        const serializer = services.get(Serializer);

        chai.spy.on(controller, 'getQuery');
        chai.spy.on(serializer, 'removeOne');

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        const actual = await controller.deleteById(ctx);
        expect(actual).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', objects);
        expect(controller.getQuery).to.have.been.called.with.exactly(ctx);
        expect(serializer.removeOne).to.have.been.called.with.exactly({ foo: 'bar', id: 1 });
      });

      it('should return a HttpResponseNotFound if serializer.removeOne rejects an ObjectDoesNotExist.', async () => {
        @Service()
        class Serializer implements Partial<ISerializer> {
          async removeOne(query) {
            throw new ObjectDoesNotExist();
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        const actual = await controller.deleteById(ctx);
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

      it('should rejects an error if serializer.removeOne rejects one which'
          + ' is not an ObjectDoesNotExist.', () => {
        const err = new Error();
        @Service()
        class Serializer implements Partial<ISerializer> {
          async removeOne(query) {
            throw err;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        return expect(controller.deleteById(ctx)).to.be.rejectedWith(err);
      });

    });

  });

  describe('has a "get" method that', () => {

    it('should handle requests at GET /.', () => {
      expect(getHttpMethod(ConcreteController, 'get')).to.equal('GET');
      expect(getPath(ConcreteController, 'get')).to.equal('/');
    });

    it('should return an HttpResponseNotImplemented if serializer.findMany is undefined.', async () => {
      @Service()
      class Serializer implements Partial<ISerializer> {
        createMany() {}
        createOne() {}
        // findMany() {}
        findOne() {}
        removeOne() {}
        updateOne() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        serializerClass = Serializer;
      }

      const controller = new ConcreteController(new ServiceManager());
      expect(await controller.get(new Context({}))).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

    describe('when serializer.findMany is defined', () => {

      it('should return an HttpResponseOK if serializer.findMany resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        @Service()
        class Serializer implements Partial<ISerializer> {
          async findMany(query) {
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;

          getQuery(ctx) {
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);
        const serializer = services.get(Serializer);

        chai.spy.on(controller, 'getQuery');
        chai.spy.on(serializer, 'findMany');

        const ctx = new Context({});

        const actual = await controller.get(ctx);
        expect(actual).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', objects);
        expect(controller.getQuery).to.have.been.called.with.exactly(ctx);
        expect(serializer.findMany).to.have.been.called.with.exactly(query);
      });

    });

  });

  describe('has a "getById" method that', () => {

    it('should handle requests at GET /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'getById')).to.equal('GET');
      expect(getPath(ConcreteController, 'getById')).to.equal('/:id');
    });

    it('should return a HttpResponseNotImplemented if serializer.findOne is undefined.', async () => {

      @Service()
      class Serializer implements Partial<ISerializer> {
        createMany() {}
        createOne() {}
        findMany() {}
        // findOne() {}
        removeOne() {}
        updateOne() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        serializerClass = Serializer;
      }

      const controller = new ConcreteController(new ServiceManager());
      expect(await controller.getById(new Context({}))).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

    describe('when serializer.findOne is defined', () => {

      it('should return an HttpResponseOK if serializer.findOne resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        @Service()
        class Serializer implements Partial<ISerializer> {
          async findOne(query) {
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;

          getQuery(ctx) {
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);
        const serializer = services.get(Serializer);

        chai.spy.on(controller, 'getQuery');
        chai.spy.on(serializer, 'findOne');

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        const actual = await controller.getById(ctx);
        expect(actual).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', objects);
        expect(controller.getQuery).to.have.been.called.with.exactly(ctx);
        expect(serializer.findOne).to.have.been.called.with.exactly({ foo: 'bar', id: 1 });
      });

      it('should return a HttpResponseNotFound if serializer.findOne rejects an ObjectDoesNotExist.', async () => {
        @Service()
        class Serializer implements Partial<ISerializer> {
          async findOne(query) {
            throw new ObjectDoesNotExist();
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        const actual = await controller.getById(ctx);
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

      it('should rejects an error if serializer.findOne rejects one which'
          + ' is not an ObjectDoesNotExist.', () => {
        const err = new Error();
        @Service()
        class Serializer implements Partial<ISerializer> {
          async findOne(query) {
            throw err;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        return expect(controller.getById(ctx)).to.be.rejectedWith(err);
      });

    });

  });

  describe('has a "patch" method that', () => {

    it('should handle requests at PATCH /.', () => {
      expect(getHttpMethod(ConcreteController, 'patch')).to.equal('PATCH');
      expect(getPath(ConcreteController, 'patch')).to.equal('/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = new ConcreteController(new ServiceManager());
      expect(controller.patch()).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "patchById" method that', () => {

    it('should handle requests at PATCH /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'patchById')).to.equal('PATCH');
      expect(getPath(ConcreteController, 'patchById')).to.equal('/:id');
    });

    it('should return a HttpResponseNotImplemented if serializer.updateOne is undefined.', async () => {
      @Service()
      class Serializer implements Partial<ISerializer> {
        createMany() {}
        createOne() {}
        findMany() {}
        findOne() {}
        removeOne() {}
        // updateOne() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        serializerClass = Serializer;
      }

      const controller = new ConcreteController(new ServiceManager());
      expect(await controller.patchById(new Context({}))).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

    describe('when serializer.updateOne is defined', () => {

      it('should return an HttpResponseOK if serializer.updateOne resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        @Service()
        class Serializer implements Partial<ISerializer> {
          async updateOne(query, record) {
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;

          getQuery(ctx) {
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);
        const serializer = services.get(Serializer);

        chai.spy.on(controller, 'getQuery');
        chai.spy.on(serializer, 'updateOne');

        const ctx = new Context({
          body: {
            foobar: 'foo'
          },
          params: {
            id: 1
          },
        });

        const actual = await controller.patchById(ctx);
        expect(actual).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', objects);
        expect(controller.getQuery).to.have.been.called.with.exactly(ctx);
        expect(serializer.updateOne).to.have.been.called.with.exactly(
          { foo: 'bar', id: 1 },
          { foobar: 'foo' }
        );
      });

      it('should return a HttpResponseNotFound if serializer.updateOne rejects an ObjectDoesNotExist.', async () => {
        @Service()
        class Serializer implements Partial<ISerializer> {
          async updateOne(query, record) {
            throw new ObjectDoesNotExist();
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;
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
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

      it('should rejects an error if serializer.updateOne rejects one which'
          + ' is not an ObjectDoesNotExist.', () => {
        const err = new Error();
        @Service()
        class Serializer implements Partial<ISerializer> {
          async updateOne(query) {
            throw err;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        return expect(controller.patchById(ctx)).to.be.rejectedWith(err);
      });

    });

  });

  describe('has a "post" method that', () => {

    it('should handle requests at POST /.', () => {
      expect(getHttpMethod(ConcreteController, 'post')).to.equal('POST');
      expect(getPath(ConcreteController, 'post')).to.equal('/');
    });

    it('should return a HttpResponseNotImplemented if serializer.createOne is undefined.', async () => {
      @Service()
      class Serializer implements Partial<ISerializer> {
        createMany() {}
        // createOne() {}
        findMany() {}
        findOne() {}
        removeOne() {}
        updateOne() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        serializerClass = Serializer;
      }

      const controller = new ConcreteController(new ServiceManager());
      expect(await controller.post(new Context({}))).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

    it('should return an HttpResponseCreated if serializer.createOne is defined.', async () => {
      const objects = [ { bar: 'bar' }];
      @Service()
      class Serializer implements Partial<ISerializer> {
        async createOne(record) {
          return objects;
        }
      }
      @Controller()
      class ConcreteController extends RestController {
        serializerClass = Serializer;
      }

      const services = new ServiceManager();
      const controller = new ConcreteController(services);
      const serializer = services.get(Serializer);

      chai.spy.on(serializer, 'createOne');

      const ctx = new Context({
        body: {
          foobar: 'foo'
        },
      });

      const actual = await controller.post(ctx);
      expect(actual).to.be.an.instanceOf(HttpResponseCreated)
        .with.property('content', objects);
      expect(serializer.createOne).to.have.been.called.with.exactly({ foobar: 'foo' });
    });

  });

  describe('has a "postById" method that', () => {

    it('should handle requests at POST /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'postById')).to.equal('POST');
      expect(getPath(ConcreteController, 'postById')).to.equal('/:id');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = new ConcreteController(new ServiceManager());
      expect(controller.postById()).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "put" method that', () => {

    it('should handle requests at PUT /.', () => {
      expect(getHttpMethod(ConcreteController, 'put')).to.equal('PUT');
      expect(getPath(ConcreteController, 'put')).to.equal('/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = new ConcreteController(new ServiceManager());
      expect(controller.put()).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "putById" method that', () => {

    it('should handle requests at PUT /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'putById')).to.equal('PUT');
      expect(getPath(ConcreteController, 'putById')).to.equal('/:id');
    });

    it('should return a HttpResponseNotImplemented if serializer.updateOne is undefined.', async () => {
      @Service()
      class Serializer implements Partial<ISerializer> {
        createMany() {}
        createOne() {}
        findMany() {}
        findOne() {}
        removeOne() {}
        // updateOne() {}
      }
      @Controller()
      class ConcreteController extends RestController {
        serializerClass = Serializer;
      }

      const controller = new ConcreteController(new ServiceManager());
      expect(await controller.putById(new Context({}))).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

    describe('when serializer.updateOne is defined', () => {

      it('should return an HttpResponseOK if serializer.updateOne resolves.', async () => {
        const query = { foo: 'bar' };
        const objects = [ { bar: 'bar' }];
        @Service()
        class Serializer implements Partial<ISerializer> {
          async updateOne(query, record) {
            return objects;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;

          getQuery(ctx) {
            return query;
          }
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);
        const serializer = services.get(Serializer);

        chai.spy.on(controller, 'getQuery');
        chai.spy.on(serializer, 'updateOne');

        const ctx = new Context({
          body: {
            foobar: 'foo'
          },
          params: {
            id: 1
          },
        });

        const actual = await controller.putById(ctx);
        expect(actual).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', objects);
        expect(controller.getQuery).to.have.been.called.with.exactly(ctx);
        expect(serializer.updateOne).to.have.been.called.with.exactly(
          { foo: 'bar', id: 1 },
          { foobar: 'foo' }
        );
      });

      it('should return a HttpResponseNotFound if serializer.updateOne rejects an ObjectDoesNotExist.', async () => {
        @Service()
        class Serializer implements Partial<ISerializer> {
          async updateOne(query, record) {
            throw new ObjectDoesNotExist();
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;
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
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

      it('should rejects an error if serializer.updateOne rejects one which'
          + ' is not an ObjectDoesNotExist.', () => {
        const err = new Error();
        @Service()
        class Serializer implements Partial<ISerializer> {
          async updateOne(query) {
            throw err;
          }
        }
        @Controller()
        class ConcreteController extends RestController {
          serializerClass = Serializer;
        }

        const services = new ServiceManager();
        const controller = new ConcreteController(services);

        const ctx = new Context({
          params: {
            id: 1
          }
        });

        return expect(controller.putById(ctx)).to.be.rejectedWith(err);
      });

    });

  });

});
