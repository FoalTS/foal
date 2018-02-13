import { Context, ControllerFactory, HttpMethod, Route } from '@foal/core';

import { MultipleViewService } from '../services/multiple-view-service.interface';

export class MultipleViewFactory extends ControllerFactory<MultipleViewService> {
  public getRoutes(service: MultipleViewService): Route[] {
    return service.names().map(name => {
      return {
        httpMethod: 'GET' as HttpMethod,
        middleware: (context: Context) => service.render(name, context.state),
        path: `/${name}`,
        serviceMethodName: 'render',
        successStatus: 200,
      };
    });
  }
}

export const multipleView = new MultipleViewFactory();
