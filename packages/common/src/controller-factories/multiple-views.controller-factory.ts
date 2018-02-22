import { Context, ControllerFactory, HttpMethod, Route } from '@foal/core';

import { MultipleViewsService } from '../services';

export class MultipleViewsFactory extends ControllerFactory<MultipleViewsService, undefined> {
  public getRoutes(service: MultipleViewsService): Route[] {
    return service.names().map(name => {
      return {
        httpMethod: 'GET' as HttpMethod,
        middleware: (context: Context) => service.render(name, context.state.locals || {}),
        path: `/${name}`,
        serviceMethodName: 'render',
        successStatus: 200,
      };
    });
  }
}

export const multipleViews = new MultipleViewsFactory();
