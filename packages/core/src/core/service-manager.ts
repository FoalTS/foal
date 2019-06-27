import 'reflect-metadata';

import { Class } from './class.interface';

export interface Dependency {
  propertyKey: string;
  serviceClass: Class;
}

/**
 * Decorator injecting a service inside a controller or another service.
 *
 * @export
 */
export function dependency(target: any, propertyKey: string) {
  const serviceClass = Reflect.getMetadata('design:type', target, propertyKey);
  const dependencies: Dependency[] = [ ...(Reflect.getMetadata('dependencies', target) || []) ];
  dependencies.push({ propertyKey, serviceClass });
  Reflect.defineMetadata('dependencies', dependencies, target);
}

/**
 * Create a new service with its dependencies.
 *
 * @export
 * @template Service
 * @param {Class<Service>} serviceClass - The service class.
 * @param {(object|ServiceManager)} [dependencies] - Either a ServiceManager or an
 * object which key/values are the service properties/instances.
 * @returns {Service} - The created service.
 */
export function createService<Service>(serviceClass: Class<Service>, dependencies?: object|ServiceManager): Service {
  return createControllerOrService(serviceClass, dependencies);
}

export function createControllerOrService<ControllerOrService>(
  controllerOrServiceClass: Class<ControllerOrService>, dependencies?: object|ServiceManager
): ControllerOrService {
  const controllerOrServiceDependencies: Dependency[] = Reflect.getMetadata(
    'dependencies', controllerOrServiceClass.prototype
  ) || [];

  let serviceManager = new ServiceManager();

  const service = new controllerOrServiceClass();

  if (dependencies instanceof ServiceManager) {
    serviceManager = dependencies;
  } else if (typeof dependencies === 'object') {
    controllerOrServiceDependencies.forEach(dep => {
      const serviceMock = dependencies[dep.propertyKey];
      if (serviceMock) {
        serviceManager.set(dep.serviceClass, serviceMock);
      }
    });
  }
  controllerOrServiceDependencies.forEach(dep => service[dep.propertyKey] = serviceManager.get(dep.serviceClass));

  return service;
}

/**
 * Identity Mapper that instantiates and returns service singletons.
 *
 * @export
 * @class ServiceManager
 */
export class ServiceManager {

  readonly map: Map<Class<any>, any>  = new Map();

  /**
   * Add manually a service to the identity mapper. This function is
   * useful during tests to inject mocks.
   *
   * @template Service
   * @param {Class<Service>} serviceClass - The service class representing the key.
   * @param {*} service - The service object (or mock) representing the value.
   * @memberof ServiceManager
   */
  set<Service>(serviceClass: Class<Service>, service: any): void {
    this.map.set(serviceClass, service);
  }

  /**
   * Get (and create if necessary) the service singleton.
   *
   * @template Service
   * @param {Class<Service>} serviceClass - The service class.
   * @returns {Service} - The service instance.
   * @memberof ServiceManager
   */
  get<Service>(serviceClass: Class<Service>): Service {
    // The ts-ignores fix TypeScript bugs.
    // @ts-ignore : Type 'ServiceManager' is not assignable to type 'Service'.
    if (serviceClass === ServiceManager || serviceClass.isServiceManager === true) {
      // @ts-ignore : Type 'ServiceManager' is not assignable to type 'Service'.
      return this;
    }
    // Get the service if it exists.
    if (this.map.get(serviceClass)) {
      return this.map.get(serviceClass);
    }

    // If the service has not been instantiated yet then do it.
    const service = createControllerOrService(serviceClass, this);

    // Save and return the service.
    this.map.set(serviceClass, service);
    return service;
  }

}
