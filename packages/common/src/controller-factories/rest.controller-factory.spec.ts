import {
  createEmptyContext,
  MethodNotAllowedError,
  NotImplementedError,
  ObjectType
} from '@foal/core';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import { CRUDService } from '../services';
import { rest, RestControllerFactory } from './rest.controller-factory';

chai.use(spies);
const expect = chai.expect;

describe('rest', () => {

  let mock: Partial<CRUDService>;

  beforeEach(() => {
    mock = {};
  });

  it('should be an instance of RestControllerFactory', () => {
    expect(rest).to.an.instanceOf(RestControllerFactory);
  });

  describe('when getRoutes(service: RestControllerFactory): Route[] is called with the mock service', () => {

    it('should return an array of which one item handles DELETE /.', () => {
      const actual = rest.getRoutes(mock);
      expect(actual).to.be.an('array');

      const actualItem = actual[0];
      const ctx = createEmptyContext();
      expect(() => actualItem.middleware(ctx)).to.throw(MethodNotAllowedError);
      expect(actualItem.serviceMethodName).to.equal(null);
      expect(actualItem.httpMethod).to.equal('DELETE');
      expect(actualItem.path).to.equal('/');
      expect(actualItem.successStatus).to.equal(200);
    });

    describe('should return an array of which one item handles DELETE /:id', () => {

      it('when service.delete is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[1];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('delete');
        expect(actualItem.httpMethod).to.equal('DELETE');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.delete is a function.', () => {
        mock = {
          delete(id: any, query: ObjectType) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'delete');
        expect(actual).to.be.an('array');

        const actualItem = actual[1];
        const ctx = { ...createEmptyContext(), params: { id: 1 }, query: { bar: 'foo' } };

        expect(actualItem.serviceMethodName).to.equal('delete');
        expect(actualItem.httpMethod).to.equal('DELETE');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.delete).to.have.been.called.with.exactly(ctx.params.id, ctx.query);
      });

    });

    describe('should return an array of which one item handles GET /.', () => {

      it('when service.getAll is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[2];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('getAll');
        expect(actualItem.httpMethod).to.equal('GET');
        expect(actualItem.path).to.equal('/');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.getAll is a function.', () => {
        mock = {
          getAll(query: ObjectType) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'getAll');
        expect(actual).to.be.an('array');

        const actualItem = actual[2];
        const ctx = { ...createEmptyContext(), query: { bar: 'foo' } };

        expect(actualItem.serviceMethodName).to.equal('getAll');
        expect(actualItem.httpMethod).to.equal('GET');
        expect(actualItem.path).to.equal('/');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.getAll).to.have.been.called.with.exactly(ctx.query);
      });

    });

    describe('should return an array of which one item handles GET /:id.', () => {

      it('when service.get is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[3];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('get');
        expect(actualItem.httpMethod).to.equal('GET');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.get is a function.', () => {
        mock = {
          get(id: any, query: ObjectType) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'get');
        expect(actual).to.be.an('array');

        const actualItem = actual[3];
        const ctx = { ...createEmptyContext(), params: { id: 1 }, query: { bar: 'foo' } };

        expect(actualItem.serviceMethodName).to.equal('get');
        expect(actualItem.httpMethod).to.equal('GET');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.get).to.have.been.called.with.exactly(ctx.params.id, ctx.query);
      });

    });

    it('should return an array of which one item handles PATCH /.', () => {
      const actual = rest.getRoutes(mock);
      expect(actual).to.be.an('array');

      const actualItem = actual[4];
      const ctx = createEmptyContext();
      expect(() => actualItem.middleware(ctx)).to.throw(MethodNotAllowedError);
      expect(actualItem.serviceMethodName).to.equal(null);
      expect(actualItem.httpMethod).to.equal('PATCH');
      expect(actualItem.path).to.equal('/');
      expect(actualItem.successStatus).to.equal(200);
    });

    describe('should return an array of which one item handles PATCH /:id.', () => {

      it('when service.modify is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[5];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('modify');
        expect(actualItem.httpMethod).to.equal('PATCH');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.modify is a function.', () => {
        mock = {
          modify(id: any, data: any, query: ObjectType) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'modify');
        expect(actual).to.be.an('array');

        const actualItem = actual[5];
        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
          params: { id: 1 },
          query: { bar: 'foo' }
        };

        expect(actualItem.serviceMethodName).to.equal('modify');
        expect(actualItem.httpMethod).to.equal('PATCH');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.modify).to.have.been.called.with.exactly(ctx.params.id, ctx.body, ctx.query);
      });

    });

    describe('should return an array of which one item handles POST /.', () => {

      it('when service.create is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[6];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('create');
        expect(actualItem.httpMethod).to.equal('POST');
        expect(actualItem.path).to.equal('/');
        expect(actualItem.successStatus).to.equal(201);
      });

      it('when service.create is a function.', () => {
        mock = {
          create(data: any, query: ObjectType) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'create');
        expect(actual).to.be.an('array');

        const actualItem = actual[6];
        const ctx = { ...createEmptyContext(), body: { foo: 'bar' }, query: { bar: 'foo' }};

        expect(actualItem.serviceMethodName).to.equal('create');
        expect(actualItem.httpMethod).to.equal('POST');
        expect(actualItem.path).to.equal('/');
        expect(actualItem.successStatus).to.equal(201);

        actualItem.middleware(ctx);
        expect(mock.create).to.have.been.called.with.exactly(ctx.body, ctx.query);
      });

    });

    it('should return an array of which one item handles POST /:id.', () => {
      const actual = rest.getRoutes(mock);
      expect(actual).to.be.an('array');

      const actualItem = actual[7];
      const ctx = createEmptyContext();
      expect(() => actualItem.middleware(ctx)).to.throw(MethodNotAllowedError);
      expect(actualItem.serviceMethodName).to.equal(null);
      expect(actualItem.httpMethod).to.equal('POST');
      expect(actualItem.path).to.equal('/:id');
      expect(actualItem.successStatus).to.equal(200);
    });

    it('should return an array of which one item handles PUT /.', () => {
      const actual = rest.getRoutes(mock);
      expect(actual).to.be.an('array');

      const actualItem = actual[8];
      const ctx = createEmptyContext();
      expect(() => actualItem.middleware(ctx)).to.throw(MethodNotAllowedError);
      expect(actualItem.serviceMethodName).to.equal(null);
      expect(actualItem.httpMethod).to.equal('PUT');
      expect(actualItem.path).to.equal('/');
      expect(actualItem.successStatus).to.equal(200);
    });

    describe('should return an array of which one item handles PUT /:id.', () => {

      it('when service.replace is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[9];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('replace');
        expect(actualItem.httpMethod).to.equal('PUT');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.replace is a function.', () => {
        mock = {
          replace(id: any, data: any, query: ObjectType) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'replace');
        expect(actual).to.be.an('array');

        const actualItem = actual[9];
        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
          params: { id: 1 },
          query: { bar: 'foo' }
        };

        expect(actualItem.serviceMethodName).to.equal('replace');
        expect(actualItem.httpMethod).to.equal('PUT');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.replace).to.have.been.called.with.exactly(ctx.params.id, ctx.body, ctx.query);
      });

    });

  });

});
