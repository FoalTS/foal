import {
  Context,
  ControllerFactory,
  HttpMethod,
  MethodNotAllowedError,
  NotImplementedError,
  Route,
} from '@foal/core';

import { ModelService } from '../services';

function routeNotAllowed(httpMethod: HttpMethod, path: string): Route {
  return {
    httpMethod,
    middleware: ctx => { throw new MethodNotAllowedError(); },
    path,
    serviceMethodName: null,
    successStatus: 200
  };
}

export class RestControllerFactory extends ControllerFactory<Partial<ModelService<any>>> {
  public getRoutes(service: Partial<ModelService<any>>): Route[] {
    return [
      routeNotAllowed('DELETE', '/'),
      {
        httpMethod: 'DELETE',
        middleware: (ctx: Context) => {
          if (!service.findByIdAndRemove) {
            throw new NotImplementedError();
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
            throw new NotImplementedError();
          }
          return service.findAll(ctx.query);
        },
        path: '/',
        serviceMethodName: 'findAll',
        successStatus: 200,
      },
      {
        httpMethod: 'GET',
        middleware: (ctx: Context) => {
          if (!service.findById) {
            throw new NotImplementedError();
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
            throw new NotImplementedError();
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
            throw new NotImplementedError();
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
            throw new NotImplementedError();
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
