import {
  Class,
  Controller,
  HttpResponseOK,
  IServiceControllerFactory,
} from '@foal/core';

import { IMultipleViews } from '../services';

export interface Options {
  views: Record<string, string>;
}

export class MultipleViewsFactory implements IServiceControllerFactory {
  public attachService(path: string, ServiceClass: Class<IMultipleViews>,
                       options: Options): { path: string, controller: Controller } {
    const controller = new Controller();
    for (const name in options.views) {
      if (options.views.hasOwnProperty(name)) {
        controller.addRoute(name, 'GET', options.views[name], async (ctx, services) => {
          const service = services.get(ServiceClass);
          return new HttpResponseOK(
            await service.render(name, ctx.state.locals || {})
          );
        });
      }
    }
    return { path, controller };
  }
}

export const multipleViews = new MultipleViewsFactory();
