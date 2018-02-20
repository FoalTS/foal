import {
  Context,
  ControllerFactory,
  Route
} from '@foal/core';

import { ViewService } from '../services';

export class ViewControllerFactory extends ControllerFactory<ViewService> {
  public getRoutes(service: ViewService): Route[] {
    return [
      {
        httpMethod: 'GET',
        middleware: (context: Context) => service.render(context.state.locals || {}),
        path: '/',
        serviceMethodName: 'render',
        successStatus: 200,
      }
    ];
  }
}

export const view = new ViewControllerFactory();
