import {
  Controller,
  HttpResponseOK,
  ServiceControllerFactory,
  Type,
} from '@foal/core';

import { MultipleViewsService } from '../services';

export interface Options<View extends string> {
  views: Record<View, string>;
}

export class MultipleViewsFactory<View extends string> extends ServiceControllerFactory<MultipleViewsService<View>,
    View, Options<View>> {
  protected defineController(controller: Controller<View>,
                             ServiceClass: Type<MultipleViewsService<View>>,
                             options?: Options<View>): void {
    if (!options) {
      throw new Error('Options must be given to the multipleViews controller factory.');
    }
    for (const name in options.views) {
      if (options.views.hasOwnProperty(name)) {
        controller.addRoute(name, 'GET', `/${name}`, async (ctx, services) => {
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
