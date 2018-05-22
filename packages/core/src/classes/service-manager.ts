import 'reflect-metadata';

import { Class } from '../interfaces';

export function Service() {
  return function decorator(target: any) {};
}

export class ServiceManager {

  map: Map<Class<any>, any>  = new Map();

  constructor() {}

  get<Service>(ServiceClass: Class<Service>): Service {
    // Get the service if it exists.
    if (this.map.get(ServiceClass)) {
      return this.map.get(ServiceClass);
    }

    // If the service has not been instantiated yet then do it.
    const dependencies = Reflect.getMetadata('design:paramtypes', ServiceClass);
    if (!Array.isArray(dependencies)) {
      throw new Error(`${ServiceClass.name} has no dependencies. Please check that:
        - The service has a constructor.
        - The service has the @Service() decorator.
        - The "emitDecoratorMetadata" is set to true in the tsconfig.json file.`);
    }
    const service = new ServiceClass(...dependencies.map(Dep => this.get(Dep)));

    // Save and return the service.
    this.map.set(ServiceClass, service);
    return service;
  }

}
