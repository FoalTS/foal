import {
  Context,
  ControllerFactory,
  HttpMethod,
  MethodNotAllowedError,
  NotImplementedError,
  Route,
} from '@foal/core';

import { PartialCRUDService } from '../services';

function routeNotAllowed(httpMethod: HttpMethod, path: string): Route {
  return {
    httpMethod,
    middleware: ctx => { throw new MethodNotAllowedError(); },
    path,
    serviceMethodName: null,
    successStatus: 200
  };
}

export class RestControllerFactory extends ControllerFactory<PartialCRUDService> {
  public getRoutes(service: PartialCRUDService): Route[] {
    return [
      routeNotAllowed('DELETE', '/'),
      {
        httpMethod: 'DELETE',
        middleware: (ctx: Context) => {
          if (!service.delete) {
            throw new NotImplementedError();
          }
          return service.delete(ctx.params.id, ctx.query);
        },
        path: '/:id',
        serviceMethodName: 'delete',
        successStatus: 200,
      },
      {
        httpMethod: 'GET',
        middleware: (ctx: Context) => {
          if (!service.getAll) {
            throw new NotImplementedError();
          }
          return service.getAll(ctx.query);
        },
        path: '/',
        serviceMethodName: 'getAll',
        successStatus: 200,
      },
      {
        httpMethod: 'GET',
        middleware: (ctx: Context) => {
          if (!service.get) {
            throw new NotImplementedError();
          }
          return service.get(ctx.params.id, ctx.query);
        },
        path: '/:id',
        serviceMethodName: 'get',
        successStatus: 200,
      },
      routeNotAllowed('PATCH', '/'),
      {
        httpMethod: 'PATCH',
        middleware: (ctx: Context) => {
          if (!service.modify) {
            throw new NotImplementedError();
          }
          return service.modify(ctx.params.id, ctx.body, ctx.query);
        },
        path: '/:id',
        serviceMethodName: 'modify',
        successStatus: 200,
      },
      {
        httpMethod: 'POST',
        middleware: (ctx: Context) => {
          if (!service.create) {
            throw new NotImplementedError();
          }
          return service.create(ctx.body, ctx.query);
        },
        path: '/',
        serviceMethodName: 'create',
        successStatus: 201,
      },
      routeNotAllowed('POST', '/:id'),
      routeNotAllowed('PUT', '/'),
      {
        httpMethod: 'PUT',
        middleware: (ctx: Context) => {
          if (!service.replace) {
            throw new NotImplementedError();
          }
          return service.replace(ctx.params.id, ctx.body, ctx.query);
        },
        path: '/:id',
        serviceMethodName: 'replace',
        successStatus: 200,
      },
    ];
  }
}

export const rest = new RestControllerFactory();
