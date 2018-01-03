import {
  Context,
  ControllerFactory,
  NotImplementedError,
  Route
} from '@foal/core';

import { PartialCRUDService } from '../services';

export class RestControllerFactory extends ControllerFactory<PartialCRUDService> {
  protected getRoutes(controller: PartialCRUDService): Route[] {
    return [
      {
        httpMethod: 'GET',
        middleware: (ctx: Context) => {
          if (!controller.getAll) {
            throw new NotImplementedError();
          }
          return controller.getAll(ctx.query);
        },
        path: '/',
        serviceMethodName: 'getAll',
        successStatus: 200,
      },
      {
        httpMethod: 'POST',
        middleware: (ctx: Context) => {
          if (!controller.create) {
            throw new NotImplementedError();
          }
          return controller.create(ctx.body, ctx.query);
        },
        path: '/',
        serviceMethodName: 'create',
        successStatus: 201,
      },
      {
        httpMethod: 'DELETE',
        middleware: (ctx: Context) => {
          if (!controller.delete) {
            throw new NotImplementedError();
          }
          return controller.delete(ctx.params.id, ctx.query);
        },
        path: '/:id',
        serviceMethodName: 'delete',
        successStatus: 200,
      },
      {
        httpMethod: 'GET',
        middleware: (ctx: Context) => {
          if (!controller.get) {
            throw new NotImplementedError();
          }
          return controller.get(ctx.params.id, ctx.query);
        },
        path: '/:id',
        serviceMethodName: 'get',
        successStatus: 200,
      },
      {
        httpMethod: 'PATCH',
        middleware: (ctx: Context) => {
          if (!controller.modify) {
            throw new NotImplementedError();
          }
          return controller.modify(ctx.params.id, ctx.body, ctx.query);
        },
        path: '/:id',
        serviceMethodName: 'patch',
        successStatus: 200,
      },
      {
        httpMethod: 'PUT',
        middleware: (ctx: Context) => {
          if (!controller.replace) {
            throw new NotImplementedError();
          }
          return controller.replace(ctx.params.id, ctx.body, ctx.query);
        },
        path: '/:id',
        serviceMethodName: 'update',
        successStatus: 200,
      },
    ];
  }
}

export const rest = new RestControllerFactory();
