import {
  Type
} from '../interfaces';
import { Controller } from './controller';

export abstract class ServiceControllerFactory<IService, RouteName extends string, Options = undefined> {

  constructor() {}

  public attachService(path: string, ServiceClass: Type<IService>, options?: Options): Controller<RouteName> {
    const controller = new Controller<RouteName>();
    this.defineController(controller, ServiceClass, options);
    controller.addPathAtTheBeginning(path);
    return controller;
  }

  protected abstract defineController(controller: Controller<RouteName>, ServiceClass: Type<IService>,
                                      options?: Options): void;

}
