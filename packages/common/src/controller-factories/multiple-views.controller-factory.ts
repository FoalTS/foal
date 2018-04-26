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
                       options: { views: Record<string, string> }): Controller<string> {
    const controller = new Controller(path);
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
    return controller;
  }
}

export const multipleViews = new MultipleViewsFactory();
