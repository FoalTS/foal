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
 * Identity Mapper that instantiates and returns service singletons.
 */
export class ServiceManager {

  readonly map: Map<Class<any>, any>  = new Map();

  set<Service>(serviceClass: Class<Service>, service: any): void {
    this.map.set(serviceClass, service);
  }

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
    const dependencies: Dependency[] = Reflect.getMetadata('dependencies', serviceClass.prototype) || [];
    const service = new serviceClass();
    dependencies.forEach(dep => service[dep.propertyKey] = this.get(dep.serviceClass));

    // Save and return the service.
    this.map.set(serviceClass, service);
    return service;
  }

}
