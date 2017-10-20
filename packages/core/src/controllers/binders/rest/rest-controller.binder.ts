import { NotImplementedError } from '../../errors';
import { MethodPrimitiveBinding } from '../../interfaces';
import { ControllerBinder } from '../controller.binder';

import { RestContext, RestController } from './rest-controller.interface';

export class RestBinder extends ControllerBinder<RestController> {
  protected bind(controller: RestController): MethodPrimitiveBinding[] {
    return [
      {
        controllerMethodBinder: (ctx: RestContext) => {
          if (!controller.getAll) {
            throw new NotImplementedError();
          }
          return controller.getAll(ctx.params);
        },
        controllerMethodName: 'getAll',
        httpMethod: 'GET',
        path: '/',
        successStatus: 200,
      },
      {
        controllerMethodBinder: (ctx: RestContext) => {
          if (!controller.create) {
            throw new NotImplementedError();
          }
          return controller.create(ctx.data, ctx.params);
        },
        controllerMethodName: 'create',
        httpMethod: 'POST',
        path: '/',
        successStatus: 201,
      },
      {
        controllerMethodBinder: (ctx: RestContext) => {
          if (!controller.delete) {
            throw new NotImplementedError();
          }
          return controller.delete(ctx.id, ctx.params);
        },
        controllerMethodName: 'delete',
        httpMethod: 'DELETE',
        path: '/:id',
        successStatus: 200,
      },
      {
        controllerMethodBinder: (ctx: RestContext) => {
          if (!controller.get) {
            throw new NotImplementedError();
          }
          return controller.get(ctx.id, ctx.params);
        },
        controllerMethodName: 'get',
        httpMethod: 'GET',
        path: '/:id',
        successStatus: 200,
      },
      {
        controllerMethodBinder: (ctx: RestContext) => {
          if (!controller.patch) {
            throw new NotImplementedError();
          }
          return controller.patch(ctx.id, ctx.data, ctx.params);
        },
        controllerMethodName: 'patch',
        httpMethod: 'PATCH',
        path: '/:id',
        successStatus: 200,
      },
      {
        controllerMethodBinder: (ctx: RestContext) => {
          if (!controller.update) {
            throw new NotImplementedError();
          }
          return controller.update(ctx.id, ctx.data, ctx.params);
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
