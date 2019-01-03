import 'reflect-metadata';

import { Class } from './class.interface';

export interface Dependency {
  propertyKey: string;
  serviceClass: Class;
}

/**
 * Decorator used to inject a service inside a controller or another service.
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
 * @param serviceClass The service class.
 * @param dependencies Either a ServiceManager or an object which key/values are the service properties/instances.
 */
export function createService<Service>(serviceClass: Class<Service>, dependencies?: object|ServiceManager): Service {
  const serviceDependencies: Dependency[] = Reflect.getMetadata('dependencies', serviceClass.prototype) || [];

  let serviceManager = new ServiceManager();

  const service = new serviceClass();

  if (dependencies instanceof ServiceManager) {
    serviceManager = dependencies;
  } else if (typeof dependencies === 'object') {
    serviceDependencies.forEach(dep => {
      const serviceMock = dependencies[dep.propertyKey];
      if (serviceMock) {
        serviceManager.set(dep.serviceClass, serviceMock);
      }
    });
  }
  serviceDependencies.forEach(dep => service[dep.propertyKey] = serviceManager.get(dep.serviceClass));

  return service;
}

/**
 * Identity Mapper that instantiates and returns service singletons.
 */
export class ServiceManager {

  readonly map: Map<Class<any>, any>  = new Map();

  set<Service>(serviceClass: Class<Service>, service: any): void {
    this.map.set(serviceClass, service);
  }

  /**
   * Get or create the service singleton.
   *
   * @param serviceClass
   */
  get<Service>(serviceClass: Class<Service>): Service {
    // The ts-ignores fix TypeScript bugs.
    // @ts-ignore : Type 'ServiceManager' is not assignable to type 'Service'.
    if (serviceClass === ServiceManager) {
      // @ts-ignore : Type 'ServiceManager' is not assignable to type 'Service'.
      return this;
    }
    // Get the service if it exists.
    if (this.map.get(serviceClass)) {
      return this.map.get(serviceClass);
    }

    // If the service has not been instantiated yet then do it.
    const service = createService(serviceClass, this);

    // Save and return the service.
    this.map.set(serviceClass, service);
    return service;
  }

}
