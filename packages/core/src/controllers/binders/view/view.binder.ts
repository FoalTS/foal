import { Context, MethodPrimitiveBinding } from '../../interfaces';
import { ControllerBinder } from '../controller.binder';

import { ViewService } from './view.interface';

export class ViewBinder extends ControllerBinder<ViewService> {
  protected bind(controller: ViewService): MethodPrimitiveBinding[] {
    return [
      {
        controllerMethodBinder: (context: Context) => controller.render(context.state),
        controllerMethodName: 'render',
        httpMethod: 'GET',
        path: '/',
        successStatus: 200,
      }
    ];
  }
}

export const view = new ViewBinder();
