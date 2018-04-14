import { Handler, HttpMethod } from '../interfaces';
import { Controller } from './controller';

export class BasicControllerFactory {
  public attachHandlingFunction(httpMethod: HttpMethod, path: string, handler: Handler):
      { controller: Controller<'main'> } {
    const controller = new Controller<'main'>();
    controller.addRoute('main', httpMethod, path, handler);
    return { controller };
  }
}

export const basic = new BasicControllerFactory();
