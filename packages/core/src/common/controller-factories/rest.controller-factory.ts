import {
  Class,
  Controller,
  HttpResponseCreated,
  HttpResponseMethodNotAllowed,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
} from '../../core';
import { isObjectDoesNotExist } from '../errors';
import { IModelService } from '../services';

export type RouteName = 'DELETE /' | 'DELETE /:id' | 'GET /' | 'GET /:id' | 'PATCH /' | 'PATCH /:id'
  | 'POST /' | 'POST /:id' | 'PUT /' | 'PUT /:id' ;

export function rest(path: string, ModelServiceClass: Class<Partial<IModelService>>): Controller<RouteName> {
  const controller = new Controller<RouteName>(path);
  controller.addRoute('DELETE /', 'DELETE', '/', ctx => new HttpResponseMethodNotAllowed());
  controller.addRoute('DELETE /:id', 'DELETE', '/:id', async (ctx, services) => {
    const service = services.get(ModelServiceClass);
    if (!service.removeOne) {
      return new HttpResponseNotImplemented();
    }
    try {
      return new HttpResponseOK(await service.removeOne({ id: ctx.request.params.id }));
    } catch (err) {
      if (isObjectDoesNotExist(err)) {
        return new HttpResponseNotFound();
      }
      throw err;
    }
  });
  controller.addRoute('GET /', 'GET', '/', async (ctx, services) => {
    const service = services.get(ModelServiceClass);
    if (!service.findMany) {
      return new HttpResponseNotImplemented();
    }
    return new HttpResponseOK(await service.findMany(ctx.state.query || {}));
  });
  controller.addRoute('GET /:id', 'GET', '/:id', async (ctx, services) => {
    const service = services.get(ModelServiceClass);
    if (!service.findOne) {
      return new HttpResponseNotImplemented();
    }
    try {
      return new HttpResponseOK(await service.findOne({ id: ctx.request.params.id }));
    } catch (err) {
      if (isObjectDoesNotExist(err)) {
        return new HttpResponseNotFound();
      }
      throw err;
    }
  });
  controller.addRoute('PATCH /', 'PATCH', '/', ctx => new HttpResponseMethodNotAllowed());
  controller.addRoute('PATCH /:id', 'PATCH', '/:id', async (ctx, services) => {
    const service = services.get(ModelServiceClass);
    if (!service.updateOne) {
      return new HttpResponseNotImplemented();
    }
    try {
      return new HttpResponseOK(await service.updateOne({ id: ctx.request.params.id }, ctx.request.body));
    } catch (err) {
      if (isObjectDoesNotExist(err)) {
        return new HttpResponseNotFound();
      }
      throw err;
    }
  });
  controller.addRoute('POST /', 'POST', '/', async (ctx, services) => {
    const service = services.get(ModelServiceClass);
    if (!service.createOne) {
      return new HttpResponseNotImplemented();
    }
    return new HttpResponseCreated(await service.createOne(ctx.request.body));
  });
  controller.addRoute('POST /:id', 'POST', '/:id', ctx => new HttpResponseMethodNotAllowed());
  controller.addRoute('PUT /', 'PUT', '/', ctx => new HttpResponseMethodNotAllowed());
  controller.addRoute('PUT /:id', 'PUT', '/:id', async (ctx, services) => {
    const service = services.get(ModelServiceClass);
    if (!service.updateOne) {
      return new HttpResponseNotImplemented();
    }
    try {
      return new HttpResponseOK(await service.updateOne({ id: ctx.request.params.id }, ctx.request.body));
    } catch (err) {
      if (isObjectDoesNotExist(err)) {
        return new HttpResponseNotFound();
      }
      throw err;
    }
  });
  return controller;
}
