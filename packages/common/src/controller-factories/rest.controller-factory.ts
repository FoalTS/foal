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
        path: '/',
        serviceMethodBinder: (ctx: Context) => {
          if (!controller.getAll) {
            throw new NotImplementedError();
          }
          return controller.getAll(ctx.query);
        },
        serviceMethodName: 'getAll',
        successStatus: 200,
      },
      {
        httpMethod: 'POST',
        path: '/',
        serviceMethodBinder: (ctx: Context) => {
          if (!controller.create) {
            throw new NotImplementedError();
          }
          return controller.create(ctx.body, ctx.query);
        },
        serviceMethodName: 'create',
        successStatus: 201,
      },
      {
        httpMethod: 'DELETE',
        path: '/:id',
        serviceMethodBinder: (ctx: Context) => {
          if (!controller.delete) {
            throw new NotImplementedError();
          }
          return controller.delete(ctx.params.id, ctx.query);
        },
        serviceMethodName: 'delete',
        successStatus: 200,
      },
      {
        httpMethod: 'GET',
        path: '/:id',
        serviceMethodBinder: (ctx: Context) => {
          if (!controller.get) {
            throw new NotImplementedError();
          }
          return controller.get(ctx.params.id, ctx.query);
        },
        serviceMethodName: 'get',
        successStatus: 200,
      },
      {
        httpMethod: 'PATCH',
        path: '/:id',
        serviceMethodBinder: (ctx: Context) => {
          if (!controller.modify) {
            throw new NotImplementedError();
          }
          return controller.modify(ctx.params.id, ctx.body, ctx.query);
        },
        serviceMethodName: 'patch',
        successStatus: 200,
      },
      {
        httpMethod: 'PUT',
        path: '/:id',
        serviceMethodBinder: (ctx: Context) => {
          if (!controller.replace) {
            throw new NotImplementedError();
          }
          return controller.replace(ctx.params.id, ctx.body, ctx.query);
        },
        serviceMethodName: 'update',
        successStatus: 200,
      },
    ];
  }
}

export const rest = new RestControllerFactory();
