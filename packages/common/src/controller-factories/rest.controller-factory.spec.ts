import {
  createEmptyContext,
  MethodNotAllowedError,
  NotImplementedError,
  ObjectType
} from '@foal/core';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import { ModelService } from '../services';
import { rest, RestControllerFactory } from './rest.controller-factory';

chai.use(spies);
const expect = chai.expect;

describe('rest', () => {

  let mock: Partial<ModelService<any>>;

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

      it('when service.findByIdAndRemove is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[1];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('findByIdAndRemove');
        expect(actualItem.httpMethod).to.equal('DELETE');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.findByIdAndRemove is a function.', () => {
        mock = {
          findByIdAndRemove(id: any): void {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'findByIdAndRemove');
        expect(actual).to.be.an('array');

        const actualItem = actual[1];
        const ctx = { ...createEmptyContext(), params: { id: 1 }, query: { bar: 'foo' } };

        expect(actualItem.serviceMethodName).to.equal('findByIdAndRemove');
        expect(actualItem.httpMethod).to.equal('DELETE');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.findByIdAndRemove).to.have.been.called.with.exactly(ctx.params.id);
      });

    });

    describe('should return an array of which one item handles GET /.', () => {

      it('when service.findAll is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[2];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('findAll');
        expect(actualItem.httpMethod).to.equal('GET');
        expect(actualItem.path).to.equal('/');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.findAll is a function.', () => {
        mock = {
          findAll(query: ObjectType) {
            return [];
          }
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'findAll');
        expect(actual).to.be.an('array');

        const actualItem = actual[2];
        const ctx = { ...createEmptyContext(), query: { bar: 'foo' } };

        expect(actualItem.serviceMethodName).to.equal('findAll');
        expect(actualItem.httpMethod).to.equal('GET');
        expect(actualItem.path).to.equal('/');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.findAll).to.have.been.called.with.exactly(ctx.query);
      });

    });

    describe('should return an array of which one item handles GET /:id.', () => {

      it('when service.findById is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[3];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('findById');
        expect(actualItem.httpMethod).to.equal('GET');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.findById is a function.', () => {
        mock = {
          findById(id: any) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'findById');
        expect(actual).to.be.an('array');

        const actualItem = actual[3];
        const ctx = { ...createEmptyContext(), params: { id: 1 }, query: { bar: 'foo' } };

        expect(actualItem.serviceMethodName).to.equal('findById');
        expect(actualItem.httpMethod).to.equal('GET');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.findById).to.have.been.called.with.exactly(ctx.params.id);
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

      it('when service.findByIdAndUpdate is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[5];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('findByIdAndUpdate');
        expect(actualItem.httpMethod).to.equal('PATCH');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.findByIdAndUpdate is a function.', () => {
        mock = {
          findByIdAndUpdate(id: any, data: any) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'findByIdAndUpdate');
        expect(actual).to.be.an('array');

        const actualItem = actual[5];
        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
          params: { id: 1 },
          query: { bar: 'foo' }
        };

        expect(actualItem.serviceMethodName).to.equal('findByIdAndUpdate');
        expect(actualItem.httpMethod).to.equal('PATCH');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.findByIdAndUpdate).to.have.been.called.with.exactly(ctx.params.id, ctx.body);
      });

    });

    describe('should return an array of which one item handles POST /.', () => {

      it('when service.createOne is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[6];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('createOne');
        expect(actualItem.httpMethod).to.equal('POST');
        expect(actualItem.path).to.equal('/');
        expect(actualItem.successStatus).to.equal(201);
      });

      it('when service.createOne is a function.', () => {
        mock = {
          createOne(data: any) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'createOne');
        expect(actual).to.be.an('array');

        const actualItem = actual[6];
        const ctx = { ...createEmptyContext(), body: { foo: 'bar' }, query: { bar: 'foo' }};

        expect(actualItem.serviceMethodName).to.equal('createOne');
        expect(actualItem.httpMethod).to.equal('POST');
        expect(actualItem.path).to.equal('/');
        expect(actualItem.successStatus).to.equal(201);

        actualItem.middleware(ctx);
        expect(mock.createOne).to.have.been.called.with.exactly(ctx.body);
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

      it('when service.findByIdAndReplace is undefined.', () => {
        const actual = rest.getRoutes(mock);
        expect(actual).to.be.an('array');

        const actualItem = actual[9];
        const ctx = createEmptyContext();
        expect(() => actualItem.middleware(ctx)).to.throw(NotImplementedError);
        expect(actualItem.serviceMethodName).to.equal('findByIdAndReplace');
        expect(actualItem.httpMethod).to.equal('PUT');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);
      });

      it('when service.findByIdAndReplace is a function.', () => {
        mock = {
          findByIdAndReplace(id: any, data: any) {}
        };
        const actual = rest.getRoutes(mock);
        chai.spy.on(mock, 'findByIdAndReplace');
        expect(actual).to.be.an('array');

        const actualItem = actual[9];
        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
          params: { id: 1 },
          query: { bar: 'foo' }
        };

        expect(actualItem.serviceMethodName).to.equal('findByIdAndReplace');
        expect(actualItem.httpMethod).to.equal('PUT');
        expect(actualItem.path).to.equal('/:id');
        expect(actualItem.successStatus).to.equal(200);

        actualItem.middleware(ctx);
        expect(mock.findByIdAndReplace).to.have.been.called.with.exactly(ctx.params.id, ctx.body);
      });

    });

  });

});
