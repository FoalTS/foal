import {
  Context,
  ControllerFactory,
  HttpMethod,
  HttpResponseMethodNotAllowed,
  HttpResponseNotImplemented,
  Route,
} from '@foal/core';

import { ModelService } from '../services';

function routeNotAllowed(httpMethod: HttpMethod, path: string): Route {
  return {
    httpMethod,
    middleware: ctx => new HttpResponseMethodNotAllowed(),
    path,
    serviceMethodName: null,
    successStatus: 200
  };
}

export class RestControllerFactory extends ControllerFactory<Partial<ModelService<any>>, undefined> {
  public getRoutes(service: Partial<ModelService<any>>): Route[] {
    return [
      routeNotAllowed('DELETE', '/'),
      {
        httpMethod: 'DELETE',
        middleware: (ctx: Context) => {
          if (!service.findByIdAndRemove) {
            return new HttpResponseNotImplemented();
          }
          return service.findByIdAndRemove(ctx.params.id);
        },
        path: '/:id',
        serviceMethodName: 'findByIdAndRemove',
        successStatus: 200,
      },
      {
        httpMethod: 'GET',
        middleware: (ctx: Context) => {
          if (!service.findAll) {
            return new HttpResponseNotImplemented();
          }
          return service.findAll(ctx.state.query || {});
        },
        path: '/',
        serviceMethodName: 'findAll',
        successStatus: 200,
      },
      {
        httpMethod: 'GET',
        middleware: (ctx: Context) => {
          if (!service.findById) {
            return new HttpResponseNotImplemented();
          }
          return service.findById(ctx.params.id);
        },
        path: '/:id',
        serviceMethodName: 'findById',
        successStatus: 200,
      },
      routeNotAllowed('PATCH', '/'),
      {
        httpMethod: 'PATCH',
        middleware: (ctx: Context) => {
          if (!service.findByIdAndUpdate) {
            return new HttpResponseNotImplemented();
          }
          return service.findByIdAndUpdate(ctx.params.id, ctx.body);
        },
        path: '/:id',
        serviceMethodName: 'findByIdAndUpdate',
        successStatus: 200,
      },
      {
        httpMethod: 'POST',
        middleware: (ctx: Context) => {
          if (!service.createOne) {
            return new HttpResponseNotImplemented();
          }
          return service.createOne(ctx.body);
        },
        path: '/',
        serviceMethodName: 'createOne',
        successStatus: 201,
      },
      routeNotAllowed('POST', '/:id'),
      routeNotAllowed('PUT', '/'),
      {
        httpMethod: 'PUT',
        middleware: (ctx: Context) => {
          if (!service.findByIdAndReplace) {
            return new HttpResponseNotImplemented();
          }
          return service.findByIdAndReplace(ctx.params.id, ctx.body);
        },
        path: '/:id',
        serviceMethodName: 'findByIdAndReplace',
        successStatus: 200,
      },
    ];
  }
}

export const rest = new RestControllerFactory();
