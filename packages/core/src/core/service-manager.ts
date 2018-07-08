import 'reflect-metadata';

import { Class } from './class.interface';

export function Service() {
  return function decorator(target: any) {};
}

export class ServiceManager {

  readonly map: Map<Class<any>, any>  = new Map();

  set<Service>(ServiceClass: Class<Service>, service: any): void {
    this.map.set(ServiceClass, service);
  }

  get<Service>(ServiceClass: Class<Service>): Service {
    // Get the service if it exists.
    if (this.map.get(ServiceClass)) {
      return this.map.get(ServiceClass);
    }

    // If the service has not been instantiated yet then do it.
    const dependencies = Reflect.getOwnMetadata('design:paramtypes', ServiceClass) || [];
    const service = new ServiceClass(...dependencies.map(Dep => this.get(Dep)));

    // Save and return the service.
    this.map.set(ServiceClass, service);
    return service;
  }

}
