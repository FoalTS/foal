import {
  Class,
  Controller,
  HttpResponseOK,
  ServiceControllerFactory,
} from '@foal/core';

import { IMultipleViews } from '../services';

export interface Options {
  views: Record<string, string>;
}

export class MultipleViewsFactory extends ServiceControllerFactory<IMultipleViews,
    string, Options> {
  protected defineController(controller: Controller<string>,
                             ServiceClass: Class<IMultipleViews>,
                             options?: Options): void {
    if (!options) {
      throw new Error('Options must be given to the multipleViews controller factory.');
    }
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
  }
}

export const multipleViews = new MultipleViewsFactory();
