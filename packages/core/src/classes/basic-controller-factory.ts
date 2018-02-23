import { Hook, HttpMethod } from '../interfaces';
import { Controller } from './controller';

export class BasicControllerFactory {
  attachHandlingFunction(httpMethod: HttpMethod, path: string, handlingFunction: Hook): Controller<'default'> {
    const controller = new Controller<'default'>();
    controller.addRoute('default', httpMethod, path, handlingFunction);
    return controller;
  }
}

export const basic = new BasicControllerFactory();