import { NotImplementedError } from '../../errors';
import { Context, MethodPrimitiveBinding } from '../../interfaces';
import { ControllerBinder } from '../controller.binder';

import { RestController } from './rest-controller.interface';

export class RestBinder extends ControllerBinder<RestController> {
  protected bind(controller: RestController): MethodPrimitiveBinding[] {
    return [
      {
        controllerMethodBinder: (ctx: Context) => {
          if (!controller.getAll) {
            throw new NotImplementedError();
          }
          return controller.getAll(ctx.query);
        },
        controllerMethodName: 'getAll',
        httpMethod: 'GET',
        path: '/',
        successStatus: 200,
      },
      {
        controllerMethodBinder: (ctx: Context) => {
          if (!controller.create) {
            throw new NotImplementedError();
          }
          return controller.create(ctx.body, ctx.query);
        },
        controllerMethodName: 'create',
        httpMethod: 'POST',
        path: '/',
        successStatus: 201,
      },
      {
        controllerMethodBinder: (ctx: Context) => {
          if (!controller.delete) {
            throw new NotImplementedError();
          }
          return controller.delete(ctx.params.id, ctx.query);
        },
        controllerMethodName: 'delete',
        httpMethod: 'DELETE',
        path: '/:id',
        successStatus: 200,
      },
      {
        controllerMethodBinder: (ctx: Context) => {
          if (!controller.get) {
            throw new NotImplementedError();
          }
          return controller.get(ctx.params.id, ctx.query);
        },
        controllerMethodName: 'get',
        httpMethod: 'GET',
        path: '/:id',
        successStatus: 200,
      },
      {
        controllerMethodBinder: (ctx: Context) => {
          if (!controller.patch) {
            throw new NotImplementedError();
          }
          return controller.patch(ctx.params.id, ctx.body, ctx.query);
        },
        controllerMethodName: 'patch',
        httpMethod: 'PATCH',
        path: '/:id',
        successStatus: 200,
      },
      {
        controllerMethodBinder: (ctx: Context) => {
          if (!controller.update) {
            throw new NotImplementedError();
          }
          return controller.update(ctx.params.id, ctx.body, ctx.query);
        },
        controllerMethodName: 'update',
        httpMethod: 'PUT',
        path: '/:id',
        successStatus: 200,
      },
    ];
  }
}

export const rest = new RestBinder();
