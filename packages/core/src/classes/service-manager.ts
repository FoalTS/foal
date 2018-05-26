import 'reflect-metadata';

import { Class } from '../interfaces';

export function Service() {
  return function decorator(target: any) {};
}

export class ServiceManager {

  map: Map<Class<any>, any>  = new Map();

  get<Service>(ServiceClass: Class<Service>): Service {
    // Get the service if it exists.
    if (this.map.get(ServiceClass)) {
      return this.map.get(ServiceClass);
    }

    // If the service has not been instantiated yet then do it.
    const dependencies = Reflect.getMetadata('design:paramtypes', ServiceClass) || [];
    const service = new ServiceClass(...dependencies.map(Dep => this.get(Dep)));

    // Save and return the service.
    this.map.set(ServiceClass, service);
    return service;
  }

}
