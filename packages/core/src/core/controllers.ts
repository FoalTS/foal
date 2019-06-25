// 3p
import 'reflect-metadata';

// FoalTS
import { Class } from './class.interface';
import { Dependency, ServiceManager } from './service-manager';

/**
 * Create a new controller with its dependencies.
 *
 * @export
 * @template Controller
 * @param {Class<Controller>} controllerClass - The controller class.
 * @param {(object|ServiceManager)} [dependencies] - Either a ServiceManager or an
 * object which key/values are the controller properties/instances.
 * @returns {Controller} - The created controller.
 */
export function createController<Controller>(controllerClass: Class<Controller>,
                                             dependencies?: object|ServiceManager): Controller {
  const controllerDependencies: Dependency[] = Reflect.getMetadata('dependencies', controllerClass.prototype) || [];

  let serviceManager = new ServiceManager();

  const service = new controllerClass();

  if (dependencies instanceof ServiceManager) {
    serviceManager = dependencies;
  } else if (typeof dependencies === 'object') {
    controllerDependencies.forEach(dep => {
      const serviceMock = dependencies[dep.propertyKey];
      if (serviceMock) {
        serviceManager.set(dep.serviceClass, serviceMock);
      }
    });
  }
  controllerDependencies.forEach(dep => service[dep.propertyKey] = serviceManager.get(dep.serviceClass));

  return service;
}

/**
 * Identity Mapper that registers controller instances. It is a service.
 *
 * @export
 * @class ControllerManager
 */
export class ControllerManager {

  readonly map: Map<Class<any>, any>  = new Map();

  /**
   * Add a controller to the identity mapper.
   *
   * @template Controller
   * @param {Class<Controller>} controllerClass - The controller class representing the key.
   * @param {*} controller - The controller object representing the value.
   * @memberof ControllerManager
   */
  set<Controller>(controllerClass: Class<Controller>, controller: any): void {
    this.map.set(controllerClass, controller);
  }

  /**
   * Get the controller instance.
   *
   * @template Controller
   * @param {Class<Controller>} controllerClass - The controller class.
   * @returns {Controller} - The controller instance.
   * @memberof ServiceManager
   */
  get<Controller>(controllerClass: Class<Controller>): Controller|undefined {
    return this.map.get(controllerClass);
  }

}
