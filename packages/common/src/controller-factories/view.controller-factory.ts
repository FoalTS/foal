import {
  Class,
  Controller,
  HttpResponseOK,
  ServiceControllerFactory,
} from '@foal/core';

import { ViewService } from '../services';

export class ViewControllerFactory extends ServiceControllerFactory<ViewService, 'main'> {
  protected defineController(controller: Controller<'main'>, ServiceClass: Class<ViewService>): void {
    controller.addRoute('main', 'GET', '/', async (ctx, services) => {
      return new HttpResponseOK(
        await services.get(ServiceClass).render(ctx.state.locals || {})
      );
    });
  }
}

export const view = new ViewControllerFactory();
