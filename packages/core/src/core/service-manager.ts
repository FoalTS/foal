import 'reflect-metadata';

import { Class } from './class.interface';

export function Service() {
  return function decorator(target: any) {};
}

export interface Dependency {
  propertyKey: string;
  serviceClass: Class;
}

export function service(target: any, propertyKey: string) {
  const serviceClass = Reflect.getMetadata('design:type', target, propertyKey);
  const dependencies: Dependency[] = [ ...(Reflect.getMetadata('dependencies', target) || []) ];
  dependencies.push({ propertyKey, serviceClass });
  Reflect.defineMetadata('dependencies', dependencies, target);
}

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
    const dependencies = Reflect.getOwnMetadata('design:paramtypes', serviceClass) || [];
    const service = new serviceClass(...dependencies.map(Dep => this.get(Dep)));

    // Save and return the service.
    this.map.set(serviceClass, service);
    return service;
  }

}
