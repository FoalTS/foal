import {
  Class,
  Controller,
  HttpResponseCreated,
  HttpResponseMethodNotAllowed,
  HttpResponseNotFound,
  HttpResponseNotImplemented,
  HttpResponseOK,
  ServiceControllerFactory,
} from '@foal/core';

import { isObjectDoesNotExist } from '../object-does-not-exist';
import { IModelService } from '../services';

export type RouteName = 'DELETE /' | 'DELETE /:id' | 'GET /' | 'GET /:id' | 'PATCH /' | 'PATCH /:id'
  | 'POST /' | 'POST /:id' | 'PUT /' | 'PUT /:id' ;

export class RestControllerFactory extends ServiceControllerFactory<
    Partial<IModelService<any, any, any, any>>, RouteName
  > {
  protected defineController(controller: Controller<RouteName>,
                             ServiceClass: Class<Partial<IModelService<any, any, any, any>>>): void {
    controller.addRoute('DELETE /', 'DELETE', '/', ctx => new HttpResponseMethodNotAllowed());
    controller.addRoute('DELETE /:id', 'DELETE', '/:id', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findByIdAndRemove) {
        return new HttpResponseNotImplemented();
      }
      try {
        return new HttpResponseOK(await service.findByIdAndRemove(ctx.params.id));
      } catch (err) {
        if (isObjectDoesNotExist(err)) {
          return new HttpResponseNotFound();
        }
        throw err;
      }
    });
    controller.addRoute('GET /', 'GET', '/', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findAll) {
        return new HttpResponseNotImplemented();
      }
      return new HttpResponseOK(await service.findAll(ctx.state.query || {}));
    });
    controller.addRoute('GET /:id', 'GET', '/:id', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findById) {
        return new HttpResponseNotImplemented();
      }
      try {
        return new HttpResponseOK(await service.findById(ctx.params.id));
      } catch (err) {
        if (isObjectDoesNotExist(err)) {
          return new HttpResponseNotFound();
        }
        throw err;
      }
    });
    controller.addRoute('PATCH /', 'PATCH', '/', ctx => new HttpResponseMethodNotAllowed());
    controller.addRoute('PATCH /:id', 'PATCH', '/:id', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findByIdAndUpdate) {
        return new HttpResponseNotImplemented();
      }
      try {
        return new HttpResponseOK(await service.findByIdAndUpdate(ctx.params.id, ctx.body));
      } catch (err) {
        if (isObjectDoesNotExist(err)) {
          return new HttpResponseNotFound();
        }
        throw err;
      }
    });
    controller.addRoute('POST /', 'POST', '/', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.createOne) {
        return new HttpResponseNotImplemented();
      }
      return new HttpResponseCreated(await service.createOne(ctx.body));
    });
    controller.addRoute('POST /:id', 'POST', '/:id', ctx => new HttpResponseMethodNotAllowed());
    controller.addRoute('PUT /', 'PUT', '/', ctx => new HttpResponseMethodNotAllowed());
    controller.addRoute('PUT /:id', 'PUT', '/:id', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findByIdAndReplace) {
        return new HttpResponseNotImplemented();
      }
      try {
        return new HttpResponseOK(await service.findByIdAndReplace(ctx.params.id, ctx.body));
      } catch (err) {
        if (isObjectDoesNotExist(err)) {
          return new HttpResponseNotFound();
        }
        throw err;
      }
    });
  }
}

export const rest = new RestControllerFactory();
