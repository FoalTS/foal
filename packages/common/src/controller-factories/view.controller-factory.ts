import {
  Context,
  ControllerFactory,
  Route
} from '@foal/core';

import { ViewService } from '../services';

export class ViewControllerFactory extends ControllerFactory<ViewService> {
  protected getRoutes(controller: ViewService): Route[] {
    return [
      {
        httpMethod: 'GET',
        middleware: (context: Context) => controller.render(context.state),
        path: '/',
        serviceMethodName: 'render',
        successStatus: 200,
      }
    ];
  }
}

export const view = new ViewControllerFactory();
