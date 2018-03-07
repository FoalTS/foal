import {
  Class,
  Controller,
  HttpResponseOK,
  ServiceControllerFactory,
} from '@foal/core';

import { IView } from '../services';

export class ViewControllerFactory extends ServiceControllerFactory<IView, 'main'> {
  protected defineController(controller: Controller<'main'>, ServiceClass: Class<IView>): void {
    controller.addRoute('main', 'GET', '/', async (ctx, services) => {
      return new HttpResponseOK(
        await services.get(ServiceClass).render(ctx.state.locals || {})
      );
    });
  }
}

export const view = new ViewControllerFactory();
