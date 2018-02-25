import {
  createEmptyContext,
  HttpResponseMethodNotAllowed,
  HttpResponseNotImplemented,
  ObjectType,
  Service,
  ServiceManager
} from '@foal/core';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import { ModelService } from '../services';
import { rest, RestControllerFactory } from './rest.controller-factory';

chai.use(spies);
const expect = chai.expect;

describe('rest', () => {

  @Service()
  class EmptyMockService implements Partial<ModelService<any>> {
    constructor() {}
  }

  it('should be an instance of RestControllerFactory', () => {
    expect(rest).to.an.instanceOf(RestControllerFactory);
  });

  describe('when attachService is called', () => {

    it('should return a controller with a proper "deleteAll" route.', async () => {
      const controller = rest.attachService('/', EmptyMockService);
      const actual = controller.getRoute('deleteAll');

      expect(actual.httpMethod).to.equal('DELETE');
      expect(actual.path).to.equal('/');

      const ctx = createEmptyContext();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "deleteById" route that handles', () => {

      it('when service.findByIdAndRemove is undefined.', async () => {
        const controller = rest.attachService('/', EmptyMockService);
        const actual = controller.getRoute('deleteById');

        expect(actual.httpMethod).to.equal('DELETE');
        expect(actual.path).to.equal('/:id');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findByIdAndRemove is a function.', async () => {
        @Service()
        class MockService implements Partial<ModelService<any>> {
          constructor() {}
          async findByIdAndRemove(id: any): Promise<void> {}
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findByIdAndRemove');

        const controller = rest.attachService('/', MockService);
        const actual = controller.getRoute('deleteById');

        expect(actual.httpMethod).to.equal('DELETE');
        expect(actual.path).to.equal('/:id');
        
        const ctx = { ...createEmptyContext(), params: { id: 1 } };
        await actual.handler(ctx, services);
        expect(mock.findByIdAndRemove).to.have.been.called.with.exactly(ctx.params.id);
      });

    });

    describe('should return a controller with a proper "getAll" route that handles', () => {

      it('when service.findAll is undefined.', async () => {
        const controller = rest.attachService('/', EmptyMockService);
        const actual = controller.getRoute('getAll');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findAll is a function.', async () => {
        @Service()
        class MockService implements Partial<ModelService<any>> {
          constructor() {}
          async findAll(query: ObjectType) {
            return [];
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findAll');

        const controller = rest.attachService('/', MockService);
        const actual = controller.getRoute('getAll');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/');
        
        const ctx = createEmptyContext();
        await actual.handler(ctx, services);
        expect(mock.findAll).to.have.been.called.with.exactly({});

        ctx.state.query = { foo: 3 };
        await actual.handler(ctx, services);
        expect(mock.findAll).to.have.been.called.with.exactly(ctx.state.query);
      });

    });

    describe('should return a controller with a proper "getById" route that handles', () => {

      it('when service.findById is undefined.', async () => {
        const controller = rest.attachService('/', EmptyMockService);
        const actual = controller.getRoute('getById');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/:id');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findById is a function.', async () => {
        @Service()
        class MockService implements Partial<ModelService<any>> {
          constructor() {}
          async findById(id: any) {}
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findById');

        const controller = rest.attachService('/', MockService);
        const actual = controller.getRoute('getById');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/:id');
        
        const ctx = { ...createEmptyContext(), params: { id: 1 } };
        await actual.handler(ctx, services);
        expect(mock.findById).to.have.been.called.with.exactly(ctx.params.id);
      });

    });

    it('should return an array of which one item handles PATCH /.', async () => {
      const controller = rest.attachService('/', EmptyMockService);
      const actual = controller.getRoute('patchAll');

      expect(actual.httpMethod).to.equal('PATCH');
      expect(actual.path).to.equal('/');

      const ctx = createEmptyContext();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "patchById" route that handles', () => {

      it('when service.findByIdAndUpdate is undefined.', async () => {
        const controller = rest.attachService('/', EmptyMockService);
        const actual = controller.getRoute('patchById');

        expect(actual.httpMethod).to.equal('PATCH');
        expect(actual.path).to.equal('/:id');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findByIdAndUpdate is a function.', async () => {
        @Service()
        class MockService implements Partial<ModelService<any>> {
          constructor() {}
          async findByIdAndUpdate(id: any, data: any) {}
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findByIdAndUpdate');

        const controller = rest.attachService('/', MockService);
        const actual = controller.getRoute('patchById');

        expect(actual.httpMethod).to.equal('PATCH');
        expect(actual.path).to.equal('/:id');
        
        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
          params: { id: 1 }
        };
        await actual.handler(ctx, services);
        expect(mock.findByIdAndUpdate).to.have.been.called.with.exactly(ctx.params.id, ctx.body);
      });

    });

    describe('should return a controller with a proper "postAll" route that handles', () => {

      it('when service.createOne is undefined.', async () => {
        const controller = rest.attachService('/', EmptyMockService);
        const actual = controller.getRoute('postAll');

        expect(actual.httpMethod).to.equal('POST');
        expect(actual.path).to.equal('/');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.createOne is a function.', async () => {
        @Service()
        class MockService implements Partial<ModelService<any>> {
          constructor() {}
          async createOne(data: any) {}
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'createOne');

        const controller = rest.attachService('/', MockService);
        const actual = controller.getRoute('postAll');

        expect(actual.httpMethod).to.equal('POST');
        expect(actual.path).to.equal('/');
        
        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
        };
        await actual.handler(ctx, services);
        expect(mock.createOne).to.have.been.called.with.exactly(ctx.body);
      });

    });

    it('should return an array of which one item handles POST /:id.', async () => {
      const controller = rest.attachService('/', EmptyMockService);
      const actual = controller.getRoute('postById');

      expect(actual.httpMethod).to.equal('POST');
      expect(actual.path).to.equal('/:id');

      const ctx = createEmptyContext();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    it('should return an array of which one item handles PUT /.', async () => {
      const controller = rest.attachService('/', EmptyMockService);
      const actual = controller.getRoute('putAll');

      expect(actual.httpMethod).to.equal('PUT');
      expect(actual.path).to.equal('/');

      const ctx = createEmptyContext();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "putById" route that handles', () => {

      it('when service.findByIdAndReplace is undefined.', async () => {
        const controller = rest.attachService('/', EmptyMockService);
        const actual = controller.getRoute('putById');

        expect(actual.httpMethod).to.equal('PUT');
        expect(actual.path).to.equal('/:id');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findByIdAndReplace is a function.', async () => {
        @Service()
        class MockService implements Partial<ModelService<any>> {
          constructor() {}
          async findByIdAndReplace(id: any, data: any) {}
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findByIdAndReplace');

        const controller = rest.attachService('/', MockService);
        const actual = controller.getRoute('putById');

        expect(actual.httpMethod).to.equal('PUT');
        expect(actual.path).to.equal('/:id');
        
        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
          params: { id: 1 }
        };
        await actual.handler(ctx, services);
        expect(mock.findByIdAndReplace).to.have.been.called.with(ctx.params.id, ctx.body);
      });

    });

  });

});
