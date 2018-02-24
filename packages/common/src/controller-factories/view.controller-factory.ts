import {
  Controller,
  HttpResponseOK,
  ServiceControllerFactory,
  Type,
} from '@foal/core';

import { ViewService } from '../services';

export class ViewControllerFactory extends ServiceControllerFactory<ViewService, 'main'> {
  public defineController(controller: Controller<'main'>, ServiceClass: Type<ViewService>): void {
    controller.addRoute('main', 'GET', '/', async (ctx, services) => {
      return new HttpResponseOK(
        await services.get(ServiceClass).render(ctx.state.locals || {})
      );
    });
  }
}

export const view = new ViewControllerFactory();
