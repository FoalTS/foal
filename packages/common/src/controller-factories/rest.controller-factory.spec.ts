import {
  Context,
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
import { rest } from './rest.controller-factory';

chai.use(spies);
const expect = chai.expect;

describe('rest', () => {

  @Service()
  class EmptyMockService {
    constructor() { }
  }

  describe('when it is called', () => {

    it('should return a controller with a proper "DELETE /" route.', async () => {
      const controller = rest('/foobar', EmptyMockService);
      const actual = controller.getRoute('DELETE /');

      expect(actual.httpMethod).to.equal('DELETE');
      expect(actual.path).to.equal('/foobar/');

      const ctx = new Context();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "DELETE /:id" route that handles requests', () => {

      it('when service.removeOne is undefined.', async () => {
        const controller = rest('/foobar', EmptyMockService);
        const actual = controller.getRoute('DELETE /:id');

        expect(actual.httpMethod).to.equal('DELETE');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = new Context();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.removeOne is a function.', async () => {
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          async removeOne(query: object): Promise<void> { }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'removeOne');

        const controller = rest('/foobar', MockService);
        const actual = controller.getRoute('DELETE /:id');

        expect(actual.httpMethod).to.equal('DELETE');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = new Context();
        ctx.params = { id: 1 };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', undefined);
        expect(mock.removeOne).to.have.been.called.with.exactly({ id: ctx.params.id });
      });

      it('when service.removeOne throws an ObjectDoesNotExist error.', async () => {
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          removeOne(query: object): void {
            throw new ObjectDoesNotExist();
          }
        }
        const ctx = new Context();
        ctx.params = { id: 1 };
        const actual = await rest('/foobar', MockService).getRoute('DELETE /:id')
          .handler(ctx, new ServiceManager());
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

    });

    describe('should return a controller with a proper "GET /" route that handles requests', () => {

      it('when service.findMany is undefined.', async () => {
        const controller = rest('/foobar', EmptyMockService);
        const actual = controller.getRoute('GET /');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/foobar/');

        const ctx = new Context();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findMany is a function.', async () => {
        const all = [];
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          async findMany(query: object) {
            return all;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findMany');

        const controller = rest('/foobar', MockService);
        const actual = controller.getRoute('GET /');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/foobar/');

        const ctx = new Context();
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', all);
        expect(mock.findMany).to.have.been.called.with.exactly({});

        ctx.state.query = { foo: 3 };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', all);
        expect(mock.findMany).to.have.been.called.with.exactly(ctx.state.query);
      });

    });

    describe('should return a controller with a proper "GET /:id" route that handles requests', () => {

      it('when service.findOne is undefined.', async () => {
        const controller = rest('/foobar', EmptyMockService);
        const actual = controller.getRoute('GET /:id');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = new Context();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.findOne is a function.', async () => {
        const obj = {};
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          async findOne(query: object) {
            return obj;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'findOne');

        const controller = rest('/foobar', MockService);
        const actual = controller.getRoute('GET /:id');

        expect(actual.httpMethod).to.equal('GET');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = new Context();
        ctx.params = { id: 1 };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', obj);
        expect(mock.findOne).to.have.been.called.with.exactly({ id: ctx.params.id });
      });

      it('when service.findOne throws an ObjectDoesNotExist error.', async () => {
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          findOne(query: object) {
            throw new ObjectDoesNotExist();
          }
        }

        const ctx = new Context();
        ctx.params = { id: 1 };
        const actual = await rest('/foobar', MockService).getRoute('GET /:id')
          .handler(ctx, new ServiceManager());
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

    });

    it('should return an array of which one item handles PATCH /.', async () => {
      const controller = rest('/foobar', EmptyMockService);
      const actual = controller.getRoute('PATCH /');

      expect(actual.httpMethod).to.equal('PATCH');
      expect(actual.path).to.equal('/foobar/');

      const ctx = new Context();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "PATCH /:id" route that handles requests', () => {

      it('when service.updateOne is undefined.', async () => {
        const controller = rest('/foobar', EmptyMockService);
        const actual = controller.getRoute('PATCH /:id');

        expect(actual.httpMethod).to.equal('PATCH');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = new Context();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.updateOne is a function.', async () => {
        const obj = {};
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          async updateOne(record: object, query: object) {
            return obj;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'updateOne');

        const controller = rest('/foobar', MockService);
        const actual = controller.getRoute('PATCH /:id');

        expect(actual.httpMethod).to.equal('PATCH');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = new Context();
        ctx.body = { foo: 'bar' };
        ctx.params = { id: 1 };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', obj);
        expect(mock.updateOne).to.have.been.called.with.exactly({ id: ctx.params.id }, ctx.body);
      });

      it('when service.updateOne throws an ObjectDoesNotExist error.', async () => {
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          updateOne(record: object, query: object) {
            throw new ObjectDoesNotExist();
          }
        }

        const ctx = new Context();
        ctx.params = { id: 1 };
        const actual = await rest('/foobar', MockService).getRoute('PATCH /:id')
          .handler(ctx, new ServiceManager());
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

    });

    describe('should return a controller with a proper "POST /" route that handles requests', () => {

      it('when service.createOne is undefined.', async () => {
        const controller = rest('/foobar', EmptyMockService);
        const actual = controller.getRoute('POST /');

        expect(actual.httpMethod).to.equal('POST');
        expect(actual.path).to.equal('/foobar/');

        const ctx = new Context();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.createOne is a function.', async () => {
        const obj = {};
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          async createOne(record: object) {
            return obj;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'createOne');

        const controller = rest('/foobar', MockService);
        const actual = controller.getRoute('POST /');

        expect(actual.httpMethod).to.equal('POST');
        expect(actual.path).to.equal('/foobar/');

        const ctx = new Context();
        ctx.body = { foo: 'bar' };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseCreated)
          .with.property('content', obj);
        expect(mock.createOne).to.have.been.called.with.exactly(ctx.body);
      });

    });

    it('should return an array of which one item handles POST /:id.', async () => {
      const controller = rest('/foobar', EmptyMockService);
      const actual = controller.getRoute('POST /:id');

      expect(actual.httpMethod).to.equal('POST');
      expect(actual.path).to.equal('/foobar/:id');

      const ctx = new Context();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    it('should return an array of which one item handles PUT /.', async () => {
      const controller = rest('/foobar', EmptyMockService);
      const actual = controller.getRoute('PUT /');

      expect(actual.httpMethod).to.equal('PUT');
      expect(actual.path).to.equal('/foobar/');

      const ctx = new Context();
      expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseMethodNotAllowed);
    });

    describe('should return a controller with a proper "PUT /:id" route that handles requests', () => {

      it('when service.updateOne is undefined.', async () => {
        const controller = rest('/foobar', EmptyMockService);
        const actual = controller.getRoute('PUT /:id');

        expect(actual.httpMethod).to.equal('PUT');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = new Context();
        expect(await actual.handler(ctx, new ServiceManager())).to.be.an.instanceOf(HttpResponseNotImplemented);
      });

      it('when service.updateOne is a function.', async () => {
        const obj = {};
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          async updateOne(record: object, query: object) {
            return obj;
          }
        }
        const services = new ServiceManager();
        const mock = services.get(MockService);
        chai.spy.on(mock, 'updateOne');

        const controller = rest('/foobar', MockService);
        const actual = controller.getRoute('PUT /:id');

        expect(actual.httpMethod).to.equal('PUT');
        expect(actual.path).to.equal('/foobar/:id');

        const ctx = new Context();
        ctx.body = { foo: 'bar' };
        ctx.params = { id: 1 };
        expect(await actual.handler(ctx, services)).to.be.an.instanceOf(HttpResponseOK)
          .with.property('content', obj);
        expect(mock.updateOne).to.have.been.called.with.exactly({ id: ctx.params.id }, ctx.body);
      });

      it('when service.updateOne throws an ObjectDoesNotExist error.', async () => {
        @Service()
        class MockService implements Partial<IModelService> {
          constructor() { }
          updateOne(record: object, query: object) {
            throw new ObjectDoesNotExist();
          }
        }

        const ctx = new Context();
        ctx.params = { id: 1 };
        const actual = await rest('/foobar', MockService).getRoute('PUT /:id')
          .handler(ctx, new ServiceManager());
        expect(actual).to.be.an.instanceOf(HttpResponseNotFound);
      });

    });

  });

});
