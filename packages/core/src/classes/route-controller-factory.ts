import { Handler, HttpMethod } from '../interfaces';
import { Controller } from './controller';

export class RouteControllerFactory {
  public attachHandler(httpMethod: HttpMethod, path: string, handler: Handler): Controller<'main'> {
    const controller = new Controller<'main'>();
    controller.addRoute('main', httpMethod, path, handler);
    return controller;
  }
}

export const route = new RouteControllerFactory();
