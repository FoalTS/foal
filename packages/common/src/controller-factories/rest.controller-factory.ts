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

import { ObjectDoesNotExist } from '../object-does-not-exist';
import { ModelService } from '../services';

export type RouteName = 'deleteAll' | 'deleteById' | 'getAll' | 'getById' | 'patchAll' | 'patchById'
  | 'postAll' | 'postById' | 'putAll' | 'putById' ;

export class RestControllerFactory extends ServiceControllerFactory<
    Partial<ModelService<any, any, any, any>>, RouteName
  > {
  public defineController(controller: Controller<RouteName>,
                          ServiceClass: Class<Partial<ModelService<any, any, any, any>>>): void {
    controller.addRoute('deleteAll', 'DELETE', '/', ctx => new HttpResponseMethodNotAllowed());
    controller.addRoute('deleteById', 'DELETE', '/:id', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findByIdAndRemove) {
        return new HttpResponseNotImplemented();
      }
      try {
        return new HttpResponseOK(await service.findByIdAndRemove(ctx.params.id));
      } catch (err) {
        if (err instanceof ObjectDoesNotExist) {
          return new HttpResponseNotFound();
        }
        throw err;
      }
    });
    controller.addRoute('getAll', 'GET', '/', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findAll) {
        return new HttpResponseNotImplemented();
      }
      return new HttpResponseOK(await service.findAll(ctx.state.query || {}));
    });
    controller.addRoute('getById', 'GET', '/:id', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findById) {
        return new HttpResponseNotImplemented();
      }
      try {
        return new HttpResponseOK(await service.findById(ctx.params.id));
      } catch (err) {
        if (err instanceof ObjectDoesNotExist) {
          return new HttpResponseNotFound();
        }
        throw err;
      }
    });
    controller.addRoute('patchAll', 'PATCH', '/', ctx => new HttpResponseMethodNotAllowed());
    controller.addRoute('patchById', 'PATCH', '/:id', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findByIdAndUpdate) {
        return new HttpResponseNotImplemented();
      }
      try {
        return new HttpResponseOK(await service.findByIdAndUpdate(ctx.params.id, ctx.body));
      } catch (err) {
        if (err instanceof ObjectDoesNotExist) {
          return new HttpResponseNotFound();
        }
        throw err;
      }
    });
    controller.addRoute('postAll', 'POST', '/', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.createOne) {
        return new HttpResponseNotImplemented();
      }
      return new HttpResponseOK(await new HttpResponseCreated(await service.createOne(ctx.body)));
    });
    controller.addRoute('postById', 'POST', '/:id', ctx => new HttpResponseMethodNotAllowed());
    controller.addRoute('putAll', 'PUT', '/', ctx => new HttpResponseMethodNotAllowed());
    controller.addRoute('putById', 'PUT', '/:id', async (ctx, services) => {
      const service = services.get(ServiceClass);
      if (!service.findByIdAndReplace) {
        return new HttpResponseNotImplemented();
      }
      try {
        return new HttpResponseOK(await service.findByIdAndReplace(ctx.params.id, ctx.body));
      } catch (err) {
        if (err instanceof ObjectDoesNotExist) {
          return new HttpResponseNotFound();
        }
        throw err;
      }
    });
  }
}

export const rest = new RestControllerFactory();
