import 'reflect-metadata';

import { Class } from '../interfaces';

export function Service() {
  return function decorator(target: any) {};
}

export class ServiceManager {

  public map: Map<Class<any>, any>  = new Map();

  constructor() {}

  public get<T>(Service: Class<T>): T {
    // Get the service if it exists.
    if (this.map.get(Service)) {
      return this.map.get(Service);
    }

    // If the service has not been instantiated yet then do it.
    const dependencies = Reflect.getMetadata('design:paramtypes', Service);
    if (!Array.isArray(dependencies)) {
      throw new Error(`${Service.name} has no dependencies. Please check that:
        - The service has a constructor.
        - The service has the @Service() decorator.
        - The "emitDecoratorMetadata" is set to true in the tsconfig.json file.`);
    }
    const service = new Service(...dependencies.map(Dep => this.get(Dep)));

    // Save and return the service.
    this.map.set(Service, service);
    return service;
  }

}
