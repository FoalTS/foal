import {
  Context,
  ControllerFactory,
  Route
} from '../../index';
import { ViewService } from '../services';

export class ViewControllerFactory extends ControllerFactory<ViewService> {
  protected getRoutes(controller: ViewService): Route[] {
    return [
      {
        httpMethod: 'GET',
        path: '/',
        serviceMethodBinder: (context: Context) => controller.render(context.state),
        serviceMethodName: 'render',
        successStatus: 200,
      }
    ];
  }
}

export const view = new ViewControllerFactory();
