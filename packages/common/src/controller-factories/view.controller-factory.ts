import {
  Class,
  Controller,
  HttpResponseOK,
  IServiceControllerFactory,
} from '@foal/core';

import { IView } from '../services';

export class ViewControllerFactory implements IServiceControllerFactory {
  public attachService(path: string, ServiceClass: Class<IView>):
                       { path: string, controller: Controller<'main'> } {
    const controller = new Controller<'main'>();
    controller.addRoute('main', 'GET', '/', async (ctx, services) => {
      return new HttpResponseOK(
        await services.get(ServiceClass).render(ctx.state.locals || {})
      );
    });
    return { path, controller };
  }
}

export const view = new ViewControllerFactory();
