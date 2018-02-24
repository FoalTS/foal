import { Hook, HttpMethod } from '../interfaces';
import { Controller } from './controller';

export class BasicControllerFactory {
  public attachHandlingFunction(httpMethod: HttpMethod, path: string, handlingFunction: Hook): Controller<'main'> {
    const controller = new Controller<'main'>();
    controller.addRoute('main', httpMethod, path, handlingFunction);
    return controller;
  }
}

export const basic = new BasicControllerFactory();
