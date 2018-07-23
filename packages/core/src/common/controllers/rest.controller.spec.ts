// 3p
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

// FoalTS
import { Controller, getHttpMethod, getPath, HttpResponseMethodNotAllowed } from '../../core';
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
      const controller = new ConcreteController();
      expect(controller.delete()).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "deleteById" method that', () => {

    it('should handle requests at DELETE /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'deleteById')).to.equal('DELETE');
      expect(getPath(ConcreteController, 'deleteById')).to.equal('/:id');
    });

  });

  describe('has a "get" method that', () => {

    it('should handle requests at GET /.', () => {
      expect(getHttpMethod(ConcreteController, 'get')).to.equal('GET');
      expect(getPath(ConcreteController, 'get')).to.equal('/');
    });

  });

  describe('has a "getById" method that', () => {

    it('should handle requests at GET /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'getById')).to.equal('GET');
      expect(getPath(ConcreteController, 'getById')).to.equal('/:id');
    });

  });

  describe('has a "patch" method that', () => {

    it('should handle requests at PATCH /.', () => {
      expect(getHttpMethod(ConcreteController, 'patch')).to.equal('PATCH');
      expect(getPath(ConcreteController, 'patch')).to.equal('/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = new ConcreteController();
      expect(controller.patch()).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "patchById" method that', () => {

    it('should handle requests at PATCH /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'patchById')).to.equal('PATCH');
      expect(getPath(ConcreteController, 'patchById')).to.equal('/:id');
    });

  });

  describe('has a "post" method that', () => {

    it('should handle requests at POST /.', () => {
      expect(getHttpMethod(ConcreteController, 'post')).to.equal('POST');
      expect(getPath(ConcreteController, 'post')).to.equal('/');
    });

  });

  describe('has a "postById" method that', () => {

    it('should handle requests at POST /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'postById')).to.equal('POST');
      expect(getPath(ConcreteController, 'postById')).to.equal('/:id');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = new ConcreteController();
      expect(controller.postById()).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "put" method that', () => {

    it('should handle requests at PUT /.', () => {
      expect(getHttpMethod(ConcreteController, 'put')).to.equal('PUT');
      expect(getPath(ConcreteController, 'put')).to.equal('/');
    });

    it('should return a HttpResponseMethodNotAllowed.', () => {
      const controller = new ConcreteController();
      expect(controller.put()).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

  });

  describe('has a "putById" method that', () => {

    it('should handle requests at PUT /:id.', () => {
      expect(getHttpMethod(ConcreteController, 'putById')).to.equal('PUT');
      expect(getPath(ConcreteController, 'putById')).to.equal('/:id');
    });

  });

});
