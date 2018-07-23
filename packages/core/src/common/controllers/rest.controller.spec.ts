// 3p
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

// FoalTS
import {
  Controller,
  getHttpMethod,
  getPath,
  HttpResponseMethodNotAllowed,
  HttpResponseNotImplemented,
  Service,
  ServiceManager
} from '../../core';
import { ISerializer } from '../services';
import { RestController } from './rest.controller';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('RestController', () => {

  @Controller()
  class ConcreteController extends RestController {
    serializerClass = class {};
  }

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

    it('should return a HttpResponseNotImplemented if serializer.removeOne is undefined.', () => {
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
      expect(controller.deleteById()).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

  });

  describe('has a "get" method that', () => {

    it('should handle requests at GET /.', () => {
      expect(getHttpMethod(ConcreteController, 'get')).to.equal('GET');
      expect(getPath(ConcreteController, 'get')).to.equal('/');
    });

    it('should return a HttpResponseNotImplemented if serializer.findMany is undefined.', () => {
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
      expect(controller.get()).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

  });

  describe('has a "getById" method that', () => {

    it('should handle requests at GET /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'getById')).to.equal('GET');
      expect(getPath(ConcreteController, 'getById')).to.equal('/:id');
    });

    it('should return a HttpResponseNotImplemented if serializer.findOne is undefined.', () => {

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
      expect(controller.getById()).to.be.an.instanceOf(HttpResponseNotImplemented);
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

    it('should return a HttpResponseNotImplemented if serializer.updateOne is undefined.', () => {
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
      expect(controller.patchById()).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

  });

  describe('has a "post" method that', () => {

    it('should handle requests at POST /.', () => {
      expect(getHttpMethod(ConcreteController, 'post')).to.equal('POST');
      expect(getPath(ConcreteController, 'post')).to.equal('/');
    });

    it('should return a HttpResponseNotImplemented if serializer.createOne is undefined.', () => {
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
      expect(controller.post()).to.be.an.instanceOf(HttpResponseNotImplemented);
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

    it('should return a HttpResponseNotImplemented if serializer.updateOne is undefined.', () => {
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
      expect(controller.putById()).to.be.an.instanceOf(HttpResponseNotImplemented);
    });

  });

});
