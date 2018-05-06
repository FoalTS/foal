import {
  createEmptyContext,
  HttpResponseCreated,
  HttpResponseMethodNotAllowed,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
  Service,
  ServiceManager,
} from '@foal/core';
import * as chai from 'chai';
import * as spies from 'chai-spies';

import { ObjectDoesNotExist } from '../object-does-not-exist';
import { IModelService } from '../services';
import { rest, RestControllerFactory } from './rest.controller-factory';

chai.use(spies);
const expect = chai.expect;

describe('rest', () => {

  @Service()
  class EmptyMockService implements Partial<IModelService<any, any, any, any>> {
    constructor() {}
  }

  it('should be an instance of RestControllerFactory', () => {
    expect(rest).to.an.instanceOf(RestControllerFactory);
  });

  describe('when attachService is called', () => {

    it('should return a controller with a proper "DELETE /" route.', async () => {
      const controller = rest.attachService('/foobar', EmptyMockService);
      const actual = controller.getRoute('DELETE /');

      expect(actual.httpMethod).to.equal('DELETE');
      expect(actual.path).to.equal('/foobar/');

      const ctx = createEmptyContext();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "DELETE /:id" route that handles requests', () => {

      it('when service.findByIdAndRemove is undefined.', async () => {
        const controller = rest.attachService('/foobar', EmptyMockService);
        const actual = controller.getRoute('DELETE /:id');

        expect(actual.httpMethod).to.equal('DELETE');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findByIdAndRemove is a function.', async () => {
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public async findByIdAndRemove(id: any): Promise<void> {}
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findByIdAndRemove');

        const controller = rest.attachService('/foobar', MockService);
        const actual = controller.getRoute('DELETE /:id');

        expect(actual.httpMethod).to.equal('DELETE');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = { ...createEmptyContext(), params: { id: 1 } };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', undefined);
        expect(mock.findByIdAndRemove).to.have.been.called.with.exactly(ctx.params.id);
      });

      it('when service.findByIdAndRemove throws an ObjectDoesNotExist error.', async () => {
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public findByIdAndRemove(id: any): void {
            throw new ObjectDoesNotExist();
          }
        }
        const ctx = { ...createEmptyContext(), params: { id: 1 } };
        const actual = await rest.attachService('/foobar', MockService).getRoute('DELETE /:id')
                                 .handler(ctx, new ServiceManager());
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

    });

    describe('should return a controller with a proper "GET /" route that handles requests', () => {

      it('when service.findAll is undefined.', async () => {
        const controller = rest.attachService('/foobar', EmptyMockService);
        const actual = controller.getRoute('GET /');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/foobar/');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findAll is a function.', async () => {
        const all = [];
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public async findAll(query: object) {
            return all;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findAll');

        const controller = rest.attachService('/foobar', MockService);
        const actual = controller.getRoute('GET /');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/foobar/');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', all);
        expect(mock.findAll).to.have.been.called.with.exactly({});

        ctx.state.query = { foo: 3 };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', all);
        expect(mock.findAll).to.have.been.called.with.exactly(ctx.state.query);
      });

    });

    describe('should return a controller with a proper "GET /:id" route that handles requests', () => {

      it('when service.findById is undefined.', async () => {
        const controller = rest.attachService('/foobar', EmptyMockService);
        const actual = controller.getRoute('GET /:id');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findById is a function.', async () => {
        const obj = {};
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public async findById(id: any) {
            return obj;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findById');

        const controller = rest.attachService('/foobar', MockService);
        const actual = controller.getRoute('GET /:id');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = { ...createEmptyContext(), params: { id: 1 } };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', obj);
        expect(mock.findById).to.have.been.called.with.exactly(ctx.params.id);
      });

      it('when service.findById throws an ObjectDoesNotExist error.', async () => {
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public findById(id: any) {
            throw new ObjectDoesNotExist();
          }
        }
        const ctx = { ...createEmptyContext(), params: { id: 1 } };
        const actual = await rest.attachService('/foobar', MockService).getRoute('GET /:id')
                                 .handler(ctx, new ServiceManager());
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

    });

    it('should return an array of which one item handles PATCH /.', async () => {
      const controller = rest.attachService('/foobar', EmptyMockService);
      const actual = controller.getRoute('PATCH /');

      expect(actual.httpMethod).to.equal('PATCH');
      expect(actual.path).to.equal('/foobar/');

      const ctx = createEmptyContext();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "PATCH /:id" route that handles requests', () => {

      it('when service.findByIdAndUpdate is undefined.', async () => {
        const controller = rest.attachService('/foobar', EmptyMockService);
        const actual = controller.getRoute('PATCH /:id');

        expect(actual.httpMethod).to.equal('PATCH');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findByIdAndUpdate is a function.', async () => {
        const obj = {};
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public async findByIdAndUpdate(id: any, data: any) {
            return obj;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findByIdAndUpdate');

        const controller = rest.attachService('/foobar', MockService);
        const actual = controller.getRoute('PATCH /:id');

        expect(actual.httpMethod).to.equal('PATCH');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
          params: { id: 1 }
        };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', obj);
        expect(mock.findByIdAndUpdate).to.have.been.called.with.exactly(ctx.params.id, ctx.body);
      });

      it('when service.findByIdAndUpdate throws an ObjectDoesNotExist error.', async () => {
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public findByIdAndUpdate(id: any, data: any) {
            throw new ObjectDoesNotExist();
          }
        }
        const ctx = { ...createEmptyContext(), params: { id: 1 } };
        const actual = await rest.attachService('/foobar', MockService).getRoute('PATCH /:id')
                                 .handler(ctx, new ServiceManager());
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

    });

    describe('should return a controller with a proper "POST /" route that handles requests', () => {

      it('when service.createOne is undefined.', async () => {
        const controller = rest.attachService('/foobar', EmptyMockService);
        const actual = controller.getRoute('POST /');

        expect(actual.httpMethod).to.equal('POST');
        expect(actual.path).to.equal('/foobar/');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.createOne is a function.', async () => {
        const obj = {};
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public async createOne(data: any) {
            return obj;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'createOne');

        const controller = rest.attachService('/foobar', MockService);
        const actual = controller.getRoute('POST /');

        expect(actual.httpMethod).to.equal('POST');
        expect(actual.path).to.equal('/foobar/');

        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
        };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseCreated)
          .with.property('content', obj);
        expect(mock.createOne).to.have.been.called.with.exactly(ctx.body);
      });

    });

    it('should return an array of which one item handles POST /:id.', async () => {
      const controller = rest.attachService('/foobar', EmptyMockService);
      const actual = controller.getRoute('POST /:id');

      expect(actual.httpMethod).to.equal('POST');
      expect(actual.path).to.equal('/foobar/:id');

      const ctx = createEmptyContext();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    it('should return an array of which one item handles PUT /.', async () => {
      const controller = rest.attachService('/foobar', EmptyMockService);
      const actual = controller.getRoute('PUT /');

      expect(actual.httpMethod).to.equal('PUT');
      expect(actual.path).to.equal('/foobar/');

      const ctx = createEmptyContext();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "PUT /:id" route that handles requests', () => {

      it('when service.findByIdAndReplace is undefined.', async () => {
        const controller = rest.attachService('/foobar', EmptyMockService);
        const actual = controller.getRoute('PUT /:id');

        expect(actual.httpMethod).to.equal('PUT');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = createEmptyContext();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findByIdAndReplace is a function.', async () => {
        const obj = {};
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public async findByIdAndReplace(id: any, data: any) {
            return obj;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findByIdAndReplace');

        const controller = rest.attachService('/foobar', MockService);
        const actual = controller.getRoute('PUT /:id');

        expect(actual.httpMethod).to.equal('PUT');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = {
          ...createEmptyContext(),
          body: { foo: 'bar' },
          params: { id: 1 }
        };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', obj);
        expect(mock.findByIdAndReplace).to.have.been.called.with.exactly(ctx.params.id, ctx.body);
      });

      it('when service.findByIdAndReplace throws an ObjectDoesNotExist error.', async () => {
        @Service()
        class MockService implements Partial<IModelService<any, any, any, any>> {
          constructor() {}
          public findByIdAndReplace(id: any, data: any) {
            throw new ObjectDoesNotExist();
          }
        }
        const ctx = { ...createEmptyContext(), params: { id: 1 } };
        const actual = await rest.attachService('/foobar', MockService).getRoute('PUT /:id')
                                 .handler(ctx, new ServiceManager());
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

    });

  });

});
